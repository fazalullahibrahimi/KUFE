const Student = require("../models/Student")
const User = require("../models/User")
const Department = require("../models/Department")
const apiResponse = require("../utils/apiResponse")
const asyncHandler = require("../middleware/asyncHandler")

// @desc    Get all students
// @route   GET /api/students
// @access  Private/Admin/Faculty
const getStudents = asyncHandler(async (req, res) => {
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
  query = Student.find(JSON.parse(queryStr))

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
  const total = await Student.countDocuments()

  query = query.skip(startIndex).limit(limit)

  // Populate
  query = query.populate([
    {
      path: "user_id",
      select: "username email",
    },
    {
      path: "department_id",
      select: "name",
    },
  ])

  // Executing query
  const students = await query

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
    apiResponse.success("Students retrieved successfully", {
      count: students.length,
      pagination,
      students,
    }),
  )
})

// @desc    Get single student
// @route   GET /api/students/:id
// @access  Private/Admin/Faculty
const getStudent = asyncHandler(async (req, res) => {
  const student = await Student.findById(req.params.id)
    .populate("user_id", "username email")
    .populate("department_id", "name")

  if (!student) {
    return res.status(404).json(apiResponse.error(`Student not found with id of ${req.params.id}`, 404))
  }

  res.status(200).json(apiResponse.success("Student retrieved successfully", { student }))
})

// @desc    Create new student
// @route   POST /api/students
// @access  Private/Admin
const createStudent = asyncHandler(async (req, res) => {
  const { user_id, name, department_id, enrollment_year, student_id_number } = req.body

  // Check if user exists
  const user = await User.findById(user_id)
  if (!user) {
    return res.status(404).json(apiResponse.error("User not found", 404))
  }

  // Check if department exists
  const department = await Department.findById(department_id)
  if (!department) {
    return res.status(404).json(apiResponse.error("Department not found", 404))
  }

  // Check if student already exists for this user
  const existingStudent = await Student.findOne({ user_id })
  if (existingStudent) {
    return res.status(400).json(apiResponse.error("Student already exists for this user", 400))
  }

  // Check if student ID number is already in use
  const studentWithSameId = await Student.findOne({ student_id_number })
  if (studentWithSameId) {
    return res.status(400).json(apiResponse.error("Student ID number is already in use", 400))
  }

  // Create student
  const student = await Student.create({
    user_id,
    name,
    department_id,
    enrollment_year,
    student_id_number,
  })

  // Update user role if not already student
  if (user.role !== "student") {
    await User.findByIdAndUpdate(user_id, { role: "student" })
  }

  res.status(201).json(apiResponse.success("Student created successfully", { student }, 201))
})

// @desc    Update student
// @route   PUT /api/students/:id
// @access  Private/Admin
const updateStudent = asyncHandler(async (req, res) => {
  const { name, department_id, enrollment_year } = req.body

  // Check if department exists if provided
  if (department_id) {
    const department = await Department.findById(department_id)
    if (!department) {
      return res.status(404).json(apiResponse.error("Department not found", 404))
    }
  }

  // Find student to update
  let student = await Student.findById(req.params.id)

  if (!student) {
    return res.status(404).json(apiResponse.error(`Student not found with id of ${req.params.id}`, 404))
  }

  // Build update object
  const updateData = {}
  if (name) updateData.name = name
  if (department_id) updateData.department_id = department_id
  if (enrollment_year) updateData.enrollment_year = enrollment_year

  // Update student
  student = await Student.findByIdAndUpdate(req.params.id, updateData, {
    new: true,
    runValidators: true,
  })
    .populate("user_id", "username email")
    .populate("department_id", "name")

  res.status(200).json(apiResponse.success("Student updated successfully", { student }))
})

// @desc    Delete student
// @route   DELETE /api/students/:id
// @access  Private/Admin
const deleteStudent = asyncHandler(async (req, res) => {
  const student = await Student.findById(req.params.id)

  if (!student) {
    return res.status(404).json(apiResponse.error(`Student not found with id of ${req.params.id}`, 404))
  }

  await student.remove()

  res.status(200).json(apiResponse.success("Student deleted successfully", {}))
})

module.exports = {
  getStudents,
  getStudent,
  createStudent,
  updateStudent,
  deleteStudent,
}

