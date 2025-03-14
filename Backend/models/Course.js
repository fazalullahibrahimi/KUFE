const mongoose = require("mongoose")

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

module.exports = mongoose.model("Course", CourseSchema)

