
const mongoose = require("mongoose");

const committeeMemberSchema = new mongoose.Schema(
  {
    memberId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department", // refers to your Department model
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("CommitteeMember", committeeMemberSchema);
