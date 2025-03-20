const mongoose = require("mongoose")

const FacultyMemberSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: [true, "Please add a name"],
      trim: true,
      maxlength: [100, "Name cannot be more than 100 characters"],
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