const QualityAssurance = require("../models/QualityAssurance");
const User = require("../models/User");
const Teacher = require("../models/Teacher");
const mongoose = require("mongoose");
const asyncHandler = require("express-async-handler");

// @desc    Create new quality assurance feedback
// @route   POST /api/v1/quality-assurance
// @access  Private (Students only)
const createFeedback = asyncHandler(async (req, res) => {
  const {
    teacher_id,
    class_level,
    attendance_feedback,
    teaching_satisfaction,
    course_materials,
    is_anonymous
  } = req.body;

  // Validate required fields
  if (!teacher_id || !class_level || !attendance_feedback || !teaching_satisfaction || !course_materials) {
    return res.status(400).json({
      success: false,
      message: "All feedback sections are required"
    });
  }

  // Verify teacher exists
  const teacher = await Teacher.findById(teacher_id);
  if (!teacher) {
    return res.status(404).json({
      success: false,
      message: "Teacher not found"
    });
  }

  // Verify user is a student (from auth middleware)
  if (req.user.role !== 'student') {
    return res.status(403).json({
      success: false,
      message: "Only students can submit feedback"
    });
  }

  // Check if student already submitted feedback for this teacher and class
  const existingFeedback = await QualityAssurance.findOne({
    student_id: req.user.id,
    teacher_id,
    class_level
  });

  if (existingFeedback) {
    return res.status(400).json({
      success: false,
      message: "You have already submitted feedback for this teacher and class level"
    });
  }

  // Create feedback
  const feedback = await QualityAssurance.create({
    student_id: req.user.id,
    teacher_id,
    class_level,
    attendance_feedback,
    teaching_satisfaction,
    course_materials,
    is_anonymous: is_anonymous || false
  });

  // Populate teacher and user info for response
  await feedback.populate([
    { path: 'teacher_id', select: 'name department_name position' },
    { path: 'student_id', select: 'fullName email role' }
  ]);

  res.status(201).json({
    success: true,
    message: "Feedback submitted successfully",
    data: feedback
  });
});

// @desc    Get all feedback (Admin only)
// @route   GET /api/v1/quality-assurance
// @access  Private (Admin only)
const getAllFeedback = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, status, teacher_id, class_level } = req.query;

  // Build filter object
  const filter = {};
  if (status) filter.status = status;
  if (teacher_id) filter.teacher_id = teacher_id;
  if (class_level) filter.class_level = class_level;

  const options = {
    page: parseInt(page),
    limit: parseInt(limit),
    sort: { submission_date: -1 },
    populate: [
      { path: 'teacher_id', select: 'name department_name position' },
      { path: 'student_id', select: 'fullName email role' }
    ]
  };

  const feedback = await QualityAssurance.find(filter)
    .populate(options.populate)
    .sort(options.sort)
    .limit(options.limit * 1)
    .skip((options.page - 1) * options.limit);

  const total = await QualityAssurance.countDocuments(filter);

  res.status(200).json({
    success: true,
    count: feedback.length,
    total,
    page: options.page,
    pages: Math.ceil(total / options.limit),
    data: feedback
  });
});

// @desc    Get feedback by ID
// @route   GET /api/v1/quality-assurance/:id
// @access  Private (Admin or feedback owner)
const getFeedbackById = asyncHandler(async (req, res) => {
  const feedback = await QualityAssurance.findById(req.params.id)
    .populate([
      { path: 'teacher_id', select: 'name department_name position contact_info' },
      { path: 'student_id', select: 'fullName email role' }
    ]);

  if (!feedback) {
    return res.status(404).json({
      success: false,
      message: "Feedback not found"
    });
  }

  // Check if user is admin or feedback owner
  if (req.user.role !== 'admin' && feedback.student_id._id.toString() !== req.user.id) {
    return res.status(403).json({
      success: false,
      message: "Not authorized to view this feedback"
    });
  }

  res.status(200).json({
    success: true,
    data: feedback
  });
});

// @desc    Update feedback status (Admin only)
// @route   PATCH /api/v1/quality-assurance/:id/status
// @access  Private (Admin only)
const updateFeedbackStatus = asyncHandler(async (req, res) => {
  const { status, admin_response } = req.body;

  const feedback = await QualityAssurance.findById(req.params.id);

  if (!feedback) {
    return res.status(404).json({
      success: false,
      message: "Feedback not found"
    });
  }

  if (status) feedback.status = status;
  if (admin_response) feedback.admin_response = admin_response;

  await feedback.save();

  await feedback.populate([
    { path: 'teacher_id', select: 'name department_name position' },
    { path: 'student_id', select: 'fullName email role' }
  ]);

  res.status(200).json({
    success: true,
    message: "Feedback status updated successfully",
    data: feedback
  });
});

// @desc    Get student's own feedback
// @route   GET /api/v1/quality-assurance/my-feedback
// @access  Private (Students only)
const getMyFeedback = asyncHandler(async (req, res) => {
  const feedback = await QualityAssurance.find({ student_id: req.user.id })
    .populate([
      { path: 'teacher_id', select: 'name department_name position' }
    ])
    .sort({ submission_date: -1 });

  res.status(200).json({
    success: true,
    count: feedback.length,
    data: feedback
  });
});

// @desc    Get feedback statistics for a teacher
// @route   GET /api/v1/quality-assurance/teacher/:teacherId/stats
// @access  Private (Admin only)
const getTeacherStats = asyncHandler(async (req, res) => {
  const { teacherId } = req.params;

  const stats = await QualityAssurance.aggregate([
    { $match: { teacher_id: new mongoose.Types.ObjectId(teacherId) } },
    {
      $group: {
        _id: "$class_level",
        totalFeedback: { $sum: 1 },
        avgAttendanceRating: { $avg: "$attendance_feedback.rating" },
        avgTeachingRating: { $avg: "$teaching_satisfaction.rating" },
        avgMaterialsRating: { $avg: "$course_materials.rating" },
        avgOverallRating: { $avg: "$overall_rating" }
      }
    },
    { $sort: { _id: 1 } }
  ]);

  res.status(200).json({
    success: true,
    data: stats
  });
});

module.exports = {
  createFeedback,
  getAllFeedback,
  getFeedbackById,
  updateFeedbackStatus,
  getMyFeedback,
  getTeacherStats
};
