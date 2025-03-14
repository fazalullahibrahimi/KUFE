const Department = require("../models/Department")
const apiResponse = require("../utils/apiResponse")
const asyncHandler = require("../middleware/asyncHandler");
const validateMongodbId = require("../utils/validateMongoDBId")

// @desc    Get all departments
// @route   GET /api/departments
// @access  Public
const getDepartments = asyncHandler(async (req, res) => {
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
  query = Department.find(JSON.parse(queryStr))

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
  const total = await Department.countDocuments()

  query = query.skip(startIndex).limit(limit)

  // Populate
  if (req.query.populate) {
    query = query.populate("head_of_department faculty")
  }

  // Executing query
  const departments = await query

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
    apiResponse.success("Departments retrieved successfully", {
      count: departments.length,
      pagination,
      departments,
    }),
  )
})

// @desc    Get single department
// @route   GET /api/departments/:id
// @access  Public
const getDepartment = asyncHandler(async (req, res) => {
  // Validate MongoDB ID
  if (!validateMongodbId(req.params.id)) {
    return res.status(400).json(apiResponse.error("Invalid department ID", 400))
  }

  const department = await Department.findById(req.params.id).populate("head_of_department faculty")

  if (!department) {
    return res.status(404).json(apiResponse.error(`Department not found with id of ${req.params.id}`, 404))
  }

  res.status(200).json(apiResponse.success("Department retrieved successfully", { department }))
})

// @desc    Create new department
// @route   POST /api/departments
// @access  Private/Admin
const createDepartment = asyncHandler(async (req, res) => {
  // Validate MongoDB IDs if provided
  if (req.body.head_of_department && !validateMongodbId(req.body.head_of_department)) {
    return res.status(400).json(apiResponse.error("Invalid head of department ID", 400))
  }

  if (req.body.faculty && !validateMongodbId(req.body.faculty)) {
    return res.status(400).json(apiResponse.error("Invalid faculty ID", 400))
  }

  const department = await Department.create(req.body)

  res.status(201).json(apiResponse.success("Department created successfully", { department }, 201))
})

// @desc    Update department
// @route   PUT /api/departments/:id
// @access  Private/Admin
const updateDepartment = asyncHandler(async (req, res) => {
  // Validate MongoDB ID
  if (!validateMongodbId(req.params.id)) {
    return res.status(400).json(apiResponse.error("Invalid department ID", 400))
  }

  // Validate MongoDB IDs in request body if provided
  if (req.body.head_of_department && !validateMongodbId(req.body.head_of_department)) {
    return res.status(400).json(apiResponse.error("Invalid head of department ID", 400))
  }

  if (req.body.faculty && !validateMongodbId(req.body.faculty)) {
    return res.status(400).json(apiResponse.error("Invalid faculty ID", 400))
  }

  const department = await Department.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  })

  if (!department) {
    return res.status(404).json(apiResponse.error(`Department not found with id of ${req.params.id}`, 404))
  }

  res.status(200).json(apiResponse.success("Department updated successfully", { department }))
})

// @desc    Delete department
// @route   DELETE /api/departments/:id
// @access  Private/Admin
const deleteDepartment = asyncHandler(async (req, res) => {
  // Validate MongoDB ID
  if (!validateMongodbId(req.params.id)) {
    return res.status(400).json(apiResponse.error("Invalid department ID", 400))
  }

  const department = await Department.findById(req.params.id)

  if (!department) {
    return res.status(404).json(apiResponse.error(`Department not found with id of ${req.params.id}`, 404))
  }

  await department.remove()

  res.status(200).json(apiResponse.success("Department deleted successfully", {}))
})

module.exports = {
  getDepartments,
  getDepartment,
  createDepartment,
  updateDepartment,
  deleteDepartment,
}
