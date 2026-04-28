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
    const report = await Report.findById(req.params.id).populate("assignedTeam");
    res.json(report);
  } catch (error) {
    res.status(404).json({ message: "Report not found" });
  }
};


// 🟢 CREATE report (WITH IMAGE)
export const createReport = async (req, res) => {
  try {
    console.log("BODY:", req.body);

    const imagePath = req.file ? `/uploads/${req.file.filename}` : null;

    const report = new Report({
      ...req.body,
      image: imagePath,
      status: "Pending",
    });

    await report.save();

    io.emit("new_issue", report);

    res.status(201).json(report);
  } catch (error) {
    res.status(400).json({ message: error.message });
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


// 🟣 FIELD WORKER: Upload completion proof
export const uploadCompletionProof = async (req, res) => {
  const { reportId, lat, lng } = req.body;

  try {
    const report = await Report.findById(reportId);

    const imagePath = req.file ? `/uploads/${req.file.filename}` : null;

    report.completionImage = imagePath;
    report.completionLocation = {
      lat,
      lng,
    };

    report.status = "Verification Pending";

    await report.save();

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
    const report = await Report.findById(reportId).populate("assignedTeam");

    if (approved) {
      report.status = "Completed";
      report.verificationStatus = "Approved";

      if (report.assignedTeam) {
        const team = await Team.findById(report.assignedTeam._id);
        team.status = "Available";
        await team.save();
      }

      io.emit("issue_completed", report);
    } else {
      report.verificationStatus = "Rejected";
    }

    await report.save();

    res.json({ msg: "Verification updated" });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};


// ❌ (OLD - keep for compatibility or remove later)
export const completeReport = async (req, res) => {
  const { reportId } = req.body;

  const report = await Report.findById(reportId).populate("assignedTeam");

  report.status = "Completed";

  if (report.assignedTeam) {
    const team = await Team.findById(report.assignedTeam._id);
    team.status = "Available";
    await team.save();
  }

  await report.save();

  io.emit("issue_updated", report);

  res.json({ msg: "Completed (legacy)" });
};