import mongoose from "mongoose";

const teamSchema = new mongoose.Schema({
  name: String,
  members: Number,
  status: {
  type: String,
  enum: ["Available", "Busy"],
  default: "Available"
},
});

export default mongoose.model("Team", teamSchema);