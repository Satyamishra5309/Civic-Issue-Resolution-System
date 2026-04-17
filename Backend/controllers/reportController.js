import Report from "../models/report.js";

// GET all reports
export const getReports = async (req, res) => {
  try {
    const reports = await Report.find().sort({ submission_date: -1 });
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
  try {
    const { reportId, team, priority } = req.body;

    const report = await Report.findById(reportId);

    report.assigned_team = team;
    report.priority = priority;
    report.status = "In Progress";

    await report.save();

    res.json({ message: "Assigned successfully", report });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};