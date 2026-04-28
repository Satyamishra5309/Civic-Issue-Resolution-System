import express from "express";
import multer from "multer";
import path from "path";

import {
  getReports,
  getReportById,
  createReport,
  assignTeam,
  completeReport,
  startWork,
  uploadCompletionProof,
  verifyReport
} from "../controllers/reportController.js";

const router = express.Router();


// 🔥 MULTER SETUP (IMAGE UPLOAD)

// storage config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // folder to save images
  },
  filename: function (req, file, cb) {
    const uniqueName = Date.now() + path.extname(file.originalname);
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });


// 🔹 ROUTES

// GET
router.get("/", getReports);
router.get("/:id", getReportById);

// 🟢 USER: Create report with image
router.post("/", upload.single("image"), createReport);

// 🔵 ADMIN: Assign team
router.post("/assign", assignTeam);

// 🟡 FIELD WORKER: Start work
router.post("/start", startWork);

// 🟣 FIELD WORKER: Upload completion proof (image + location)
router.post(
  "/complete-request",
  upload.single("image"),
  uploadCompletionProof
);

// 🔴 ADMIN: Verify and mark complete
router.post("/verify", verifyReport);

// (Old complete route — you can remove later if not needed)
router.post("/complete", completeReport);

export default router;