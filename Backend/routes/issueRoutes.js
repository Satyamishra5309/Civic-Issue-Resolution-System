import express from "express";
import { authTeam } from "../middleware/authteam.js";
import { getAssignedIssues } from "../controllers/reportController.js";

const router = express.Router();

router.get("/assigned", authTeam, getAssignedIssues);

export default router;