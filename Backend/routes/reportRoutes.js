import express from "express";
import upload from "../middleware/upload.js"; // ✅ Cloudinary upload

import {
  getReports,
  getReportById,
  createReport,
  assignTeam,
  startWork,
  uploadCompletionProof,
  verifyReport
} from "../controllers/reportController.js";

const router = express.Router();


// 🔹 GET ROUTES
router.get("/", getReports);
router.get("/:id", getReportById);


// 🟢 USER: Create report (Cloudinary image)
router.post(
  "/",
  upload.single("image"),
  createReport
);


// 🔵 ADMIN: Assign team
router.post("/assign", assignTeam);


// 🟡 FIELD WORKER: Start work
router.post("/start", startWork);


// 🟣 FIELD WORKER: Upload completion proof
router.post(
  "/complete-request",
  upload.single("image"),
  uploadCompletionProof
);


// 🔴 ADMIN: Verify report
router.post("/verify", verifyReport);



export default router;