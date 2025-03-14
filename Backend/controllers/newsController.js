const News = require("../models/News")
const Faculty = require("../models/Faculty")
const apiResponse = require("../utils/apiResponse")
const logger = require("../utils/logger")

// @desc    Get all news
// @route   GET /api/news
// @access  Public
exports.getNews = async (req, res) => {
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
    query = News.find(JSON.parse(queryStr))

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
      query = query.sort("-publish_date")
    }

    // Pagination
    const page = Number.parseInt(req.query.page, 10) || 1
    const limit = Number.parseInt(req.query.limit, 10) || 25
    const startIndex = (page - 1) * limit
    const endIndex = page * limit
    const total = await News.countDocuments()

    query = query.skip(startIndex).limit(limit)

    // Populate
    if (req.query.populate) {
      query = query.populate("faculty_id", "name")
    }

    // Executing query
    const news = await query

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
      apiResponse.success("News retrieved successfully", {
        count: news.length,
        pagination,
        news,
      }),
    )
  } catch (err) {
    logger.error(`Error in getNews: ${err.message}`)
    res.status(500).json(apiResponse.error("Server error", 500))
  }
}

// @desc    Get single news
// @route   GET /api/news/:id
// @access  Public
exports.getSingleNews = async (req, res) => {
  try {
    const news = await News.findById(req.params.id).populate("faculty_id", "name")

    if (!news) {
      return res.status(404).json(apiResponse.error(`News not found with id of ${req.params.id}`, 404))
    }

    res.status(200).json(apiResponse.success("News retrieved successfully", { news }))
  } catch (err) {
    logger.error(`Error in getSingleNews: ${err.message}`)
    res.status(500).json(apiResponse.error("Server error", 500))
  }
}

// @desc    Create new news
// @route   POST /api/news
// @access  Private/Admin/Faculty
exports.createNews = async (req, res) => {
  try {
    const { title, content, publish_date, category, faculty_id } = req.body

    // Check if faculty exists if provided
    if (faculty_id) {
      const faculty = await Faculty.findById(faculty_id)
      if (!faculty) {
        return res.status(404).json(apiResponse.error("Faculty not found", 404))
      }
    }

    // Create news
    const news = await News.create({
      title,
      content,
      publish_date: publish_date || Date.now(),
      category,
      faculty_id,
    })

    res.status(201).json(apiResponse.success("News created successfully", { news }, 201))
  } catch (err) {
    logger.error(`Error in createNews: ${err.message}`)
    res.status(500).json(apiResponse.error("Server error", 500))
  }
}

// @desc    Update news
// @route   PUT /api/news/:id
// @access  Private/Admin/Faculty
exports.updateNews = async (req, res) => {
  try {
    const { title, content, publish_date, category, faculty_id } = req.body

    // Check if faculty exists if provided
    if (faculty_id) {
      const faculty = await Faculty.findById(faculty_id)
      if (!faculty) {
        return res.status(404).json(apiResponse.error("Faculty not found", 404))
      }
    }

    // Find news to update
    let news = await News.findById(req.params.id)

    if (!news) {
      return res.status(404).json(apiResponse.error(`News not found with id of ${req.params.id}`, 404))
    }

    // Build update object
    const updateData = {}
    if (title) updateData.title = title
    if (content) updateData.content = content
    if (publish_date) updateData.publish_date = publish_date
    if (category) updateData.category = category
    if (faculty_id) updateData.faculty_id = faculty_id

    // Update news
    news = await News.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    }).populate("faculty_id", "name")

    res.status(200).json(apiResponse.success("News updated successfully", { news }))
  } catch (err) {
    logger.error(`Error in updateNews: ${err.message}`)
    res.status(500).json(apiResponse.error("Server error", 500))
  }
}

// @desc    Delete news
// @route   DELETE /api/news/:id
// @access  Private/Admin
exports.deleteNews = async (req, res) => {
  try {
    const news = await News.findById(req.params.id)

    if (!news) {
      return res.status(404).json(apiResponse.error(`News not found with id of ${req.params.id}`, 404))
    }

    await news.remove()

    res.status(200).json(apiResponse.success("News deleted successfully", {}))
  } catch (err) {
    logger.error(`Error in deleteNews: ${err.message}`)
    res.status(500).json(apiResponse.error("Server error", 500))
  }
}

