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
    pages: {
      type: Number,
      min: 1,
    },
    category: {
        type: String,
        required: true
    },
    
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    }
  },
  { timestamps: true }
  
);


const Research = mongoose.model("Research", ResearchSchema);
module.exports =Research;