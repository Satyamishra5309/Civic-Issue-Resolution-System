import Feedback from "../models/feedback.js";

export const getAllFeedback = async (req, res) => {
  try {
    const data = await Feedback.find()
      .populate("reportId", "problem_type"); // 🔥 important

    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};




export const getFeedback = async (req, res) => {
  try {
    const { reportId } = req.params;

    const data = await Feedback.find({
      reportId: new mongoose.Types.ObjectId(reportId), // 🔥 FIX
    });

    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const createFeedback = async (req, res) => {
  const fb = new Feedback(req.body);
  await fb.save();
  res.status(201).json(fb);
};