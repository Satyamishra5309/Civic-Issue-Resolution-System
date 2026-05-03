import Team from "../models/teams.js";
import Report from "../models/report.js";
import bcrypt from "bcryptjs";

export const getTeams = async (req, res) => {
  try {
    const teams = await Team.find();

    console.log("Teams found:", teams.length);

    const updatedTeams = await Promise.all(
      teams.map(async (team) => {
        const activeReport = await Report.findOne({
          assignedTeam: team._id,
          status: { $in: ["Assigned", "In Progress", "Verification Pending"] }
        });

        return {
          _id: team._id,
          name: team.name,
          status: activeReport ? "Busy" : "Available",
          members: team.members
        };
      })
    );

    res.json(updatedTeams);

  } catch (err) {
    console.error("GET TEAMS ERROR:", err);
    res.status(500).json({ msg: err.message });
  }
};

// CREATE team


export const createTeam = async (req, res) => {
  try {
    const { name, email, password, members, status } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const team = new Team({
      name,
      email,
      password: hashedPassword,
      members,
      status
    });

    await team.save();

    res.json({ msg: "Team created successfully" });

  } catch (error) {
    res.status(500).json({ msg: "Error creating team" });
  }
};