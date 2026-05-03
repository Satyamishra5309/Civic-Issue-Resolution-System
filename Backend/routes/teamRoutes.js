import express from "express";
import { getTeams, createTeam } from "../controllers/teamController.js";
import { loginTeam } from "../controllers/authController.js";

const router = express.Router();

router.get("/", getTeams);
router.post("/", createTeam);
router.post("/login", loginTeam);

export default router;