const mongoose = require("mongoose");

const FacultyMemberSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please add a name"],
      trim: true,
    },
    position: {
      type: String,
      required: [true, "Please add a position"],
    },
    department_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
      required: true,
    },
    contact_info: {
      email: String,
      phone: String,
      office: String,
    },
    profile: {
      bio: String,
      education: [
        {
          degree: String,
          institution: String,
          year: Number,
        },
      ],
      research_interests: [String],
    },
  },
  { timestamps: true }
);

const FacultyMember = mongoose.model("FacultyMember", FacultyMemberSchema);
module.exports = FacultyMember;
