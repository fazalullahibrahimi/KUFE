const Research = require("../models/Research")
const ResearchAuthor = require("../models/ResearchAuthor")
const apiResponse = require("../utils/apiResponse")
const asyncHandler = require("../middleware/asyncHandler")

// @desc    Get all research
// @route   GET /api/research
// @access  Public
const getResearch = asyncHandler(async (req, res) => {
  let query

  // For public access, only show published research
  if (!req.user) {
    query = Research.find({ status: "published" })
  } else if (req.user.role === "admin") {
    // Admin can see all research
    query = Research.find()
  } else {
    // Faculty and students can see published research and their own research
    const authoredResearch = await ResearchAuthor.find({ author_id: req.user.id }).select("research_id")
    const authoredIds = authoredResearch.map((item) => item.research_id)

    query = Research.find({
      $or: [{ status: "published" }, { _id: { $in: authoredIds } }],
    })
  }

  // Populate with authors
  query = query.populate({
    path: "authors",
    select: "author_id author_type",
    populate: {
      path: "author_id",
      select: "username email",
    },
  })

  const research = await query

  res.status(200).json(
    apiResponse.success("Research retrieved successfully", {
      count: research.length,
      research,
    }),
  )
})

// @desc    Get single research
// @route   GET /api/research/:id
// @access  Public/Private
const getSingleResearch = asyncHandler(async (req, res) => {
  const research = await Research.findById(req.params.id)

  if (!research) {
    return res.status(404).json(apiResponse.error(`Research not found with id of ${req.params.id}`, 404))
  }

  // Check if user is authorized to view this research
  if (research.status !== "published" && (!req.user || req.user.role !== "admin")) {
    // Check if user is an author
    const isAuthor = await ResearchAuthor.findOne({
      research_id: research._id,
      author_id: req.user ? req.user.id : null,
    })

    if (!isAuthor) {
      return res.status(403).json(apiResponse.error("Not authorized to access this research", 403))
    }
  }

  // Get authors
  const authors = await ResearchAuthor.find({ research_id: research._id }).populate("author_id", "username email")

  res.status(200).json(
    apiResponse.success("Research retrieved successfully", {
      research: {
        ...research._doc,
        authors,
      },
    }),
  )
})

// @desc    Create new research
// @route   POST /api/research
// @access  Private
const createResearch = asyncHandler(async (req, res) => {
  const { title, abstract, co_authors } = req.body

  // Create research
  const research = await Research.create({
    title,
    abstract,
    file_path: req.file ? req.file.path : null,
    status: "submitted",
  })

  // Add current user as author
  await ResearchAuthor.create({
    research_id: research._id,
    author_id: req.user.id,
    author_type: req.user.role === "faculty" ? "faculty" : "student",
  })

  // Add co-authors if provided
  if (co_authors && Array.isArray(co_authors)) {
    const authorPromises = co_authors.map((author) => {
      return ResearchAuthor.create({
        research_id: research._id,
        author_id: author.id,
        author_type: author.type,
      })
    })

    await Promise.all(authorPromises)
  }

  res.status(201).json(apiResponse.success("Research submitted successfully", { research }, 201))
})

// @desc    Update research
// @route   PUT /api/research/:id
// @access  Private
const updateResearch = asyncHandler(async (req, res) => {
  let research = await Research.findById(req.params.id)

  if (!research) {
    return res.status(404).json(apiResponse.error(`Research not found with id of ${req.params.id}`, 404))
  }

  // Check if user is authorized to update this research
  if (req.user.role !== "admin") {
    // Check if user is an author
    const isAuthor = await ResearchAuthor.findOne({
      research_id: research._id,
      author_id: req.user.id,
    })

    if (!isAuthor) {
      return res.status(403).json(apiResponse.error("Not authorized to update this research", 403))
    }
  }

  // Update fields
  const { title, abstract, status } = req.body

  const updateData = {
    title: title || research.title,
    abstract: abstract || research.abstract,
  }

  // Only admin can change status
  if (status && req.user.role === "admin") {
    updateData.status = status
  }

  // Update file if provided
  if (req.file) {
    updateData.file_path = req.file.path
  }

  research = await Research.findByIdAndUpdate(req.params.id, updateData, {
    new: true,
    runValidators: true,
  })

  res.status(200).json(apiResponse.success("Research updated successfully", { research }))
})

// @desc    Delete research
// @route   DELETE /api/research/:id
// @access  Private/Admin
const deleteResearch = asyncHandler(async (req, res) => {
  const research = await Research.findById(req.params.id)

  if (!research) {
    return res.status(404).json(apiResponse.error(`Research not found with id of ${req.params.id}`, 404))
  }

  // Delete research and all associated authors
  await ResearchAuthor.deleteMany({ research_id: research._id })
  await research.remove()

  res.status(200).json(apiResponse.success("Research deleted successfully", {}))
})

module.exports = {
  getResearch,
  getSingleResearch,
  createResearch,
  updateResearch,
  deleteResearch,
}

