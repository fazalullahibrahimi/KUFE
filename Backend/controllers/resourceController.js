const Resource = require("../models/Resource")
const Course = require("../models/Course")
const apiResponse = require("../utils/apiResponse")
const logger = require("../utils/logger")

// @desc    Get all resources
// @route   GET /api/resources
// @access  Private
exports.getResources = async (req, res) => {
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
    query = Resource.find(JSON.parse(queryStr))

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
    const total = await Resource.countDocuments()

    query = query.skip(startIndex).limit(limit)

    // Populate
    query = query.populate([
      {
        path: "uploader_id",
        select: "username email",
      },
      {
        path: "course_id",
        select: "code name",
      },
    ])

    // Executing query
    const resources = await query

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
      apiResponse.success("Resources retrieved successfully", {
        count: resources.length,
        pagination,
        resources,
      }),
    )
  } catch (err) {
    logger.error(`Error in getResources: ${err.message}`)
    res.status(500).json(apiResponse.error("Server error", 500))
  }
}

// @desc    Get single resource
// @route   GET /api/resources/:id
// @access  Private
exports.getResource = async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id)
      .populate("uploader_id", "username email")
      .populate("course_id", "code name")

    if (!resource) {
      return res.status(404).json(apiResponse.error(`Resource not found with id of ${req.params.id}`, 404))
    }

    res.status(200).json(apiResponse.success("Resource retrieved successfully", { resource }))
  } catch (err) {
    logger.error(`Error in getResource: ${err.message}`)
    res.status(500).json(apiResponse.error("Server error", 500))
  }
}

// @desc    Create new resource
// @route   POST /api/resources
// @access  Private/Admin/Faculty
exports.createResource = async (req, res) => {
  try {
    const { title, description, type, course_id } = req.body

    // Check if file was uploaded
    if (!req.file) {
      return res.status(400).json(apiResponse.error("Please upload a file", 400))
    }

    // Check if course exists if provided
    if (course_id) {
      const course = await Course.findById(course_id)
      if (!course) {
        return res.status(404).json(apiResponse.error("Course not found", 404))
      }
    }

    // Create resource
    const resource = await Resource.create({
      title,
      description,
      file_path: req.file.path,
      type,
      uploader_id: req.user.id,
      course_id,
    })

    res.status(201).json(apiResponse.success("Resource created successfully", { resource }, 201))
  } catch (err) {
    logger.error(`Error in createResource: ${err.message}`)
    res.status(500).json(apiResponse.error("Server error", 500))
  }
}

// @desc    Update resource
// @route   PUT /api/resources/:id
// @access  Private
exports.updateResource = async (req, res) => {
  try {
    const { title, description, type, course_id } = req.body

    // Find resource to update
    let resource = await Resource.findById(req.params.id)

    if (!resource) {
      return res.status(404).json(apiResponse.error(`Resource not found with id of ${req.params.id}`, 404))
    }

    // Make sure user is resource owner or admin
    if (resource.uploader_id.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json(apiResponse.error("Not authorized to update this resource", 403))
    }

    // Check if course exists if provided
    if (course_id) {
      const course = await Course.findById(course_id)
      if (!course) {
        return res.status(404).json(apiResponse.error("Course not found", 404))
      }
    }

    // Build update object
    const updateData = {}
    if (title) updateData.title = title
    if (description) updateData.description = description
    if (type) updateData.type = type
    if (course_id) updateData.course_id = course_id
    if (req.file) updateData.file_path = req.file.path

    // Update resource
    resource = await Resource.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    })
      .populate("uploader_id", "username email")
      .populate("course_id", "code name")

    res.status(200).json(apiResponse.success("Resource updated successfully", { resource }))
  } catch (err) {
    logger.error(`Error in updateResource: ${err.message}`)
    res.status(500).json(apiResponse.error("Server error", 500))
  }
}

// @desc    Delete resource
// @route   DELETE /api/resources/:id
// @access  Private/Admin
exports.deleteResource = async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id)

    if (!resource) {
      return res.status(404).json(apiResponse.error(`Resource not found with id of ${req.params.id}`, 404))
    }

    await resource.remove()

    res.status(200).json(apiResponse.success("Resource deleted successfully", {}))
  } catch (err) {
    logger.error(`Error in deleteResource: ${err.message}`)
    res.status(500).json(apiResponse.error("Server error", 500))
  }
}

