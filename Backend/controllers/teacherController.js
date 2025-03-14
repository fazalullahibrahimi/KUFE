const Teacher = require("../models/Teacher")
const FacultyMember = require("../models/FacultyMember")
const apiResponse = require("../utils/apiResponse")
const asyncHandler = require("../middleware/asyncHandler.js")
const validateMongodbId = require("../utils/validateMongoDBId.js")

// @desc    Get all teachers
// @route   GET /api/teachers
// @access  Public
const getTeachers = asyncHandler(async (req, res) => {
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
  query = Teacher.find(JSON.parse(queryStr))

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
  const total = await Teacher.countDocuments()

  query = query.skip(startIndex).limit(limit)

  // Populate
  query = query.populate({
    path: "faculty_member_id",
    select: "name position",
    populate: [
      {
        path: "user_id",
        select: "username email",
      },
      {
        path: "department_id",
        select: "name",
      },
    ],
  })

  // Executing query
  const teachers = await query

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
    apiResponse.success("Teachers retrieved successfully", {
      count: teachers.length,
      pagination,
      teachers,
    })
  )
})

// @desc    Get single teacher
// @route   GET /api/teachers/:id
// @access  Public
const getTeacher = asyncHandler(async (req, res) => {
  // Validate MongoDB ID
  if (!validateMongodbId(req.params.id)) {
    return res.status(400).json(apiResponse.error("Invalid teacher ID", 400))
  }

  const teacher = await Teacher.findById(req.params.id).populate({
    path: "faculty_member_id",
    select: "name position",
    populate: [
      {
        path: "user_id",
        select: "username email",
      },
      {
        path: "department_id",
        select: "name",
      },
    ],
  })

  if (!teacher) {
    return res.status(404).json(apiResponse.error(`Teacher not found with id of ${req.params.id}`, 404))
  }

  res.status(200).json(apiResponse.success("Teacher retrieved successfully", { teacher }))
})

// @desc    Create new teacher
// @route   POST /api/teachers
// @access  Private/Admin
const createTeacher = asyncHandler(async (req, res) => {
  const { faculty_member_id, specialization, office_hours } = req.body

  // Validate MongoDB ID
  if (!validateMongodbId(faculty_member_id)) {
    return res.status(400).json(apiResponse.error("Invalid faculty member ID", 400))
  }

  // Check if faculty member exists
  const facultyMember = await FacultyMember.findById(faculty_member_id)
  if (!facultyMember) {
    return res.status(404).json(apiResponse.error("Faculty member not found", 404))
  }

  // Check if teacher already exists for this faculty member
  const existingTeacher = await Teacher.findOne({ faculty_member_id })
  if (existingTeacher) {
    return res.status(400).json(apiResponse.error("Teacher already exists for this faculty member", 400))
  }

  // Create teacher
  const teacher = await Teacher.create({
    faculty_member_id,
    specialization,
    office_hours,
  })

  res.status(201).json(apiResponse.success("Teacher created successfully", { teacher }, 201))
})

// @desc    Update teacher
// @route   PUT /api/teachers/:id
// @access  Private/Admin
const updateTeacher = asyncHandler(async (req, res) => {
  const { specialization, office_hours } = req.body

  // Validate MongoDB ID
  if (!validateMongodbId(req.params.id)) {
    return res.status(400).json(apiResponse.error("Invalid teacher ID", 400))
  }

  // Find teacher to update
  let teacher = await Teacher.findById(req.params.id)

  if (!teacher) {
    return res.status(404).json(apiResponse.error(`Teacher not found with id of ${req.params.id}`, 404))
  }

  // Build update object
  const updateData = {}
  if (specialization) updateData.specialization = specialization
  if (office_hours) updateData.office_hours = office_hours

  // Update teacher
  teacher = await Teacher.findByIdAndUpdate(req.params.id, updateData, {
    new: true,
    runValidators: true,
  }).populate({
    path: "faculty_member_id",
    select: "name position",
    populate: [
      {
        path: "user_id",
        select: "username email",
      },
      {
        path: "department_id",
        select: "name",
      },
    ],
  })

  res.status(200).json(apiResponse.success("Teacher updated successfully", { teacher }))
})

// @desc    Delete teacher
// @route   DELETE /api/teachers/:id
// @access  Private/Admin
const deleteTeacher = asyncHandler(async (req, res) => {
  // Validate MongoDB ID
  if (!validateMongodbId(req.params.id)) {
    return res.status(400).json(apiResponse.error("Invalid teacher ID", 400))
  }

  const teacher = await Teacher.findById(req.params.id)

  if (!teacher) {
    return res.status(404).json(apiResponse.error(`Teacher not found with id of ${req.params.id}`, 404))
  }

  await teacher.remove()

  res.status(200).json(apiResponse.success("Teacher deleted successfully", {}))
})

module.exports = {
  getTeachers,
  getTeacher,
  createTeacher,
  updateTeacher,
  deleteTeacher,
}
