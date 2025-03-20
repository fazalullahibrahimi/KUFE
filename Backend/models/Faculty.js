const mongoose = require("mongoose")

const FacultySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please add a name"],
      unique: true,
      trim: true,
      maxlength: [100, "Name cannot be more than 100 characters"],
    },
    overview: {
      type: String,
      required: [true, "Please add an overview"],
    },
    mission: {
      type: String,
    },
    vision: {
      type: String,
    },
    history: {
      type: String,
    },
  },
  { timestamps: true }
);


const Faculty= mongoose.model("Faculty", FacultySchema);
module.exports = Faculty;