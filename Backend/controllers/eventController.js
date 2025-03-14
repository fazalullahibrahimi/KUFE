const Event = require("../models/Event")
const Faculty = require("../models/Faculty")
const apiResponse = require("../utils/apiResponse")
const logger = require("../utils/logger")

// @desc    Get all events
// @route   GET /api/events
// @access  Public
exports.getEvents = async (req, res) => {
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
  } catch (err) {
    logger.error(`Error in getEvents: ${err.message}`)
    res.status(500).json(apiResponse.error("Server error", 500))
  }
}

// @desc    Get single event
// @route   GET /api/events/:id
// @access  Public
exports.getEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).populate("faculty_id", "name")

    if (!event) {
      return res.status(404).json(apiResponse.error(`Event not found with id of ${req.params.id}`, 404))
    }

    res.status(200).json(apiResponse.success("Event retrieved successfully", { event }))
  } catch (err) {
    logger.error(`Error in getEvent: ${err.message}`)
    res.status(500).json(apiResponse.error("Server error", 500))
  }
}

// @desc    Create new event
// @route   POST /api/events
// @access  Private/Admin/Faculty
exports.createEvent = async (req, res) => {
  try {
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
  } catch (err) {
    logger.error(`Error in createEvent: ${err.message}`)
    res.status(500).json(apiResponse.error("Server error", 500))
  }
}

// @desc    Update event
// @route   PUT /api/events/:id
// @access  Private/Admin/Faculty
exports.updateEvent = async (req, res) => {
  try {
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
  } catch (err) {
    logger.error(`Error in updateEvent: ${err.message}`)
    res.status(500).json(apiResponse.error("Server error", 500))
  }
}

// @desc    Delete event
// @route   DELETE /api/events/:id
// @access  Private/Admin
exports.deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)

    if (!event) {
      return res.status(404).json(apiResponse.error(`Event not found with id of ${req.params.id}`, 404))
    }

    await event.remove()

    res.status(200).json(apiResponse.success("Event deleted successfully", {}))
  } catch (err) {
    logger.error(`Error in deleteEvent: ${err.message}`)
    res.status(500).json(apiResponse.error("Server error", 500))
  }
}

