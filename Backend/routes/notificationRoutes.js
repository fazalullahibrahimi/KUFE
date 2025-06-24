const express = require("express");
const {
  getUserNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  createNotification,
  createSystemNotification,
  getNotificationStats
} = require("../controllers/notificationController");
const { authMiddleware, authorizeAdmin } = require("../middleware/authMiddleware");

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

// User notification routes
router.get("/", getUserNotifications);
router.get("/stats", getNotificationStats);
router.patch("/:id/read", markAsRead);
router.patch("/mark-all-read", markAllAsRead);
router.delete("/:id", deleteNotification);

// Admin only routes
router.post("/", authorizeAdmin, createNotification);
router.post("/system", authorizeAdmin, createSystemNotification);

module.exports = router;
