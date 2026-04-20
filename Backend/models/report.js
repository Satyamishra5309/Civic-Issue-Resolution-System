import mongoose from "mongoose";

const reportSchema = new mongoose.Schema({
  problem_type: String,
  description: String,
  image_url: String,

  latitude: Number,
  longitude: Number,

  status: {
    type: String,
    default: "Pending",
  },

  priority: {
    type: String,
    default: "Low",
  },

  assignedTeam: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Team",
    default: null,
  },

  submission_date: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Report", reportSchema);