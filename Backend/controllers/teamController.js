import Team from "../models/teams.js";

// GET all teams
export const getTeams = async (req, res) => {
  const teams = await Team.find();
  res.json(teams);
};

// CREATE team
export const createTeam = async (req, res) => {
  const team = new Team(req.body);
  await team.save();
  res.status(201).json(team);
};