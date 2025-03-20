const mongoose = require("mongoose")

const ResourceSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please add a title"],
      trim: true,
      maxlength: [100, "Title cannot be more than 100 characters"],
    },
    description: {
      type: String,
      required: [true, "Please add a description"],
    },
    file_path: {
      type: String,
      required: [true, "Please add a file path"],
    },
    type: {
      type: String,
      enum: ["lecture note", "syllabus", "research paper", "other"],
      default: "other",
    },
    uploader_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    course_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
    },
  },
  { timestamps: true }
);

const Resource= mongoose.model("Resource", ResourceSchema);
module.exports =Resource;
