const Enrollment = require("../models/Enrollment")
const Student = require("../models/Student")
const CourseOffering = require("../models/CourseOffering")
const apiResponse = require("../utils/apiResponse")
const logger = require("../utils/logger")

// @desc    Get all enrollments
// @route   GET /api/enrollments
// @access  Private/Admin/Faculty
exports.getEnrollments = async (req, res) => {
  try {
    let query

    // For students, only show their enrollments
    if (req.user.role === "student") {
      const student = await Student.findOne({ user_id: req.user.id })

      if (!student) {
        return res.status(404).json(apiResponse.error("Student profile not found", 404))
      }

      query = Enrollment.find({ student_id: student._id })
    } else {
      // For admin and faculty, show all enrollments
      query = Enrollment.find()
    }

    // Populate with related data
    query = query.populate([
      {
        path: "student_id",
        select: "name student_id_number",
        populate: {
          path: "user_id",
          select: "email",
        },
      },
      {
        path: "course_offering_id",
        populate: [
          {
            path: "course_id",
            select: "code name credits",
          },
          {
            path: "teacher_id",
            select: "specialization",
            populate: {
              path: "faculty_member_id",
              select: "name position",
            },
          },
        ],
      },
    ])

    const enrollments = await query

    res.status(200).json(
      apiResponse.success("Enrollments retrieved successfully", {
        count: enrollments.length,
        enrollments,
      }),
    )
  } catch (err) {
    logger.error(`Error in getEnrollments: ${err.message}`)
    res.status(500).json(apiResponse.error("Server error", 500))
  }
}

// @desc    Get single enrollment
// @route   GET /api/enrollments/:id
// @access  Private
exports.getEnrollment = async (req, res) => {
  try {
    const enrollment = await Enrollment.findById(req.params.id).populate([
      {
        path: "student_id",
        select: "name student_id_number",
        populate: {
          path: "user_id",
          select: "email",
        },
      },
      {
        path: "course_offering_id",
        populate: [
          {
            path: "course_id",
            select: "code name credits",
          },
          {
            path: "teacher_id",
            select: "specialization",
            populate: {
              path: "faculty_member_id",
              select: "name position",
            },
          },
        ],
      },
    ])

    if (!enrollment) {
      return res.status(404).json(apiResponse.error(`Enrollment not found with id of ${req.params.id}`, 404))
    }

    // Check if user is authorized to view this enrollment
    if (req.user.role === "student") {
      const student = await Student.findOne({ user_id: req.user.id })

      if (!student || enrollment.student_id._id.toString() !== student._id.toString()) {
        return res.status(403).json(apiResponse.error("Not authorized to access this enrollment", 403))
      }
    }

    res.status(200).json(apiResponse.success("Enrollment retrieved successfully", { enrollment }))
  } catch (err) {
    logger.error(`Error in getEnrollment: ${err.message}`)
    res.status(500).json(apiResponse.error("Server error", 500))
  }
}

// @desc    Create new enrollment
// @route   POST /api/enrollments
// @access  Private/Student
exports.createEnrollment = async (req, res) => {
  try {
    const { course_offering_id } = req.body

    // Check if course offering exists
    const courseOffering = await CourseOffering.findById(course_offering_id)

    if (!courseOffering) {
      return res.status(404).json(apiResponse.error("Course offering not found", 404))
    }

    // Get student id from user
    const student = await Student.findOne({ user_id: req.user.id })

    if (!student) {
      return res.status(404).json(apiResponse.error("Student profile not found", 404))
    }

    // Check if already enrolled
    const existingEnrollment = await Enrollment.findOne({
      student_id: student._id,
      course_offering_id,
    })

    if (existingEnrollment) {
      return res.status(400).json(apiResponse.error("Already enrolled in this course", 400))
    }

    // Create enrollment
    const enrollment = await Enrollment.create({
      student_id: student._id,
      course_offering_id,
      grade: null,
    })

    res.status(201).json(apiResponse.success("Enrolled successfully", { enrollment }, 201))
  } catch (err) {
    logger.error(`Error in createEnrollment: ${err.message}`)
    res.status(500).json(apiResponse.error("Server error", 500))
  }
}

// @desc    Update enrollment (mainly for grades)
// @route   PUT /api/enrollments/:id
// @access  Private/Admin/Faculty
exports.updateEnrollment = async (req, res) => {
  try {
    const { grade } = req.body

    // Validate grade
    if (!["A", "B", "C", "D", "F", "I", "W", null].includes(grade)) {
      return res.status(400).json(apiResponse.error("Invalid grade", 400))
    }

    const enrollment = await Enrollment.findByIdAndUpdate(
      req.params.id,
      { grade },
      {
        new: true,
        runValidators: true,
      },
    )

    if (!enrollment) {
      return res.status(404).json(apiResponse.error(`Enrollment not found with id of ${req.params.id}`, 404))
    }

    res.status(200).json(apiResponse.success("Grade updated successfully", { enrollment }))
  } catch (err) {
    logger.error(`Error in updateEnrollment: ${err.message}`)
    res.status(500).json(apiResponse.error("Server error", 500))
  }
}

// @desc    Delete enrollment
// @route   DELETE /api/enrollments/:id
// @access  Private/Admin
exports.deleteEnrollment = async (req, res) => {
  try {
    const enrollment = await Enrollment.findById(req.params.id)

    if (!enrollment) {
      return res.status(404).json(apiResponse.error(`Enrollment not found with id of ${req.params.id}`, 404))
    }

    await enrollment.remove()

    res.status(200).json(apiResponse.success("Enrollment deleted successfully", {}))
  } catch (err) {
    logger.error(`Error in deleteEnrollment: ${err.message}`)
    res.status(500).json(apiResponse.error("Server error", 500))
  }
}

