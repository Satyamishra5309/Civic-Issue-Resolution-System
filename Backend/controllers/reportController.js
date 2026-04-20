import Report from "../models/report.js";
import Team from "../models/teams.js";

// GET all reports
export const getReports = async (req, res) => {
  try {
    const reports = await Report.find()
      .populate("assignedTeam") // 🔥 THIS LINE ADDED
      .sort({ submission_date: -1 });

    res.json(reports);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET single report
export const getReportById = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);
    res.json(report);
  } catch (error) {
    res.status(404).json({ message: "Report not found" });
  }
};

// CREATE report (for testing)
export const createReport = async (req, res) => {
  console.log("BODY RECEIVED:", req.body);
  try {
    const report = new Report(req.body);
    await report.save();
    res.status(201).json(report);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// ASSIGN team

export const assignTeam = async (req, res) => {
  const { reportId, teamId } = req.body;

  try {
    const report = await Report.findById(reportId);
    const team = await Team.findById(teamId);

    if (!report || !team) {
      return res.status(404).json({ msg: "Not found" });
    }

    // assign team
    report.assignedTeam = teamId;
    report.status = "In Progress";

    // update team status
    team.status = "Busy";

    await report.save();
    await team.save();

    res.json({ msg: "Team assigned successfully" });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

export const completeReport = async (req, res) => {
  const { reportId } = req.body;

  const report = await Report.findById(reportId).populate("assignedTeam");

  report.status = "Completed";

  if (report.assignedTeam) {
    const team = await Team.findById(report.assignedTeam._id);

    // 🔥 make team available again
    team.status = "Available";
    await team.save();
  }

  await report.save();

  res.json({ msg: "Completed" });
};