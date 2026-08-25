import ResumeAnalysis from "../models/ResumeAnalysis.js";
import JobPosting from "../models/JobPosting.js";
import { analyzeResume } from "../services/geminiService.js";

// @route POST /api/analysis   (jobseeker, admin)
export const runAnalysis = async (req, res) => {
  try {
    const { resumeText, jobId } = req.body;

    if (!resumeText || !jobId) {
      return res.status(400).json({ message: "resumeText and jobId are required" });
    }

    const job = await JobPosting.findById(jobId);
    if (!job) return res.status(404).json({ message: "Job posting not found" });

    const result = await analyzeResume(resumeText, job.description);

    const saved = await ResumeAnalysis.create({
      user: req.user.id,
      job: job._id,
      resumeText,
      ...result,
    });

    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ message: "Analysis failed", error: err.message });
  }
};

// @route GET /api/analysis/mine   (jobseeker - only their own analyses)
export const getMyAnalyses = async (req, res) => {
  try {
    const analyses = await ResumeAnalysis.find({ user: req.user.id })
      .populate("job", "title company")
      .sort({ createdAt: -1 });
    res.json(analyses);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch analyses", error: err.message });
  }
};

// @route GET /api/analysis/job/:jobId   (owning recruiter or admin only)
export const getAnalysesForJob = async (req, res) => {
  try {
    const job = await JobPosting.findById(req.params.jobId);
    if (!job) return res.status(404).json({ message: "Job posting not found" });

    const isOwner = job.recruiter.toString() === req.user.id;
    if (!isOwner && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized to view analyses for this job" });
    }

    const analyses = await ResumeAnalysis.find({ job: job._id })
      .populate("user", "name email")
      .sort({ matchScore: -1 });

    res.json(analyses);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch analyses", error: err.message });
  }
};
