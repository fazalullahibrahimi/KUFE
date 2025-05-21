const mongoose = require("mongoose")

const EnrollmentSchema = new mongoose.Schema(
  {
    student_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },
    course_offering_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CourseOffering",
      required: true,
    },
    grade: {
      type: String,
      enum: ["A", "B", "C", "D", "F", "I", "W", null],
      default: null,
    },
  },
  { timestamps: true }
);

// Ensure a student can only enroll once in a course offering
EnrollmentSchema.index({ student_id: 1, course_offering_id: 1 }, { unique: true })



const Enrollment = mongoose.model("Enrollment", EnrollmentSchema);
module.exports =Enrollment;