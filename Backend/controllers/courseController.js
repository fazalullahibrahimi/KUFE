const Course = require("../models/Course")
const apiResponse = require("../utils/apiResponse")
const asyncHandler = require("../middleware/asyncHandler")

// @desc    Get all courses
// @route   GET /api/courses
// @access  Public
const getCourses = asyncHandler(async (req, res) => {
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
  query = Course.find(JSON.parse(queryStr))

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
    query = query.sort("-created_at")
  }

  // Pagination
  const page = Number.parseInt(req.query.page, 10) || 1
  const limit = Number.parseInt(req.query.limit, 10) || 25
  const startIndex = (page - 1) * limit
  const endIndex = page * limit
  const total = await Course.countDocuments()

  query = query.skip(startIndex).limit(limit)

  // Populate
  if (req.query.populate) {
    query = query.populate("department_id")
  }

  // Executing query
  const courses = await query

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
    apiResponse.success("Courses retrieved successfully", {
      count: courses.length,
      pagination,
      courses,
    }),
  )
})

// @desc    Get single course
// @route   GET /api/courses/:id
// @access  Public
const getCourse = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.id).populate("department_id")

  if (!course) {
    return res.status(404).json(apiResponse.error(`Course not found with id of ${req.params.id}`, 404))
  }

  res.status(200).json(apiResponse.success("Course retrieved successfully", { course }))
})

// @desc    Create new course
// @route   POST /api/courses
// @access  Private/Admin/Faculty
const createCourse = asyncHandler(async (req, res) => {
  const course = await Course.create(req.body)

  res.status(201).json(apiResponse.success("Course created successfully", { course }, 201))
})

// @desc    Update course
// @route   PUT /api/courses/:id
// @access  Private/Admin/Faculty
const updateCourse = asyncHandler(async (req, res) => {
  const course = await Course.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  })

  if (!course) {
    return res.status(404).json(apiResponse.error(`Course not found with id of ${req.params.id}`, 404))
  }

  res.status(200).json(apiResponse.success("Course updated successfully", { course }))
})

// @desc    Delete course
// @route   DELETE /api/courses/:id
// @access  Private/Admin
const deleteCourse = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.id)

  if (!course) {
    return res.status(404).json(apiResponse.error(`Course not found with id of ${req.params.id}`, 404))
  }

  await course.remove()

  res.status(200).json(apiResponse.success("Course deleted successfully", {}))
})

module.exports = {
  getCourses,
  getCourse,
  createCourse,
  updateCourse,
  deleteCourse,
}

