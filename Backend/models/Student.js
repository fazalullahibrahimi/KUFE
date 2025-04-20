const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Student name is required"],
      trim: true,
      maxlength: [100, "Name must not exceed 100 characters"],
    },
    department_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
      required: [true, "Department reference is required"],
    },
    student_id_number: {
      type: String,
      required: [true, "Student ID number is required"],
      unique: true,
      trim: true,
    },
    enrollment_year: {
      type: Number,
      required: [true, "Enrollment year is required"],
      min: [1900, "Year is too old"],
      max: [new Date().getFullYear(), "Year cannot be in the future"],
    },
    date_of_birth: {
      type: Date,
      required: [true, "Date of birth is required"],
    },
    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
      required: [true, "Gender is required"],
    },
    email: {
      type: String,
      required: [true, "Email address is required"],
      trim: true,
      lowercase: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please enter a valid email address",
      ],
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      match: [/^\+?[0-9]{10,15}$/, "Please enter a valid phone number"],
    },
    address: {
      street: { type: String, trim: true },
      city: { type: String, trim: true },
      country: { type: String, trim: true, default: "Afghanistan" },
    },
    status: {
      type: String,
      enum: ["active", "graduated", "suspended", "dropped"],
      default: "active",
    },
    profile_image: {
      type: String,
      default: "default-student.jpg",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Student", studentSchema);
