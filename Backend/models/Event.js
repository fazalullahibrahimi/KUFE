const mongoose = require("mongoose")

const EventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please add a title"],
      trim: true,
      maxlength: [100, "Title cannot be more than 100 characters"],
    },
    description: {
      type: String,
      required: [true, "Please add a description"],
    },
    date: {
      type: Date,
      required: [true, "Please add a date"],
    },
    location: {
      type: String,
      required: [true, "Please add a location"],
    },
    type: {
      type: String,
      enum: ["conference", "workshop", "seminar", "other"],
      default: "other",
    },
    faculty_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Faculty",
    },

  },
  { timestamps: true }
);


const Event = mongoose.model("Event", EventSchema);
module.exports=Event;
