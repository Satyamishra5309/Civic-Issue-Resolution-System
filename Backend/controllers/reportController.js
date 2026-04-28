import Report from "../models/report.js";
import Team from "../models/teams.js";
import { io } from "../server.js";


// ✅ GET all reports
export const getReports = async (req, res) => {
  try {
    const reports = await Report.find()
      .populate("assignedTeam")
      .sort({ submission_date: -1 });

    res.json(reports);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// ✅ GET single report
export const getReportById = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id)
      .populate("assignedTeam");

    res.json(report);
  } catch (error) {
    res.status(404).json({ message: "Report not found" });
  }
};


// 🟢 CREATE report (USER - Cloudinary)
export const createReport = async (req, res) => {
  try {
    const { problem_type, description, latitude, longitude } = req.body;

    const report = new Report({
      problem_type,
      description,
      latitude,
      longitude,
      image_url: req.file?.path || "", // ✅ Cloudinary URL
    });

    await report.save();

    // 🔥 real-time update
    io.emit("new_issue", report);

    res.status(201).json(report);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// 🔵 ASSIGN team (ADMIN)
export const assignTeam = async (req, res) => {
  const { reportId, teamId } = req.body;

  try {
    const report = await Report.findById(reportId);
    const team = await Team.findById(teamId);

    if (!report || !team) {
      return res.status(404).json({ msg: "Not found" });
    }

    report.assignedTeam = teamId;
    report.status = "Assigned";

    team.status = "Busy";

    await report.save();
    await team.save();

    io.emit("issue_updated", report);

    res.json({ msg: "Team assigned successfully" });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};


// 🟡 FIELD WORKER: Start Work
export const startWork = async (req, res) => {
  const { reportId } = req.body;

  try {
    const report = await Report.findById(reportId);

    report.status = "In Progress";

    await report.save();

    io.emit("issue_updated", report);

    res.json({ msg: "Work started" });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};


// 🟣 FIELD WORKER: Upload completion proof (Cloudinary)
export const uploadCompletionProof = async (req, res) => {
  const { reportId, lat, lng } = req.body;

  try {
    const report = await Report.findById(reportId);

    if (!report) {
      return res.status(404).json({ msg: "Report not found" });
    }

    // ✅ Cloudinary URL (IMPORTANT FIX)
    const imageUrl = req.file?.path || "";

    report.completionImage = imageUrl;
    report.completionLocation = {
      lat,
      lng,
    };

    report.status = "Verification Pending";

    await report.save();

    // 🔥 real-time event
    io.emit("verification_pending", report);

    res.json({ msg: "Completion proof uploaded" });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};


// 🔴 ADMIN: Verify and Complete
export const verifyReport = async (req, res) => {
  const { reportId, approved } = req.body;

  try {
    const report = await Report.findById(reportId)
      .populate("assignedTeam");

    if (!report) {
      return res.status(404).json({ msg: "Report not found" });
    }

    if (approved) {
      report.status = "Completed";
      report.verificationStatus = "Approved";

      if (report.assignedTeam) {
        const team = await Team.findById(report.assignedTeam._id);
        team.status = "Available";
        await team.save();
      }

      // 🔥 notify frontend
      io.emit("issue_completed", report);

    } else {
      report.verificationStatus = "Rejected";

      // optional: revert to In Progress
      report.status = "In Progress";

      io.emit("issue_updated", report);
    }

    await report.save();

    res.json({ msg: "Verification updated" });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};