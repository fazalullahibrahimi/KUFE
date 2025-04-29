const Research = require("../models/Research")
const asyncHandler = require("express-async-handler")
const path = require("path")
const fs = require("fs")

// @desc    Get all published research
// @route   GET /api/v1/research/published
// @access  Public
const getPublishedResearch = asyncHandler(async (req, res) => {
  const research = await Research.find({ status: "accepted" }).sort({ createdAt: -1 })
  res.status(200).json({
    status: "success",
    results: research.length,
    data: {
      research,
    },
  })
})

// @desc    Get all research (for admin)
// @route   GET /api/v1/research
// @access  Protected
const getAllResearch = asyncHandler(async (req, res) => {
  const research = await Research.find().sort({ createdAt: -1 })
  res.status(200).json({
    status: "success",
    results: research.length,
    data: {
      research,
    },
  })
})

// @desc    Get single research by ID
// @route   GET /api/v1/research/:id
// @access  Public
const getSingleResearch = asyncHandler(async (req, res) => {
  const research = await Research.findById(req.params.id)
  if (!research) {
    res.status(404)
    throw new Error("Research not found")
  }
  res.status(200).json({
    status: "success",
    data: {
      research,
    },
  })
})

// @desc    Create new research
// @route   POST /api/v1/research
// @access  Protected (Authors, Researchers, etc.)
const createResearch = asyncHandler(async (req, res) => {
  const { title, abstract, category } = req.body

  if (!title || !abstract || !category) {
    res.status(400)
    throw new Error("Title, abstract, and category are required")
  }

  // Handle file upload
  let filePath = ""
  if (req.file) {
    filePath = `/uploads/research/${req.file.filename}`
  }

  // Parse authors if they're sent as JSON string
  let authors = req.body.authors
  if (typeof authors === "string") {
    try {
      authors = JSON.parse(authors)
    } catch (e) {
      // If it's not valid JSON, use the user's name or treat as single author
      authors = req.user ? [req.user.name] : [authors]
    }
  } else if (!authors || !authors.length) {
    // Default to user name if no authors provided
    authors = req.user ? [req.user.name] : []
  }

  // Parse keywords if they're sent as JSON string
  let keywords = req.body.keywords
  if (typeof keywords === "string") {
    try {
      keywords = JSON.parse(keywords)
    } catch (e) {
      // If it's not valid JSON, try to split by comma
      keywords = keywords
        .split(",")
        .map((k) => k.trim())
        .filter((k) => k)
    }
  }

  // Create new research document with all possible fields
  const newResearch = await Research.create({
    title,
    abstract,
    publication_date: req.body.publication_date || new Date(),
    file_path: filePath,
    pages: req.body.pages || 1, // Default pages to 1 if not provided
    category,
    status: req.body.status || "pending", // Default status to 'pending' if not provided
    authors,
    // Additional fields for student submission
    student_id: req.body.student_id || (req.user ? req.user._id : null),
    student_name: req.body.student_name || (req.user ? req.user.name : null),
    department_id: req.body.department_id || null,
    department_name: req.body.department_name || null,
    keywords: keywords || [],
    reviewer_comments: "",
    reviewer_id: "",
    review_date: null,
  })

  res.status(201).json({
    status: "success",
    data: {
      research: newResearch,
    },
  })
})

// @desc    Update research
// @route   PUT /api/v1/research/:id
// @access  Protected (Only author or admin)
const updateResearch = asyncHandler(async (req, res) => {
  const research = await Research.findById(req.params.id)

  if (!research) {
    res.status(404)
    throw new Error("Research not found")
  }

  const roles = {
    ADMIN: "admin",
    FACULTY: "faculty",
  }

  // Only allow the original author, faculty with manage_research permission, or an admin to update
  if (
    req.user &&
    research.student_id !== req.user._id.toString() &&
    req.user.role !== roles.ADMIN &&
    !(req.user.role === roles.FACULTY && req.user.permissions && req.user.permissions.includes("manage_research"))
  ) {
    res.status(403)
    throw new Error("Not authorized to update this research")
  }

  // Handle file upload
  if (req.file) {
    // Delete old file if it exists
    if (research.file_path && research.file_path.startsWith("/uploads/")) {
      const oldFilePath = path.join(__dirname, "..", "public", research.file_path)
      if (fs.existsSync(oldFilePath)) {
        fs.unlinkSync(oldFilePath)
      }
    }
    req.body.file_path = `/uploads/research/${req.file.filename}`
  }

  // Parse authors if they're sent as JSON string
  if (req.body.authors && typeof req.body.authors === "string") {
    try {
      req.body.authors = JSON.parse(req.body.authors)
    } catch (e) {
      req.body.authors = [req.body.authors]
    }
  }

  // Parse keywords if they're sent as JSON string
  if (req.body.keywords && typeof req.body.keywords === "string") {
    try {
      req.body.keywords = JSON.parse(req.body.keywords)
    } catch (e) {
      req.body.keywords = req.body.keywords
        .split(",")
        .map((k) => k.trim())
        .filter((k) => k)
    }
  }

  const updatedResearch = await Research.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  })

  res.status(200).json({
    status: "success",
    data: {
      research: updatedResearch,
    },
  })
})

// @desc    Delete research
// @route   DELETE /api/v1/research/:id
// @access  Admin
const deleteResearch = asyncHandler(async (req, res) => {
  const research = await Research.findById(req.params.id)

  if (!research) {
    res.status(404)
    throw new Error("Research not found")
  }

  // Delete the associated file if it exists
  if (research.file_path && research.file_path.startsWith("/uploads/")) {
    const filePath = path.join(__dirname, "..", "public", research.file_path)
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath)
    }
  }

  await Research.findByIdAndDelete(req.params.id)
  res.status(200).json({
    status: "success",
    message: "Research deleted successfully",
  })
})

// @desc    Get research by status
// @route   GET /api/v1/research/status/:status
// @access  Admin
const getResearchByStatus = asyncHandler(async (req, res) => {
  const { status } = req.params

  if (!["pending", "accepted", "rejected", "all"].includes(status)) {
    res.status(400)
    throw new Error("Invalid status value. Must be pending, accepted, rejected, or all.")
  }

  const query = status === "all" ? {} : { status }
  const research = await Research.find(query).sort({ createdAt: -1 })

  res.status(200).json({
    status: "success",
    results: research.length,
    data: {
      research,
    },
  })
})

// @desc    Review a research submission
// @route   PATCH /api/v1/research/:id/review
// @access  Protected (Committee members, Admin)
const reviewResearch = asyncHandler(async (req, res) => {
  const { status, reviewer_comments } = req.body

  if (!["pending", "accepted", "rejected"].includes(status)) {
    res.status(400)
    throw new Error("Invalid status value. Must be pending, accepted, or rejected.")
  }

  const research = await Research.findByIdAndUpdate(
    req.params.id,
    {
      status,
      reviewer_comments,
      reviewer_id: req.user ? req.user._id : req.body.reviewer_id,
      review_date: new Date(),
    },
    {
      new: true,
      runValidators: true,
    },
  )

  if (!research) {
    res.status(404)
    throw new Error("Research not found")
  }

  res.status(200).json({
    status: "success",
    data: {
      research,
    },
  })
})

// @desc    Get research by student
// @route   GET /api/v1/research/student/:student_id
// @access  Protected
const getResearchByStudent = asyncHandler(async (req, res) => {
  const { student_id } = req.params
  const research = await Research.find({ student_id }).sort({ createdAt: -1 })

  res.status(200).json({
    status: "success",
    results: research.length,
    data: {
      research,
    },
  })
})

// @desc    Get research by department
// @route   GET /api/v1/research/department/:department_id
// @access  Protected
const getResearchByDepartment = asyncHandler(async (req, res) => {
  const { department_id } = req.params
  const research = await Research.find({ department_id }).sort({ createdAt: -1 })

  res.status(200).json({
    status: "success",
    results: research.length,
    data: {
      research,
    },
  })
})

// @desc    Search research submissions
// @route   GET /api/v1/research/search
// @access  Public
const searchResearch = asyncHandler(async (req, res) => {
  const { query } = req.query

  if (!query) {
    res.status(400)
    throw new Error("Search query is required")
  }

  const research = await Research.find({
    $or: [
      { title: { $regex: query, $options: "i" } },
      { abstract: { $regex: query, $options: "i" } },
      { authors: { $in: [new RegExp(query, "i")] } },
      { keywords: { $in: [new RegExp(query, "i")] } },
      { student_name: { $regex: query, $options: "i" } },
      { department_name: { $regex: query, $options: "i" } },
    ],
  }).sort({ createdAt: -1 })

  res.status(200).json({
    status: "success",
    results: research.length,
    data: {
      research,
    },
  })
})

module.exports = {
  getPublishedResearch,
  getAllResearch,
  getSingleResearch,
  createResearch,
  updateResearch,
  deleteResearch,
  getResearchByStatus,
  reviewResearch,
  getResearchByStudent,
  getResearchByDepartment,
  searchResearch,
}
