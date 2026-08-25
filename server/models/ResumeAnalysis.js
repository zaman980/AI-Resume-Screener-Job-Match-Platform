import mongoose from "mongoose";

const resumeAnalysisSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "JobPosting",
      required: true,
    },
    resumeText: {
      type: String,
      required: true,
    },
    matchScore: {
      type: Number,
      min: 0,
      max: 100,
      required: true,
    },
    missingKeywords: [{ type: String }],
    strengths: [{ type: String }],
    suggestions: [{ type: String }],
  },
  { timestamps: true }
);

export default mongoose.model("ResumeAnalysis", resumeAnalysisSchema); // ✅ ES Module export
