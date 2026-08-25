import express from "express";
import {
  runAnalysis,
  getMyAnalyses,
  getAnalysesForJob,
} from "../controllers/analysisController.js";
import { protect } from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/roleMiddleware.js";
import { analysisLimiter } from "../middleware/rateLimiter.js";

const router = express.Router();

router.post(
  "/",
  protect,
  authorize("jobseeker", "admin"),
  analysisLimiter,
  runAnalysis
);

router.get(
  "/mine",
  protect,
  authorize("jobseeker", "admin"),
  getMyAnalyses
);

router.get(
  "/job/:jobId",
  protect,
  authorize("recruiter", "admin"),
  getAnalysesForJob
);

export default router; 
