import JobPosting from "../models/JobPosting.js";


export const createJob = async (req, res) => {
  try {
    const { title, company, description, location } = req.body;

    if (!title || !company || !description) {
      return res.status(400).json({ message: "Title, company, and description are required" });
    }

    const job = await JobPosting.create({
      recruiter: req.user.id,
      title,
      company,
      description,
      location,
    });

    res.status(201).json(job);
  } catch (err) {
    res.status(500).json({ message: "Failed to create job posting", error: err.message });
  }
};


export const getJobs = async (req, res) => {
  try {
    const filter = { isActive: true };


    if (req.query.mine === "true") {
      filter.recruiter = req.user.id;
      delete filter.isActive;
    }

    const jobs = await JobPosting.find(filter)
      .populate("recruiter", "name email")
      .sort({ createdAt: -1 });

    res.json(jobs);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch job postings", error: err.message });
  }
};

export const getJobById = async (req, res) => {
  try {
    const job = await JobPosting.findById(req.params.id).populate("recruiter", "name email");
    if (!job) return res.status(404).json({ message: "Job posting not found" });
    res.json(job);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch job posting", error: err.message });
  }
};

// @route DELETE /api/jobs/:id  (owning recruiter or admin only)
export const deleteJob = async (req, res) => {
  try {
    const job = await JobPosting.findById(req.params.id);
    if (!job) return res.status(404).json({ message: "Job posting not found" });

    const isOwner = job.recruiter.toString() === req.user.id;
    if (!isOwner && req.user.role !== "admin") {
      return res.status(403).json({ message: "You can only delete your own job postings" });
    }

    await job.deleteOne();
    res.json({ message: "Job posting deleted" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete job posting", error: err.message });
  }
};
