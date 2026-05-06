import express from "express";
import upload from "../middleware/upload.js"; // ✅ Cloudinary upload
import { authTeam } from "../middleware/authteam.js";
import { getAssignedIssues } from "../controllers/reportController.js";

import {
  getReports,
  getReportById,
  createReport,
  assignTeam,
  getReportsByTeam,
  startWork,
  uploadCompletionProof,
  verifyReport
} from "../controllers/reportController.js";

const router = express.Router();


// 🔹 GET ROUTES
router.get("/", getReports);
router.get("/assigned", authTeam, getAssignedIssues);
router.get("/:id", getReportById);


// 🟢 USER: Create report (Cloudinary image)
// router.post("/", (req, res, next) => {
//   console.log("🔥 Route hit BEFORE multer");
//   next();
// }, upload.single("image"), (req, res, next) => {
//   console.log("🔥 After multer:", req.file);
//   next();
// }, createReport);

router.post("/", upload.single("image"), (req, res, next) => {
  console.log("🔥 FILE AFTER FIX:", req.file);
  next();
}, createReport);


// 🔵 ADMIN: Assign team
router.post("/assign", assignTeam);


// 🟡 FIELD WORKER: Start work
router.post("/start", startWork);

router.get("/team/:teamId", getReportsByTeam);
// 🟣 FIELD WORKER: Upload completion proof
router.post(
  "/complete-request",
  upload.single("image"),
  uploadCompletionProof
);


// 🔴 ADMIN: Verify report
router.post("/verify", verifyReport);



export default router;