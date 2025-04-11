const mongoose = require("mongoose");
const Event = require("../models/Event");
const Faculty = require("../models/Faculty");
const News = require("../models/News");
const apiResponse = require("../utils/apiResponse");
const asyncHandler = require("../middleware/asyncHandler");

// @desc    Get all events
// @route   GET /api/events
// @access  Public
const getEvents = asyncHandler(async (req, res) => {
  let query;

  // Copy req.query
  const reqQuery = { ...req.query };

  // Fields to exclude
  const removeFields = ["select", "sort", "page", "limit"];

  // Remove fields from reqQuery
  removeFields.forEach((param) => delete reqQuery[param]);

  // Create query string
  let queryStr = JSON.stringify(reqQuery);

  // Create operators ($gt, $gte, etc)
  queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, (match) => `$${match}`);

  // Finding resource
  query = Event.find(JSON.parse(queryStr));

  // Select Fields
  if (req.query.select) {
    const fields = req.query.select.split(",").join(" ");
    query = query.select(fields);
  }

  // Sort
  query = req.query.sort ? query.sort(req.query.sort.split(",").join(" ")) : query.sort("-date");

  // Pagination
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 25;
  const startIndex = (page - 1) * limit;
  const total = await Event.countDocuments();

  query = query.skip(startIndex).limit(limit);

  // Populate faculty data
  if (req.query.populate) {
    query = query.populate("faculty_id", "name");
  }

  // Execute query
  const events = await query;

  // Pagination result
  const pagination = {};
  if (startIndex + limit < total) pagination.next = { page: page + 1, limit };
  if (startIndex > 0) pagination.prev = { page: page - 1, limit };

  res.status(200).json(
    apiResponse.success("Events retrieved successfully", {
      count: events.length,
      pagination,
      events,
    })
  );
});

// @desc    Get single event
// @route   GET /api/events/:id
// @access  Public
const getEvent = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Handle special case where "latest" is requested instead of an ObjectId
  if (id === "latest") {
    const latestEvent = await Event.findOne().sort({ date: -1 }).populate("faculty_id", "name");

    if (!latestEvent) {
      return res.status(404).json(apiResponse.error("No events found", 404));
    }

    return res.status(200).json(apiResponse.success("Latest event retrieved successfully", { latestEvent }));
  }

  // Validate ObjectId
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json(apiResponse.error("Invalid event ID format", 400));
  }

  const event = await Event.findById(id).populate("faculty_id", "name");

  if (!event) {
    return res.status(404).json(apiResponse.error(`Event not found with id of ${id}`, 404));
  }

  res.status(200).json(apiResponse.success("Event retrieved successfully", { event }));
});

// @desc    Create new event
// @route   POST /api/events
// @access  Private/Admin/Faculty
const createEvent = asyncHandler(async (req, res) => {
  const { title, description, date, location, type, faculty_id } = req.body;

  // Check if faculty exists if provided
  if (faculty_id && !mongoose.Types.ObjectId.isValid(faculty_id)) {
    return res.status(400).json(apiResponse.error("Invalid faculty ID", 400));
  }

  const event = await Event.create({ title, description, date, location, type, faculty_id });

  res.status(201).json(apiResponse.success("Event created successfully", { event }, 201));
});

// @desc    Update event
// @route   PUT /api/events/:id
// @access  Private/Admin/Faculty
const updateEvent = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { title, description, date, location, type, faculty_id } = req.body;

  // Validate event ID
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json(apiResponse.error("Invalid event ID format", 400));
  }

  let event = await Event.findById(id);

  if (!event) {
    return res.status(404).json(apiResponse.error(`Event not found with id of ${id}`, 404));
  }

  // Update event
  event = await Event.findByIdAndUpdate(id, { title, description, date, location, type, faculty_id }, { new: true, runValidators: true }).populate("faculty_id", "name");

  res.status(200).json(apiResponse.success("Event updated successfully", { event }));
});

// @desc    Delete event
// @route   DELETE /api/events/:id
// @access  Private/Admin
const deleteEvent = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json(apiResponse.error("Invalid event ID format", 400));
  }

  const event = await Event.findById(id);

  if (!event) {
    return res.status(404).json(apiResponse.error(`Event not found with id of ${id}`, 404));
  }

  await event.remove();
  res.status(200).json(apiResponse.success("Event deleted successfully", {}));
});

// @desc    Get latest news and events for homepage
// @route   GET /api/events/latest-updates
// @access  Public
const getLatestEvents = asyncHandler(async (req, res) => {
  try {
    const events = await Event.find().sort({ date: -1 }).limit(2).select("title description date location type");
    const news = await News.find().sort({ publish_date: -1 }).limit(1).select("title content publish_date category");

    const formattedUpdates = [
      ...events.map(event => ({ ...event._doc, type: "event" })),
      ...news.map(item => ({ ...item._doc, type: "news" })),
    ].sort((a, b) => new Date(b.date || b.publish_date) - new Date(a.date || a.publish_date)).slice(0, 3);

    res.status(200).json(apiResponse.success("Latest updates retrieved successfully", { updates: formattedUpdates }));
  } catch (error) {
    console.error("Error fetching latest updates:", error);
    res.status(500).json(apiResponse.error("Failed to retrieve latest updates", 500));
  }
});

module.exports = {
  getEvents,
  getEvent,
  createEvent,
  updateEvent,
  deleteEvent,
  getLatestEvents
};
