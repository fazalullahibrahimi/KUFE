const mongoose = require("mongoose")

const researchSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
    },
    abstract: {
      type: String,
      required: [true, "Abstract is required"],
    },
    publication_date: {
      type: Date,
      required: [true, "Publication date is required"],
    },
    file_path: {
      type: String,
      required: [false, "File path is required"],
    },
    pages: {
      type: Number,
      required: [true, "Number of pages is required"],
    },
    category: {
      type: String,
      required: [true, "Category is required"],
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    },
    authors: [
      {
        type: String,
        required: [true, "Authors are required"],
      },
    ],
    // Additional fields for student research submission frontend
    student_id: {
      type: String,
      required: false,
    },
    student_name: {
      type: String,
      required: false,
    },
    department_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
      required: false,
    },
    department_name: {
      type: String,
      required: false,
    },
    keywords: [
      {
        type: String,
        required: false,
      },
    ],
    reviewer_comments: {
      type: String,
      default: "",
    },
    reviewer_id: {
      type: String,
      default: "",
    },
    review_date: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true },
)

module.exports = mongoose.model("Research", researchSchema)
