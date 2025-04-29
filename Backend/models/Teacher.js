const mongoose = require("mongoose");

const TeacherSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please add the teacher's name"],
    },
    position: {
      type: String,
      required: [true, "Please add the teacher's position"],
    },
    department_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
      required: [true, "Please add a department ID"],
    },
    department_name: {
      type: String,
      required: [true, "Please add a department name"],
    },
    contact_info: {
      email: {
        type: String,
        required: [true, "Please add an email address"],
      },
      phone: {
        type: String,
        required: false,
      },
      office: {
        type: String,
        required: false,
      },
    },
    profile: {
      bio: {
        type: String,
      },
      education: [
        {
          degree: { type: String },
          institution: { type: String },
          year: { type: Number },
        },
      ],
      research_interests: [String],
      publications: [String],
    },
    image: {
      type: String,
      default: "default-event.jpg",
    },
    featured: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
  },
  { timestamps: true }
);

const Teacher = mongoose.model("Teacher", TeacherSchema);
module.exports = Teacher;
