
const mongoose = require("mongoose");

const researchSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
    },
    abstract: {
      type: String,
      required: false,
    },
    publication_date: {
      type: Date,
      required: false,
    },
    file_path: {
      type: String,
      required: false,
    },
    pages: {
      type: Number,
      required: false,
    },
    category: {
      type: String,
      required: false,
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

    // Student information (if submitted by a student)
    student_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
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
      },
    ],

    // Reviewer fields (linked to CommitteeMember model)
    reviewer_comments: {
      type: String,
      default: "",
    },
    reviewer_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CommitteeMember", // Use the actual CommitteeMember model
      required: false,
    },
    review_date: {
      type: Date,
      required: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Research", researchSchema);
