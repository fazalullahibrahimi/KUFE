const mongoose = require("mongoose")

const FacultySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: ["Please add a name"],
      trim: true,
      maxlength: [100, "Name cannot be more than 100 characters"],
    },
    overview: {
      type: String,
      required: ["Please add an overview"],
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