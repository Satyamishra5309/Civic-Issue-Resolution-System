import express from "express";
import { registerAdmin, loginAdmin, loginTeam} from "../controllers/authController.js";


const router = express.Router();

router.post("/register", registerAdmin);
router.post("/login", loginAdmin);
router.post("/login", loginTeam);

export default router;