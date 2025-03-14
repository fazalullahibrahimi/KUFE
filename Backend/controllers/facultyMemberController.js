const FacultyMember = require("../models/FacultyMember")
const User = require("../models/User")
const Department = require("../models/Department")
const apiResponse = require("../utils/apiResponse")
const  asyncHandler = require("../middleware/asyncHandler.js")
const validateMongodbId = require("../utils/validateMongoDBId")
const sendEmail = require("../utils/email")

// @desc    Get all faculty members
// @route   GET /api/faculty-members
// @access  Public
exports.getFacultyMembers = asyncHandler(async (req, res) => {
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
  query = FacultyMember.find(JSON.parse(queryStr))

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
  const total = await FacultyMember.countDocuments()

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
  const facultyMembers = await query

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
    apiResponse.success("Faculty members retrieved successfully", {
      count: facultyMembers.length,
      pagination,
      facultyMembers,
    }),
  )
})

// @desc    Get single faculty member
// @route   GET /api/faculty-members/:id
// @access  Public
exports.getFacultyMember = asyncHandler(async (req, res) => {
  // Validate MongoDB ID
  if (!validateMongodbId(req.params.id)) {
    return res.status(400).json(apiResponse.error("Invalid faculty member ID", 400))
  }

  const facultyMember = await FacultyMember.findById(req.params.id)
    .populate("user_id", "username email")
    .populate("department_id", "name")

  if (!facultyMember) {
    return res.status(404).json(apiResponse.error(`Faculty member not found with id of ${req.params.id}`, 404))
  }

  res.status(200).json(apiResponse.success("Faculty member retrieved successfully", { facultyMember }))
})

// @desc    Create new faculty member
// @route   POST /api/faculty-members
// @access  Private/Admin
exports.createFacultyMember = asyncHandler(async (req, res) => {
  const { user_id, name, position, department_id, contact_info, profile } = req.body

  // Validate MongoDB IDs
  if (!validateMongodbId(user_id)) {
    return res.status(400).json(apiResponse.error("Invalid user ID", 400))
  }

  if (!validateMongodbId(department_id)) {
    return res.status(400).json(apiResponse.error("Invalid department ID", 400))
  }

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

  // Check if faculty member already exists for this user
  const existingFacultyMember = await FacultyMember.findOne({ user_id })
  if (existingFacultyMember) {
    return res.status(400).json(apiResponse.error("Faculty member already exists for this user", 400))
  }

  // Create faculty member
  const facultyMember = await FacultyMember.create({
    user_id,
    name,
    position,
    department_id,
    contact_info,
    profile,
  })

  // Update user role if not already faculty
  if (user.role !== "faculty") {
    await User.findByIdAndUpdate(user_id, { role: "faculty" })

    // Send role update notification email
    try {
      await sendEmail({
        email: user.email,
        subject: "Role Update",
        message: `Hello ${user.username}, your account has been updated to faculty role.`,
      })
    } catch (error) {
      console.error(`Failed to send role update email: ${error.message}`)
      // Continue with faculty member creation even if email fails
    }
  }

  res.status(201).json(apiResponse.success("Faculty member created successfully", { facultyMember }, 201))
})

// @desc    Update faculty member
// @route   PUT /api/faculty-members/:id
// @access  Private/Admin
exports.updateFacultyMember = asyncHandler(async (req, res) => {
  const { name, position, department_id, contact_info, profile } = req.body

  // Validate MongoDB IDs
  if (!validateMongodbId(req.params.id)) {
    return res.status(400).json(apiResponse.error("Invalid faculty member ID", 400))
  }

  if (department_id && !validateMongodbId(department_id)) {
    return res.status(400).json(apiResponse.error("Invalid department ID", 400))
  }

  // Check if department exists if provided
  if (department_id) {
    const department = await Department.findById(department_id)
    if (!department) {
      return res.status(404).json(apiResponse.error("Department not found", 404))
    }
  }

  // Find faculty member to update
  let facultyMember = await FacultyMember.findById(req.params.id)

  if (!facultyMember) {
    return res.status(404).json(apiResponse.error(`Faculty member not found with id of ${req.params.id}`, 404))
  }

  // Build update object
  const updateData = {}
  if (name) updateData.name = name
  if (position) updateData.position = position
  if (department_id) updateData.department_id = department_id
  if (contact_info) updateData.contact_info = contact_info
  if (profile) updateData.profile = profile

  // Update faculty member
  facultyMember = await FacultyMember.findByIdAndUpdate(req.params.id, updateData, {
    new: true,
    runValidators: true,
  })
    .populate("user_id", "username email")
    .populate("department_id", "name")

  res.status(200).json(apiResponse.success("Faculty member updated successfully", { facultyMember }))
})

// @desc    Delete faculty member
// @route   DELETE /api/faculty-members/:id
// @access  Private/Admin
exports.deleteFacultyMember = asyncHandler(async (req, res) => {
  // Validate MongoDB ID
  if (!validateMongodbId(req.params.id)) {
    return res.status(400).json(apiResponse.error("Invalid faculty member ID", 400))
  }

  const facultyMember = await FacultyMember.findById(req.params.id)

  if (!facultyMember) {
    return res.status(404).json(apiResponse.error(`Faculty member not found with id of ${req.params.id}`, 404))
  }

  await facultyMember.remove()

  res.status(200).json(apiResponse.success("Faculty member deleted successfully", {}))
})

