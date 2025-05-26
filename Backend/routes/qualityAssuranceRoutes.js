const express = require("express");
const {
  createFeedback,
  getAllFeedback,
  getFeedbackById,
  updateFeedbackStatus,
  getMyFeedback,
  getTeacherStats
} = require("../controllers/qualityAssuranceController");

const { authMiddleware } = require("../middleware/authMiddleware");
const { authorize } = require("../middleware/roleCheck");
const roles = require("../config/roles");

const router = express.Router();

// Apply auth middleware to all routes
router.use(authMiddleware);

// Student routes
router.post("/", authorize(roles.STUDENT), createFeedback);
router.get("/my-feedback", authorize(roles.STUDENT), getMyFeedback);

// Admin routes
router.get("/", authorize(roles.ADMIN), getAllFeedback);
router.get("/teacher/:teacherId/stats", authorize(roles.ADMIN), getTeacherStats);
router.patch("/:id/status", authorize(roles.ADMIN), updateFeedbackStatus);

// Shared routes (Admin or feedback owner)
router.get("/:id", getFeedbackById);

module.exports = router;
