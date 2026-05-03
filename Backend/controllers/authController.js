import Admin from "../models/admin.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Team from "../models/teams.js";

export const registerAdmin = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const exists = await Admin.findOne({ email });
    if (exists) return res.status(400).json({ msg: "Admin already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = new Admin({
      name,
      email,
      password: hashedPassword,
    });

    await admin.save();

    res.status(201).json({ msg: "Admin registered successfully" });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

export const loginAdmin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(400).json({ msg: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

    const token = jwt.sign(
      { id: admin._id },
      "secretkey",
      { expiresIn: "1d" }
    );

    res.json({
  token,
  admin: {
    name: admin.name,
    email: admin.email,
  },
});
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};



export const loginTeam = async (req, res) => {
  try {
    const { email, password } = req.body;

    const team = await Team.findOne({ email });
    if (!team) {
      return res.status(400).json({ msg: "Invalid email" });
    }

    const isMatch = await bcrypt.compare(password, team.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid password" });
    }

    const token = jwt.sign(
      { id: team._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({ token, team });

  } catch (err) {
    console.error("LOGIN ERROR:", err);   // 👈 IMPORTANT
    res.status(500).json({ msg: err.message }); // 👈 SHOW REAL ERROR
  }
};