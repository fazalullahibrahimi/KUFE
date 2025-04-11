// controllers/researchAuthorController.js

const ResearchAuthor = require("../models/ResearchAuthor");
const Research = require("../models/Research");
const User = require("../models/User");
const apiResponse = require("../utils/apiResponse");
const asyncHandler = require("../middleware/asyncHandler");
const validateMongodbId = require("../utils/validateMongoDBId");


const getResearchAuthors = asyncHandler(async (req, res) => {
  let query;

  // Copy req.query
  const reqQuery = { ...req.query };

  // Fields to exclude
  const removeFields = ["select", "sort", "page", "limit"];

  // Loop over removeFields and delete them from reqQuery
  removeFields.forEach((param) => delete reqQuery[param]);

  // Create query string
  let queryStr = JSON.stringify(reqQuery);

  // Create operators ($gt, $gte, etc)
  queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, (match) => `$${match}`);

  // Finding resource
  query = ResearchAuthor.find(JSON.parse(queryStr));

  // Select Fields
  if (req.query.select) {
    const fields = req.query.select.split(",").join(" ");
    query = query.select(fields);
  }

  // Sort
  if (req.query.sort) {
    const sortBy = req.query.sort.split(",").join(" ");
    query = query.sort(sortBy);
  } else {
    query = query.sort("-createdAt");
  }

  // Pagination
  const page = Number.parseInt(req.query.page, 10) || 1;
  const limit = Number.parseInt(req.query.limit, 10) || 25;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total = await ResearchAuthor.countDocuments(JSON.parse(queryStr));

  query = query.skip(startIndex).limit(limit);

  // Populate
  query = query.populate([
    {
      path: "research_id",
      select: "title abstract status",
    },
    {
      path: "author_id",
      select: "fullName email role",
    },
  ]);

  // Executing query
  const researchAuthors = await query;

  // Pagination result
  const pagination = {};

  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit,
    };
  }

  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit,
    };
  }

  res.status(200).json(
    apiResponse.success("Research authors retrieved successfully", {
      count: researchAuthors.length,
      pagination,
      researchAuthors,
    })
  );
});


const getResearchAuthor = asyncHandler(async (req, res) => {
  // Validate MongoDB ID
  if (!validateMongodbId(req.params.id)) {
    return res.status(400).json(apiResponse.error("Invalid research author ID", 400));
  }

  const researchAuthor = await ResearchAuthor.findById(req.params.id).populate([
    {
      path: "research_id",
      select: "title abstract status",
    },
    {
      path: "author_id",
      select: "fullName email role",
    },
  ]);

  if (!researchAuthor) {
    return res.status(404).json(
      apiResponse.error(`Research author not found with id of ${req.params.id}`, 404)
    );
  }

  res.status(200).json(
    apiResponse.success("Research author retrieved successfully", { researchAuthor })
  );
});


const createResearchAuthor = asyncHandler(async (req, res) => {
  const { research_id, author_id, author_type } = req.body;

  // Validate MongoDB IDs
  if (!validateMongodbId(research_id)) {
    return res.status(400).json(apiResponse.error("Invalid research ID", 400));
  }

  if (!validateMongodbId(author_id)) {
    return res.status(400).json(apiResponse.error("Invalid author ID", 400));
  }

  // Check if research exists
  const research = await Research.findById(research_id);
  if (!research) {
    return res.status(404).json(apiResponse.error("Research not found", 404));
  }

  // Check if user exists
  const user = await User.findById(author_id);
  if (!user) {
    return res.status(404).json(apiResponse.error("User not found", 404));
  }

  // Validate author_type against user role
  if (
    (author_type === "faculty" && user.role !== "faculty") ||
    (author_type === "student" && user.role !== "student")
  ) {
    return res.status(400).json(
      apiResponse.error(`Author type '${author_type}' does not match user role '${user.role}'`, 400)
    );
  }

  // Check if author is already assigned to this research
  const existingAuthor = await ResearchAuthor.findOne({
    research_id,
    author_id,
  });

  if (existingAuthor) {
    return res.status(400).json(
      apiResponse.error("This author is already assigned to this research", 400)
    );
  }

  // Create research author
  const researchAuthor = await ResearchAuthor.create({
    research_id,
    author_id,
    author_type,
  });

  res.status(201).json(
    apiResponse.success("Research author created successfully", { researchAuthor }, 201)
  );
});


const updateResearchAuthor = asyncHandler(async (req, res) => {
  const { author_type } = req.body;

  // Validate MongoDB ID
  if (!validateMongodbId(req.params.id)) {
    return res.status(400).json(apiResponse.error("Invalid research author ID", 400));
  }

  // Find research author to update
  let researchAuthor = await ResearchAuthor.findById(req.params.id);

  if (!researchAuthor) {
    return res.status(404).json(
      apiResponse.error(`Research author not found with id of ${req.params.id}`, 404)
    );
  }

  // If changing author_type, validate against user role
  if (author_type && author_type !== researchAuthor.author_type) {
    const user = await User.findById(researchAuthor.author_id);
    
    if (!user) {
      return res.status(404).json(apiResponse.error("Associated user not found", 404));
    }

    if (
      (author_type === "faculty" && user.role !== "faculty") ||
      (author_type === "student" && user.role !== "student")
    ) {
      return res.status(400).json(
        apiResponse.error(`Author type '${author_type}' does not match user role '${user.role}'`, 400)
      );
    }
  }

  // Update research author
  researchAuthor = await ResearchAuthor.findByIdAndUpdate(
    req.params.id,
    { author_type },
    {
      new: true,
      runValidators: true,
    }
  ).populate([
    {
      path: "research_id",
      select: "title abstract status",
    },
    {
      path: "author_id",
      select: "fullName email role",
    },
  ]);

  res.status(200).json(
    apiResponse.success("Research author updated successfully", { researchAuthor })
  );
});

/**
 * @desc    Delete research author
 * @route   DELETE /api/research-authors/:id
 * @access  Private/Admin
 */
const deleteResearchAuthor = asyncHandler(async (req, res) => {
  // Validate MongoDB ID
  if (!validateMongodbId(req.params.id)) {
    return res.status(400).json(apiResponse.error("Invalid research author ID", 400));
  }

  const researchAuthor = await ResearchAuthor.findById(req.params.id);

  if (!researchAuthor) {
    return res.status(404).json(
      apiResponse.error(`Research author not found with id of ${req.params.id}`, 404)
    );
  }

  await researchAuthor.deleteOne();

  res.status(200).json(apiResponse.success("Research author deleted successfully", {}));
});

/**
 * @desc    Get authors for a specific research
 * @route   GET /api/research-authors/research/:researchId
 * @access  Public
 */
const getAuthorsByResearch = asyncHandler(async (req, res) => {
  // Validate MongoDB ID
  if (!validateMongodbId(req.params.researchId)) {
    return res.status(400).json(apiResponse.error("Invalid research ID", 400));
  }

  // Check if research exists
  const research = await Research.findById(req.params.researchId);
  if (!research) {
    return res.status(404).json(apiResponse.error("Research not found", 404));
  }

  // Get authors for this research
  const authors = await ResearchAuthor.find({ research_id: req.params.researchId }).populate(
    "author_id",
    "fullName email image"
  );

  res.status(200).json(
    apiResponse.success("Research authors retrieved successfully", {
      research: {
        id: research._id,
        title: research.title,
      },
      authors,
      count: authors.length,
    })
  );
});

/**
 * @desc    Get research papers by author
 * @route   GET /api/research-authors/author/:authorId
 * @access  Public
 */
const getResearchByAuthor = asyncHandler(async (req, res) => {
  // Validate MongoDB ID
  if (!validateMongodbId(req.params.authorId)) {
    return res.status(400).json(apiResponse.error("Invalid author ID", 400));
  }

  // Check if user exists
  const user = await User.findById(req.params.authorId);
  if (!user) {
    return res.status(404).json(apiResponse.error("User not found", 404));
  }

  // Get research for this author
  const authoredResearch = await ResearchAuthor.find({ author_id: req.params.authorId }).populate(
    "research_id",
    "title abstract status publication_date"
  );

  res.status(200).json(
    apiResponse.success("Author's research retrieved successfully", {
      author: {
        id: user._id,
        name: user.fullName,
        email: user.email,
        role: user.role,
      },
      research: authoredResearch.map(item => item.research_id),
      count: authoredResearch.length,
    })
  );
});

/**
 * @desc    Add multiple authors to a research
 * @route   POST /api/research-authors/bulk
 * @access  Private/Admin
 */
const addMultipleAuthors = asyncHandler(async (req, res) => {
  const { research_id, authors } = req.body;

  // Validate research_id
  if (!validateMongodbId(research_id)) {
    return res.status(400).json(apiResponse.error("Invalid research ID", 400));
  }

  // Check if research exists
  const research = await Research.findById(research_id);
  if (!research) {
    return res.status(404).json(apiResponse.error("Research not found", 404));
  }

  // Validate authors array
  if (!Array.isArray(authors) || authors.length === 0) {
    return res.status(400).json(apiResponse.error("Authors must be a non-empty array", 400));
  }

  // Process each author
  const results = {
    successful: [],
    failed: [],
  };

  for (const author of authors) {
    try {
      // Validate author data
      if (!author.author_id || !author.author_type) {
        results.failed.push({
          author,
          reason: "Missing required fields",
        });
        continue;
      }

      if (!validateMongodbId(author.author_id)) {
        results.failed.push({
          author,
          reason: "Invalid author ID",
        });
        continue;
      }

      // Check if user exists
      const user = await User.findById(author.author_id);
      if (!user) {
        results.failed.push({
          author,
          reason: "User not found",
        });
        continue;
      }

      // Validate author_type against user role
      if (
        (author.author_type === "faculty" && user.role !== "faculty") ||
        (author.author_type === "student" && user.role !== "student")
      ) {
        results.failed.push({
          author,
          reason: `Author type '${author.author_type}' does not match user role '${user.role}'`,
        });
        continue;
      }

      // Check if author is already assigned to this research
      const existingAuthor = await ResearchAuthor.findOne({
        research_id,
        author_id: author.author_id,
      });

      if (existingAuthor) {
        results.failed.push({
          author,
          reason: "Author already assigned to this research",
        });
        continue;
      }

      // Create research author
      const researchAuthor = await ResearchAuthor.create({
        research_id,
        author_id: author.author_id,
        author_type: author.author_type,
      });

      results.successful.push({
        id: researchAuthor._id,
        author_id: author.author_id,
        author_type: author.author_type,
      });
    } catch (error) {
      console.error(`Error processing author: ${error.message}`);
      results.failed.push({
        author,
        reason: error.message,
      });
    }
  }

  res.status(200).json(
    apiResponse.success("Authors processed", {
      research_id,
      results,
      summary: {
        total: authors.length,
        successful: results.successful.length,
        failed: results.failed.length,
      },
    })
  );
});

module.exports = {
  getResearchAuthors,
  getResearchAuthor,
  createResearchAuthor,
  updateResearchAuthor,
  deleteResearchAuthor,
  getAuthorsByResearch,
  getResearchByAuthor,
  addMultipleAuthors,
};