import express from "express";
import {
  getReports,
  getReportById,
  createReport,
  assignTeam,
} from "../controllers/reportController.js";

const router = express.Router();

router.get("/", getReports);
router.get("/:id", getReportById);
router.post("/", createReport);
router.post("/assign", assignTeam);

export default router;