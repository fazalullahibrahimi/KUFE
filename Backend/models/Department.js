const mongoose = require("mongoose")

const DepartmentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please add a name"],
      unique: true,
      trim: true,
      maxlength: [100, "Name cannot be more than 100 characters"],
    },
    description: {
      type: String,
      required: [true, "Please add a description"],
    },
    head_of_department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    faculty: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Faculty",
      required: true,
    },
  },
  { timestamps: true }
);


const Department= mongoose.model("Department", DepartmentSchema);
 module.exports = Department;
