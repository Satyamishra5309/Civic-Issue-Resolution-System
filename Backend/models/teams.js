import mongoose from "mongoose";

const teamSchema = new mongoose.Schema({
  name: String,
  members: Number,
   email: { type: String, unique: true },
  password: String,
  status: {
  type: String,
  enum: ["Available", "Busy"],
  default: "Available"
},
});

export default mongoose.model("Team", teamSchema);