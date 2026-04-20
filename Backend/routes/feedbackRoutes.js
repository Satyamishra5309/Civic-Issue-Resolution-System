import express from "express";
import { getFeedback, createFeedback, getAllFeedback } from "../controllers/feedbackController.js";

const router = express.Router();

router.get("/:reportId", getFeedback);
router.post("/", createFeedback);
router.get("/", getAllFeedback);

export default router;