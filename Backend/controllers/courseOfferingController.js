const CourseOffering = require("../models/CourseOffering")
const Course = require("../models/Course")
const Teacher = require("../models/Teacher")
const apiResponse = require("../utils/apiResponse")
const logger = require("../utils/logger")

// @desc    Get all course offerings
// @route   GET /api/course-offerings
// @access  Public
exports.getCourseOfferings = async (req, res) => {
  try {
    let query

    // Copy req.query
    const reqQuery = { ...req.query }

    // Fields to exclude
    const removeFields = ["select", "sort", "page", "limit"]

    // Loop over removeFields and delete them from reqQuery
    removeFields.forEach((param) => delete reqQuery[param])

    // Create query string
    let queryStr = JSON.stringify(reqQuery)

    // Create operators ($gt, $gte, etc)
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, (match) => `$${match}`)

    // Finding resource
    query = CourseOffering.find(JSON.parse(queryStr))

    // Select Fields
    if (req.query.select) {
      const fields = req.query.select.split(",").join(" ")
      query = query.select(fields)
    }

    // Sort
    if (req.query.sort) {
      const sortBy = req.query.sort.split(",").join(" ")
      query = query.sort(sortBy)
    } else {
      query = query.sort("-year -semester")
    }

    // Pagination
    const page = Number.parseInt(req.query.page, 10) || 1
    const limit = Number.parseInt(req.query.limit, 10) || 25
    const startIndex = (page - 1) * limit
    const endIndex = page * limit
    const total = await CourseOffering.countDocuments()

    query = query.skip(startIndex).limit(limit)

    // Populate
    query = query.populate([
      {
        path: "course_id",
        select: "code name credits",
        populate: {
          path: "department_id",
          select: "name",
        },
      },
      {
        path: "teacher_id",
        select: "specialization",
        populate: {
          path: "faculty_member_id",
          select: "name",
        },
      },
    ])

    // Executing query
    const courseOfferings = await query

    // Pagination result
    const pagination = {}

    if (endIndex < total) {
      pagination.next = {
        page: page + 1,
        limit,
      }
    }

    if (startIndex > 0) {
      pagination.prev = {
        page: page - 1,
        limit,
      }
    }

    res.status(200).json(
      apiResponse.success("Course offerings retrieved successfully", {
        count: courseOfferings.length,
        pagination,
        courseOfferings,
      }),
    )
  } catch (err) {
    logger.error(`Error in getCourseOfferings: ${err.message}`)
    res.status(500).json(apiResponse.error("Server error", 500))
  }
}

// @desc    Get single course offering
// @route   GET /api/course-offerings/:id
// @access  Public
exports.getCourseOffering = async (req, res) => {
  try {
    const courseOffering = await CourseOffering.findById(req.params.id).populate([
      {
        path: "course_id",
        select: "code name credits description",
        populate: {
          path: "department_id",
          select: "name",
        },
      },
      {
        path: "teacher_id",
        select: "specialization office_hours",
        populate: {
          path: "faculty_member_id",
          select: "name position contact_info",
        },
      },
    ])

    if (!courseOffering) {
      return res.status(404).json(apiResponse.error(`Course offering not found with id of ${req.params.id}`, 404))
    }

    res.status(200).json(apiResponse.success("Course offering retrieved successfully", { courseOffering }))
  } catch (err) {
    logger.error(`Error in getCourseOffering: ${err.message}`)
    res.status(500).json(apiResponse.error("Server error", 500))
  }
}

// @desc    Create new course offering
// @route   POST /api/course-offerings
// @access  Private/Admin/Faculty
exports.createCourseOffering = async (req, res) => {
  try {
    const { course_id, teacher_id, semester, year, schedule } = req.body

    // Check if course exists
    const course = await Course.findById(course_id)
    if (!course) {
      return res.status(404).json(apiResponse.error("Course not found", 404))
    }

    // Check if teacher exists
    const teacher = await Teacher.findById(teacher_id)
    if (!teacher) {
      return res.status(404).json(apiResponse.error("Teacher not found", 404))
    }

    // Check if course offering already exists for this course, teacher, semester, and year
    const existingOffering = await CourseOffering.findOne({
      course_id,
      teacher_id,
      semester,
      year,
    })

    if (existingOffering) {
      return res
        .status(400)
        .json(apiResponse.error("Course offering already exists for this course, teacher, semester, and year", 400))
    }

    // Create course offering
    const courseOffering = await CourseOffering.create({
      course_id,
      teacher_id,
      semester,
      year,
      schedule,
    })

    res.status(201).json(apiResponse.success("Course offering created successfully", { courseOffering }, 201))
  } catch (err) {
    logger.error(`Error in createCourseOffering: ${err.message}`)
    res.status(500).json(apiResponse.error("Server error", 500))
  }
}

// @desc    Update course offering
// @route   PUT /api/course-offerings/:id
// @access  Private/Admin/Faculty
exports.updateCourseOffering = async (req, res) => {
  try {
    const { teacher_id, semester, year, schedule } = req.body

    // Check if teacher exists if provided
    if (teacher_id) {
      const teacher = await Teacher.findById(teacher_id)
      if (!teacher) {
        return res.status(404).json(apiResponse.error("Teacher not found", 404))
      }
    }

    // Find course offering to update
    let courseOffering = await CourseOffering.findById(req.params.id)

    if (!courseOffering) {
      return res.status(404).json(apiResponse.error(`Course offering not found with id of ${req.params.id}`, 404))
    }

    // Build update object
    const updateData = {}
    if (teacher_id) updateData.teacher_id = teacher_id
    if (semester) updateData.semester = semester
    if (year) updateData.year = year
    if (schedule) updateData.schedule = schedule

    // Update course offering
    courseOffering = await CourseOffering.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    }).populate([
      {
        path: "course_id",
        select: "code name credits",
        populate: {
          path: "department_id",
          select: "name",
        },
      },
      {
        path: "teacher_id",
        select: "specialization",
        populate: {
          path: "faculty_member_id",
          select: "name",
        },
      },
    ])

    res.status(200).json(apiResponse.success("Course offering updated successfully", { courseOffering }))
  } catch (err) {
    logger.error(`Error in updateCourseOffering: ${err.message}`)
    res.status(500).json(apiResponse.error("Server error", 500))
  }
}

// @desc    Delete course offering
// @route   DELETE /api/course-offerings/:id
// @access  Private/Admin
exports.deleteCourseOffering = async (req, res) => {
  try {
    const courseOffering = await CourseOffering.findById(req.params.id)

    if (!courseOffering) {
      return res.status(404).json(apiResponse.error(`Course offering not found with id of ${req.params.id}`, 404))
    }

    await courseOffering.remove()

    res.status(200).json(apiResponse.success("Course offering deleted successfully", {}))
  } catch (err) {
    logger.error(`Error in deleteCourseOffering: ${err.message}`)
    res.status(500).json(apiResponse.error("Server error", 500))
  }
}

