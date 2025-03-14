const mongoose = require("mongoose")

const CourseOfferingSchema = new mongoose.Schema(
  {
    course_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    teacher_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Teacher",
      required: true,
    },
    semester: {
      type: String,
      required: [true, "Please add a semester"],
      enum: ["Fall", "Spring", "Summer"],
    },
    year: {
      type: Number,
      required: [true, "Please add a year"],
    },
    schedule: {
      days: [
        {
          type: String,
          enum: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
        },
      ],
      start_time: String,
      end_time: String,
      location: String,
    },
    created_at: {
      type: Date,
      default: Date.now,
    },
    updated_at: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  },
)

module.exports = mongoose.model("CourseOffering", CourseOfferingSchema)

