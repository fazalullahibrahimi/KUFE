const mongoose = require("mongoose")

const NewsSchema = new mongoose.Schema(
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
    category: {
      type: String,
      enum: ["academic", "events", "announcements", "research", "other"],
      default: "announcements",
    },
    faculty_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Faculty",
    },
  },
  { timestamps: true }
);

const News= mongoose.model("News", NewsSchema);
module.exports =News;