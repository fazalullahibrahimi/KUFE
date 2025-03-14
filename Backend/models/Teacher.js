const mongoose = require("mongoose")

const TeacherSchema = new mongoose.Schema(
  {
    faculty_member_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "FacultyMember",
      required: true,
    },
    specialization: {
      type: String,
      required: [true, "Please add a specialization"],
    },
    office_hours: {
      type: String,
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

module.exports = mongoose.model("Teacher", TeacherSchema)

