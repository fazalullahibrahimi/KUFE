const mongoose = require("mongoose")

const ResearchSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please add a title"],
      trim: true,
      maxlength: [200, "Title cannot be more than 200 characters"],
    },
    abstract: {
      type: String,
      required: [true, "Please add an abstract"],
    },
    publication_date: {
      type: Date,
    },
    file_path: {
      type: String,
    },
    status: {
      type: String,
      enum: ["submitted", "under review", "published"],
      default: "submitted",
    },
  },
  { timestamps: true }
  
);


const Research = mongoose.model("Research", ResearchSchema);
module.exports =Research;