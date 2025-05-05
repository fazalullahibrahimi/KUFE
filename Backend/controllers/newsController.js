const News = require("../models/News")
const Faculty = require("../models/Faculty")
const apiResponse = require("../utils/apiResponse")
const asyncHandler = require("../middleware/asyncHandler")





const multer = require("multer");
const sharp = require("sharp");
const path = require("path");
const fs = require("fs");


const multerStorage = multer.memoryStorage();

// Filter to ensure only images are uploaded
const multerFilter = (req, file, cb) => {

  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb("Not an image! Please upload only images.", false);
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb('Not an image! Please upload only images.', false);
  }
};}

// Multer upload configuration
const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

// Middleware to handle single image file upload with name 'image'

const uploadNewstPhoto = upload.single("image");


// @desc    Get all news
// @route   GET /api/news
// @access  Public
const getNews = asyncHandler(async (req, res) => {
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
})

// @desc    Get single news
// @route   GET /api/news/:id
// @access  Public
const getSingleNews = asyncHandler(async (req, res) => {
  const news = await News.findById(req.params.id).populate("faculty_id", "name")

  if (!news) {
    return res.status(404).json(apiResponse.error(`News not found with id of ${req.params.id}`, 404))
  }

  res.status(200).json(apiResponse.success("News retrieved successfully", { news }))
})


const createNews = asyncHandler(async (req, res) => {
  const { title, content, publish_date, category, faculty_id } = req.body

  // Validate faculty if provided
  if (faculty_id) {
    const faculty = await Faculty.findById(faculty_id)
    if (!faculty) {
      return res.status(404).json(apiResponse.error("Faculty not found", 404))
    }
  }

  // Handle uploaded image
  const image = req.file ? req.file.filename : "default-event.jpg"

  // Create news
  const news = await News.create({
    title,
    content,
    publish_date: publish_date || Date.now(),
    category,
    faculty_id,
    image,
  })

  res.status(201).json(apiResponse.success("News created successfully", { news }, 201))
})


const updateNews = asyncHandler(async (req, res) => {
  const { title, content, publish_date, category, faculty_id } = req.body

  // Check if faculty exists if provided
  if (faculty_id) {
    const faculty = await Faculty.findById(faculty_id)
    if (!faculty) {
      return res.status(404).json(apiResponse.error("Faculty not found", 404))
    }
  }

  // Find existing news
  let news = await News.findById(req.params.id)
  if (!news) {
    return res.status(404).json(apiResponse.error(`News not found with id of ${req.params.id}`, 404))
  }

  // Prepare update object
  const updateData = {
    title: title || news.title,
    content: content || news.content,
    publish_date: publish_date || news.publish_date,
    category: category || news.category,
    faculty_id: faculty_id || news.faculty_id,
    image: req.file ? req.file.filename : news.image, // Handle image update
  }

  // Update news document
  news = await News.findByIdAndUpdate(req.params.id, updateData, {
    new: true,
    runValidators: true,
  }).populate("faculty_id", "name")

  res.status(200).json(apiResponse.success("News updated successfully", { news }))
})


// @desc    Delete news
// @route   DELETE /api/news/:id
// @access  Private/Admin
const deleteNews = asyncHandler(async (req, res) => {
  const news = await News.findByIdAndDelete(req.params.id)

  if (!news) {
    return res.status(404).json(apiResponse.error(`News not found with id of ${req.params.id}`, 404))
  }

  res.status(200).json(apiResponse.success("News deleted successfully", {}))
})



const resizeNewsPhoto = asyncHandler(async (req, res, next) => {
  if (!req.file) return next();

  const dir = path.join(__dirname, '.././public/img/news');
  if (!fs.existsSync(dir)) {
    try {
      fs.mkdirSync(dir, { recursive: true });
    } catch (error) {
      console.error('Error creating image directory:', error);
      return res.status(500).send({
        success:false,
        message:"Failed to create image directory"
      })
      
    }
  }

  const filename = `user-${Date.now()}-${Math.random()
    .toString(36)
    .substr(2, 9)}.jpeg`;
  req.file.filename = filename;

  try {
    await sharp(req.file.buffer)
      .resize(500, 500)
      .toFormat('jpeg')
      .jpeg({ quality: 90 })
      .toFile(path.join(dir, filename));
  } catch (error) {
    console.error('Error processing image:', error);
    return res.status(500).send({
      success:false,
      message:"Error processing image"
    })
   
  }

  next();
});

module.exports = {
  getNews,
  getSingleNews,
  createNews,
  updateNews,
  deleteNews,
  uploadNewstPhoto,
  resizeNewsPhoto
}

