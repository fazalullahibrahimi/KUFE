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
  },
  { timestamps: true }
);


const Course = mongoose.model("Course", CourseSchema);
 module.exports = Course;
