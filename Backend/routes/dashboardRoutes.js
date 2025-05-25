const express = require("express");
const {
  getDashboardOverview,
  getCourseStatistics,
  getTeacherStatistics,
  getResearchStatistics,
  getActivityStatistics,
  getRecentActivities
} = require("../controllers/dashboardController");

const router = express.Router();

// Dashboard overview routes
router.get("/overview", getDashboardOverview);
router.get("/course-stats", getCourseStatistics);
router.get("/teacher-stats", getTeacherStatistics);
router.get("/research-stats", getResearchStatistics);
router.get("/activity-stats", getActivityStatistics);
router.get("/recent-activities", getRecentActivities);

module.exports = router;
