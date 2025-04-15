const mongoose = require("mongoose");

const CourseSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: [true, "Please add a course code"],
      unique: true,
      trim: true,
    },
    name: {
      type: String,
      required: [true, "Please add a name"],
      trim: true,
      maxlength: [100, "Name cannot be more than 100 characters"],
    },
    description: {
      type: String,
      required: [true, "Please add a description"],
    },
    credits: {
      type: Number,
      required: [true, "Please add credit hours"],
    },
    department_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
      required: true,
    },
    instructor: {
      type: String,
      required: [true, "Please add the instructor's name"],
    },
    semester: {
      type: String,
      enum: ["Fall", "Spring", "Summer"],
      required: [true, "Please specify the semester"],
    },
    level: {
      type: String,
      enum: ["Undergraduate", "Graduate"],
      required: [true, "Please specify the course level"],
    },
    schedule: {
      type: String,
      required: [true, "Please add the course schedule"],
    },
    location: {
      type: String,
      required: [true, "Please add the course location"],
    },
    materials: [
      {
        id: {
          type: Number,
          required: true,
        },
        title: {
          type: String,
          required: true,
        },
        type: {
          type: String,
          enum: ["pdf", "docx", "ppt", "other"],
          required: true,
        },
        size: {
          type: String,
          required: true,
        },
      },
    ],
    prerequisites: {
      type: [String],
      default: [],
    },
    image: {
      type: String,
      default: "/placeholder.svg?height=200&width=300",
    },
  },
  { timestamps: true }
);

const Course = mongoose.model("Course", CourseSchema);
module.exports = Course;
