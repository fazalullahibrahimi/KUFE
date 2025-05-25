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
    mission: {
      type: String,
      required: [true, "Please add a mission statement"],
      trim: true,
      maxlength: [1000, "Mission cannot be more than 1000 characters"],
    },
    vision: {
      type: String,
      required: [true, "Please add a vision statement"],
      trim: true,
      maxlength: [1000, "Vision cannot be more than 1000 characters"],
    },
    values: {
      type: String,
      required: [true, "Please add department values"],
      trim: true,
      maxlength: [1000, "Values cannot be more than 1000 characters"],
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
