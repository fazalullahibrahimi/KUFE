const mongoose = require("mongoose");

const committeeMemberSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
      required: true,
    },
    academicRank: {
      type: String,
      required: true,
      trim: true,
    },
    committeePosition: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      match: [/.+\@.+\..+/, "Please fill a valid email address"],
    },
    phoneNumber: {
      type: String,
      required: true,
      trim: true,
      match: [/^\+?\d{10,15}$/, "Please fill a valid phone number"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("CommitteeMember", committeeMemberSchema);
