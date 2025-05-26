const mongoose = require("mongoose");

const QualityAssuranceSchema = new mongoose.Schema(
  {
    student_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Student ID is required"],
    },
    teacher_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Teacher",
      required: [true, "Teacher ID is required"],
    },
    class_level: {
      type: String,
      enum: ["first", "second", "third", "fourth"],
      required: [true, "Class level is required"],
    },

    // Section 1: Teacher Attendance Feedback
    attendance_feedback: {
      rating: {
        type: Number,
        min: 1,
        max: 5,
        required: [true, "Attendance rating is required"],
      },
      comments: {
        type: String,
        trim: true,
        maxlength: [1000, "Comments cannot exceed 1000 characters"],
      },
    },

    // Section 2: Teaching Satisfaction Feedback
    teaching_satisfaction: {
      rating: {
        type: Number,
        min: 1,
        max: 5,
        required: [true, "Teaching satisfaction rating is required"],
      },
      comments: {
        type: String,
        trim: true,
        maxlength: [1000, "Comments cannot exceed 1000 characters"],
      },
    },

    // Section 3: Course Materials Feedback
    course_materials: {
      rating: {
        type: Number,
        min: 1,
        max: 5,
        required: [true, "Course materials rating is required"],
      },
      comments: {
        type: String,
        trim: true,
        maxlength: [1000, "Comments cannot exceed 1000 characters"],
      },
    },

    // Overall feedback
    overall_rating: {
      type: Number,
      min: 1,
      max: 5,
      default: function() {
        return Math.round((this.attendance_feedback.rating +
                          this.teaching_satisfaction.rating +
                          this.course_materials.rating) / 3);
      },
    },

    // Status for admin review
    status: {
      type: String,
      enum: ["pending", "reviewed", "resolved"],
      default: "pending",
    },

    // Admin response
    admin_response: {
      type: String,
      trim: true,
      maxlength: [2000, "Admin response cannot exceed 2000 characters"],
    },

    // Submission metadata
    submission_date: {
      type: Date,
      default: Date.now,
    },

    // Anonymous submission option
    is_anonymous: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient queries
QualityAssuranceSchema.index({ teacher_id: 1, class_level: 1 });
QualityAssuranceSchema.index({ student_id: 1 });
QualityAssuranceSchema.index({ status: 1 });
QualityAssuranceSchema.index({ submission_date: -1 });

// Virtual for average rating calculation
QualityAssuranceSchema.virtual('average_rating').get(function() {
  return Math.round((this.attendance_feedback.rating +
                    this.teaching_satisfaction.rating +
                    this.course_materials.rating) / 3 * 10) / 10;
});

// Ensure virtual fields are serialized
QualityAssuranceSchema.set('toJSON', { virtuals: true });

const QualityAssurance = mongoose.model("QualityAssurance", QualityAssuranceSchema);
module.exports = QualityAssurance;
