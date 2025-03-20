const mongoose = require("mongoose")

const ResearchAuthorSchema = new mongoose.Schema(
  {
    research_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Research",
      required: true,
    },
    author_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    author_type: {
      type: String,
      enum: ["faculty", "student"],
      required: true,
    },
  },
  { timestamps: true }
);

// Ensure an author is only listed once per research
ResearchAuthorSchema.index({ research_id: 1, author_id: 1 }, { unique: true })


const ResearchAuthor = mongoose.model("ResearchAuthor", ResearchAuthorSchema);
module.exports =ResearchAuthor;

