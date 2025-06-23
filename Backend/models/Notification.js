const mongoose = require("mongoose");

const NotificationSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please add a title"],
      trim: true,
      maxlength: [100, "Title cannot be more than 100 characters"],
    },
    message: {
      type: String,
      required: [true, "Please add a message"],
      maxlength: [500, "Message cannot be more than 500 characters"],
    },
    type: {
      type: String,
      enum: [
        "system",
        "user_registration", 
        "course_update",
        "research_submission",
        "research_review",
        "marks_added",
        "event_created",
        "announcement",
        "maintenance",
        "security",
        "general"
      ],
      default: "general",
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high", "urgent"],
      default: "medium",
    },
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    read: {
      type: Boolean,
      default: false,
    },
    readAt: {
      type: Date,
    },
    data: {
      type: mongoose.Schema.Types.Mixed, // For storing additional data like IDs, URLs, etc.
    },
    actionUrl: {
      type: String, // URL to navigate when notification is clicked
    },
    expiresAt: {
      type: Date,
      default: () => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
    },
  },
  { 
    timestamps: true,
    // Automatically delete expired notifications
    expireAfterSeconds: 0,
    expireAfterSecondsField: 'expiresAt'
  }
);

// Index for better query performance
NotificationSchema.index({ recipient: 1, read: 1, createdAt: -1 });
NotificationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Virtual for time ago
NotificationSchema.virtual('timeAgo').get(function() {
  const now = new Date();
  const diff = now - this.createdAt;
  
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  
  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  if (days < 7) return `${days} day${days > 1 ? 's' : ''} ago`;
  
  return this.createdAt.toLocaleDateString();
});

// Ensure virtual fields are serialized
NotificationSchema.set('toJSON', { virtuals: true });

const Notification = mongoose.model("Notification", NotificationSchema);
module.exports = Notification;
