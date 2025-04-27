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
    image: {
      type: String,
      default: 'default-event.jpg',
    }

  },
  
  { timestamps: true }
);



const Teacher= mongoose.model("Teacher", TeacherSchema);
module.exports =Teacher;