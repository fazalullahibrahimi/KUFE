const mongoose = require("mongoose")

const StudentSchema = new mongoose.Schema(
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
    department_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
      required: true,
    },
    enrollment_year: {
      type: Number,
      required: [true, "Please add an enrollment year"],
    },
    student_id_number: {
      type: String,
      required: [true, "Please add a student ID number"],
      unique: true,
    },
  },
  { timestamps: true }
);

 
const Student= mongoose.model("Student", StudentSchema);
module.exports=Student;