import express from "express";
import {
  createJob,
  getJobs,
  getJobById,
  deleteJob,
} from "../controllers/jobController.js";
import { protect } from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.get("/", protect, getJobs);
router.get("/:id", protect, getJobById);
router.post("/", protect, authorize("recruiter", "admin"), createJob);
router.delete("/:id", protect, authorize("recruiter", "admin"), deleteJob);

export default router; 
