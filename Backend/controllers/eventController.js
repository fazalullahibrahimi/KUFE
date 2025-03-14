const Event = require("../models/Event")
const Faculty = require("../models/Faculty")
const apiResponse = require("../utils/apiResponse")
const asyncHandler = require("../middleware/asyncHandler")

// @desc    Get all events
// @route   GET /api/events
// @access  Public
const getEvents = asyncHandler(async (req, res) => {
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
  query = Event.find(JSON.parse(queryStr))

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
    query = query.sort("-date")
  }

  // Pagination
  const page = Number.parseInt(req.query.page, 10) || 1
  const limit = Number.parseInt(req.query.limit, 10) || 25
  const startIndex = (page - 1) * limit
  const endIndex = page * limit
  const total = await Event.countDocuments()

  query = query.skip(startIndex).limit(limit)

  // Populate
  if (req.query.populate) {
    query = query.populate("faculty_id", "name")
  }

  // Executing query
  const events = await query

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
    apiResponse.success("Events retrieved successfully", {
      count: events.length,
      pagination,
      events,
    }),
  )
})

// @desc    Get single event
// @route   GET /api/events/:id
// @access  Public
const getEvent = asyncHandler(async (req, res) => {
  const event = await Event.findById(req.params.id).populate("faculty_id", "name")

  if (!event) {
    return res.status(404).json(apiResponse.error(`Event not found with id of ${req.params.id}`, 404))
  }

  res.status(200).json(apiResponse.success("Event retrieved successfully", { event }))
})

// @desc    Create new event
// @route   POST /api/events
// @access  Private/Admin/Faculty
const createEvent = asyncHandler(async (req, res) => {
  const { title, description, date, location, type, faculty_id } = req.body

  // Check if faculty exists if provided
  if (faculty_id) {
    const faculty = await Faculty.findById(faculty_id)
    if (!faculty) {
      return res.status(404).json(apiResponse.error("Faculty not found", 404))
    }
  }

  // Create event
  const event = await Event.create({
    title,
    description,
    date,
    location,
    type,
    faculty_id,
  })

  res.status(201).json(apiResponse.success("Event created successfully", { event }, 201))
})

// @desc    Update event
// @route   PUT /api/events/:id
// @access  Private/Admin/Faculty
const updateEvent = asyncHandler(async (req, res) => {
  const { title, description, date, location, type, faculty_id } = req.body

  // Check if faculty exists if provided
  if (faculty_id) {
    const faculty = await Faculty.findById(faculty_id)
    if (!faculty) {
      return res.status(404).json(apiResponse.error("Faculty not found", 404))
    }
  }

  // Find event to update
  let event = await Event.findById(req.params.id)

  if (!event) {
    return res.status(404).json(apiResponse.error(`Event not found with id of ${req.params.id}`, 404))
  }

  // Build update object
  const updateData = {}
  if (title) updateData.title = title
  if (description) updateData.description = description
  if (date) updateData.date = date
  if (location) updateData.location = location
  if (type) updateData.type = type
  if (faculty_id) updateData.faculty_id = faculty_id

  // Update event
  event = await Event.findByIdAndUpdate(req.params.id, updateData, {
    new: true,
    runValidators: true,
  }).populate("faculty_id", "name")

  res.status(200).json(apiResponse.success("Event updated successfully", { event }))
})

// @desc    Delete event
// @route   DELETE /api/events/:id
// @access  Private/Admin
const deleteEvent = asyncHandler(async (req, res) => {
  const event = await Event.findById(req.params.id)

  if (!event) {
    return res.status(404).json(apiResponse.error(`Event not found with id of ${req.params.id}`, 404))
  }

  await event.remove()

  res.status(200).json(apiResponse.success("Event deleted successfully", {}))
})

module.exports = {
  getEvents,
  getEvent,
  createEvent,
  updateEvent,
  deleteEvent,
}

