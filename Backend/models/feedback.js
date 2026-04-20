import mongoose from "mongoose";

const feedbackSchema = new mongoose.Schema({
  reportId: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "Report",
},
  message: String,
  rating: Number,
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Feedback", feedbackSchema);