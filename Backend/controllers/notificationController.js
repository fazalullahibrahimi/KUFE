const Notification = require("../models/Notification");
const User = require("../models/User");
const asyncHandler = require("../middleware/asyncHandler");
const apiResponse = require("../utils/apiResponse");

// @desc    Get user notifications
// @route   GET /api/notifications
// @access  Private
const getUserNotifications = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, unreadOnly = false } = req.query;
  const userId = req.user._id;

  // Build query
  const query = { recipient: userId };
  if (unreadOnly === 'true') {
    query.read = false;
  }

  // Get notifications with pagination
  const notifications = await Notification.find(query)
    .populate('sender', 'fullName email')
    .sort({ createdAt: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .lean();

  // Get total count
  const total = await Notification.countDocuments(query);
  const unreadCount = await Notification.countDocuments({ 
    recipient: userId, 
    read: false 
  });

  res.status(200).json(
    apiResponse.success("Notifications retrieved successfully", {
      notifications,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalNotifications: total,
        unreadCount,
        hasNextPage: page < Math.ceil(total / limit),
        hasPrevPage: page > 1,
      }
    })
  );
});

// @desc    Mark notification as read
// @route   PATCH /api/notifications/:id/read
// @access  Private
const markAsRead = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user._id;

  const notification = await Notification.findOneAndUpdate(
    { _id: id, recipient: userId },
    { 
      read: true, 
      readAt: new Date() 
    },
    { new: true }
  );

  if (!notification) {
    return res.status(404).json(
      apiResponse.error("Notification not found", 404)
    );
  }

  res.status(200).json(
    apiResponse.success("Notification marked as read", { notification })
  );
});

// @desc    Mark all notifications as read
// @route   PATCH /api/notifications/mark-all-read
// @access  Private
const markAllAsRead = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const result = await Notification.updateMany(
    { recipient: userId, read: false },
    { 
      read: true, 
      readAt: new Date() 
    }
  );

  res.status(200).json(
    apiResponse.success("All notifications marked as read", {
      modifiedCount: result.modifiedCount
    })
  );
});

// @desc    Delete notification
// @route   DELETE /api/notifications/:id
// @access  Private
const deleteNotification = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user._id;

  const notification = await Notification.findOneAndDelete({
    _id: id,
    recipient: userId
  });

  if (!notification) {
    return res.status(404).json(
      apiResponse.error("Notification not found", 404)
    );
  }

  res.status(200).json(
    apiResponse.success("Notification deleted successfully")
  );
});

// @desc    Create notification (Admin only)
// @route   POST /api/notifications
// @access  Private (Admin)
const createNotification = asyncHandler(async (req, res) => {
  const { title, message, type, priority, recipient, actionUrl, data } = req.body;
  const senderId = req.user._id;

  // Validate recipient
  if (recipient) {
    const recipientUser = await User.findById(recipient);
    if (!recipientUser) {
      return res.status(404).json(
        apiResponse.error("Recipient user not found", 404)
      );
    }
  }

  const notification = await Notification.create({
    title,
    message,
    type: type || 'general',
    priority: priority || 'medium',
    recipient,
    sender: senderId,
    actionUrl,
    data
  });

  await notification.populate('sender', 'fullName email');
  await notification.populate('recipient', 'fullName email');

  res.status(201).json(
    apiResponse.success("Notification created successfully", { notification })
  );
});

// @desc    Create system notification for all admins
// @route   POST /api/notifications/system
// @access  Private (Admin)
const createSystemNotification = asyncHandler(async (req, res) => {
  const { title, message, type, priority, actionUrl, data } = req.body;
  const senderId = req.user._id;

  // Get all admin users
  const adminUsers = await User.find({ role: 'admin' }).select('_id');

  // Create notifications for all admins
  const notifications = await Promise.all(
    adminUsers.map(admin => 
      Notification.create({
        title,
        message,
        type: type || 'system',
        priority: priority || 'medium',
        recipient: admin._id,
        sender: senderId,
        actionUrl,
        data
      })
    )
  );

  res.status(201).json(
    apiResponse.success("System notifications created successfully", {
      count: notifications.length,
      notifications
    })
  );
});

// @desc    Get notification statistics
// @route   GET /api/notifications/stats
// @access  Private
const getNotificationStats = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const stats = await Notification.aggregate([
    { $match: { recipient: userId } },
    {
      $group: {
        _id: null,
        total: { $sum: 1 },
        unread: { $sum: { $cond: [{ $eq: ["$read", false] }, 1, 0] } },
        high_priority: { $sum: { $cond: [{ $eq: ["$priority", "high"] }, 1, 0] } },
        urgent: { $sum: { $cond: [{ $eq: ["$priority", "urgent"] }, 1, 0] } }
      }
    }
  ]);

  const result = stats[0] || { total: 0, unread: 0, high_priority: 0, urgent: 0 };

  res.status(200).json(
    apiResponse.success("Notification statistics retrieved successfully", result)
  );
});

module.exports = {
  getUserNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  createNotification,
  createSystemNotification,
  getNotificationStats
};
