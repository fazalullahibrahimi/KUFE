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

module.exports = mongoose.model("Faculty", FacultySchema)

