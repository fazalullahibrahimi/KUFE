const Research = require("../models/Research");
const ResearchAuthor = require("../models/ResearchAuthor");
const User = require("../models/User"); // Make sure to import User model
const apiResponse = require("../utils/apiResponse");
const asyncHandler = require("../middleware/asyncHandler");
const mongoose = require("mongoose");

// @desc    Get all research
// @route   GET /api/research
// @access  Public
const getResearch = asyncHandler(async (req, res) => {
  let query;

  // For public access, only show published research
  if (!req.user) {
    query = Research.find({ status: "published" });
  } else if (req.user.role === "admin") {
    // Admin can see all research
    query = Research.find();
  } else {
    // Faculty and students can see published research and their own research
    const authoredResearch = await ResearchAuthor.find({ author_id: req.user.id }).select("research_id");
    const authoredIds = authoredResearch.map((item) => item.research_id);

    query = Research.find({
      $or: [{ status: "published" }, { _id: { $in: authoredIds } }],
    });
  }

  // Execute the query to get research papers
  const researchPapers = await query;

  // Fetch authors for each research paper
  const researchWithAuthors = await Promise.all(
    researchPapers.map(async (paper) => {
      // Get authors for this research
      const authors = await ResearchAuthor.find({ research_id: paper._id })
        .populate("author_id", "fullName email role");

      // Convert Mongoose document to plain object
      const paperObj = paper.toObject();
      
      // Add authors to the research paper object
      return {
        ...paperObj,
        authors: authors.map(author => ({
          _id: author._id,
          author_id: author.author_id,
          author_type: author.author_type
        }))
      };
    })
  );

  res.status(200).json(
    apiResponse.success("Research retrieved successfully", {
      count: researchWithAuthors.length,
      research: researchWithAuthors,
    })
  );
});

// @desc    Get single research
// @route   GET /api/research/:id
// @access  Public/Private
const getSingleResearch = asyncHandler(async (req, res) => {
  // Validate MongoDB ID
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json(apiResponse.error("Invalid research ID", 400));
  }

  const research = await Research.findById(req.params.id);

  if (!research) {
    return res.status(404).json(apiResponse.error(`Research not found with id of ${req.params.id}`, 404));
  }

  // Check if user is authorized to view this research
  if (research.status !== "published" && (!req.user || req.user.role !== "admin")) {
    // Check if user is an author
    const isAuthor = await ResearchAuthor.findOne({
      research_id: research._id,
      author_id: req.user ? req.user.id : null,
    });

    if (!isAuthor) {
      return res.status(403).json(apiResponse.error("Not authorized to access this research", 403));
    }
  }

  // Get authors
  const authors = await ResearchAuthor.find({ research_id: research._id })
    .populate("author_id", "fullName email role");

  // Convert Mongoose document to plain object
  const researchObj = research.toObject();

  res.status(200).json(
    apiResponse.success("Research retrieved successfully", {
      research: {
        ...researchObj,
        authors,
      },
    })
  );
});

// @desc    Create new research
// @route   POST /api/research
// @access  Private
const createResearch = asyncHandler(async (req, res) => {
  const { title, abstract, co_authors } = req.body;

  // Create research
  const research = await Research.create({
    title,
    abstract,
    file_path: req.file ? req.file.path : null,
    status: "submitted",
  });

  // Add current user as author
  await ResearchAuthor.create({
    research_id: research._id,
    author_id: req.user.id,
    author_type: req.user.role === "faculty" ? "faculty" : "student",
  });

  // Add co-authors if provided
  if (co_authors && Array.isArray(co_authors)) {
    const authorPromises = co_authors.map((author) => {
      return ResearchAuthor.create({
        research_id: research._id,
        author_id: author.id,
        author_type: author.type,
      });
    });

    await Promise.all(authorPromises);
  }

  // Get the created research with authors
  const createdResearch = await Research.findById(research._id);
  const authors = await ResearchAuthor.find({ research_id: research._id })
    .populate("author_id", "fullName email role");

  // Convert Mongoose document to plain object
  const researchObj = createdResearch.toObject();

  res.status(201).json(
    apiResponse.success("Research submitted successfully", { 
      research: {
        ...researchObj,
        authors
      }
    }, 201)
  );
});

// @desc    Update research
// @route   PUT /api/research/:id
// @access  Private
const updateResearch = asyncHandler(async (req, res) => {
  // Validate MongoDB ID
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json(apiResponse.error("Invalid research ID", 400));
  }

  let research = await Research.findById(req.params.id);

  if (!research) {
    return res.status(404).json(apiResponse.error(`Research not found with id of ${req.params.id}`, 404));
  }

  // Check if user is authorized to update this research
  if (req.user.role !== "admin") {
    // Check if user is an author
    const isAuthor = await ResearchAuthor.findOne({
      research_id: research._id,
      author_id: req.user.id,
    });

    if (!isAuthor) {
      return res.status(403).json(apiResponse.error("Not authorized to update this research", 403));
    }
  }

  // Update fields
  const { title, abstract, status } = req.body;

  const updateData = {
    title: title || research.title,
    abstract: abstract || research.abstract,
  };

  // Only admin can change status
  if (status && req.user.role === "admin") {
    updateData.status = status;
  }

  // Update file if provided
  if (req.file) {
    updateData.file_path = req.file.path;
  }

  research = await Research.findByIdAndUpdate(req.params.id, updateData, {
    new: true,
    runValidators: true,
  });

  // Get authors
  const authors = await ResearchAuthor.find({ research_id: research._id })
    .populate("author_id", "fullName email role");

  // Convert Mongoose document to plain object
  const researchObj = research.toObject();

  res.status(200).json(
    apiResponse.success("Research updated successfully", { 
      research: {
        ...researchObj,
        authors
      }
    })
  );
});

// @desc    Delete research
// @route   DELETE /api/research/:id
// @access  Private/Admin
const deleteResearch = asyncHandler(async (req, res) => {
  // Validate MongoDB ID
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json(apiResponse.error("Invalid research ID", 400));
  }

  const research = await Research.findById(req.params.id);

  if (!research) {
    return res.status(404).json(apiResponse.error(`Research not found with id of ${req.params.id}`, 404));
  }

  // Delete research and all associated authors
  await ResearchAuthor.deleteMany({ research_id: research._id });
  
  // Use deleteOne instead of remove (which is deprecated)
  await research.deleteOne();

  res.status(200).json(apiResponse.success("Research deleted successfully", {}));
});

// @desc    Get research by status
// @route   GET /api/research/status/:status
// @access  Private/Admin
const getResearchByStatus = asyncHandler(async (req, res) => {
  const { status } = req.params;
  
  // Validate status
  const validStatuses = ["submitted", "under review", "published"];
  if (!validStatuses.includes(status)) {
    return res.status(400).json(
      apiResponse.error(`Invalid status. Must be one of: ${validStatuses.join(", ")}`, 400)
    );
  }

  // Find research with the specified status
  const researchPapers = await Research.find({ status });

  // Fetch authors for each research paper
  const researchWithAuthors = await Promise.all(
    researchPapers.map(async (paper) => {
      // Get authors for this research
      const authors = await ResearchAuthor.find({ research_id: paper._id })
        .populate("author_id", "fullName email role");

      // Convert Mongoose document to plain object
      const paperObj = paper.toObject();
      
      // Add authors to the research paper object
      return {
        ...paperObj,
        authors: authors.map(author => ({
          _id: author._id,
          author_id: author.author_id,
          author_type: author.author_type
        }))
      };
    })
  );

  res.status(200).json(
    apiResponse.success(`Research with status '${status}' retrieved successfully`, {
      count: researchWithAuthors.length,
      research: researchWithAuthors,
    })
  );
});

module.exports = {
  getResearch,
  getSingleResearch,
  createResearch,
  updateResearch,
  deleteResearch,
  getResearchByStatus
};