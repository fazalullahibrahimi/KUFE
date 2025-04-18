const mongoose = require("mongoose")

const AnnouncementSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please add a title"],
      trim: true,
      maxlength: [100, "Title cannot be more than 100 characters"],
    },
    content: {
      type: String,
      required: [true, "Please add content"],
    },
    publish_date: {
      type: Date,
      default: Date.now,
    },
    expiry_date: {
      type: Date,
    },
    category: {
      type: String,
      enum: ["academic",  "workshop", "seminar", "other"],
      default: "academic",
    },
    faculty_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Faculty",
    },
    is_featured: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ["draft", "published", "archived"],
      default: "published",
    },
  },
  { timestamps: true },
)

const Announcement = mongoose.model("Announcement", AnnouncementSchema)
module.exports = Announcement
