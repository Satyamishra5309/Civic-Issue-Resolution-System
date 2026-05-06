import mongoose from "mongoose";

const reportSchema = new mongoose.Schema({
  problem_type: String,
  description: String,

  // 🟢 USER IMAGE (complaint)
  image: String,

  // 📍 USER LOCATION
  latitude: Number,
  longitude: Number,

  // 🔄 STATUS FLOW
  status: {
    type: String,
    enum: [
      "Pending",
      "Assigned",
      "In Progress",
      "Verification Pending",
      "Completed"
    ],
    default: "Pending",
  },

  // ⚡ PRIORITY
  priority: {
    type: String,
    default: "Low",
  },

  // 👥 TEAM ASSIGNMENT
  assignedTeam: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Team",
    default: null,
  },

  // 🟣 COMPLETION PROOF (FIELD WORKER)
completionImage: String,

completionLocation: {
  lat: Number,
  lng: Number
},

  // 🔴 ADMIN VERIFICATION
  verificationStatus: {
    type: String,
    enum: ["Pending", "Approved", "Rejected"],
    default: "Pending",
  },

  // 📅 TIMESTAMPS
  submission_date: {
    type: Date,
    default: Date.now,
  },

  completedAt: Date,
});

export default mongoose.model("Report", reportSchema);