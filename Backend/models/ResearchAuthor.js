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

// Ensure an author is only listed once per research
ResearchAuthorSchema.index({ research_id: 1, author_id: 1 }, { unique: true })

module.exports = mongoose.model("ResearchAuthor", ResearchAuthorSchema)

