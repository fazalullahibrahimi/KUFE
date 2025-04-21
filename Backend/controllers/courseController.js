const Course = require("../models/Course");
const apiResponse = require("../utils/apiResponse");
const asyncHandler = require("../middleware/asyncHandler");

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

const uploadCoursePhoto = upload.single("image");
// @desc    Get all courses
// @route   GET /api/courses
// @access  Public
const getCourses = asyncHandler(async (req, res) => {
  const reqQuery = { ...req.query };
  const removeFields = ["select", "sort", "page", "limit"];
  removeFields.forEach(param => delete reqQuery[param]);

  // Convert operators to MongoDB format
  let queryStr = JSON.stringify(reqQuery);
  queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

  let query = Course.find(JSON.parse(queryStr)).populate("department_id");

  // Select fields
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
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 25;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total = await Course.countDocuments();

  query = query.skip(startIndex).limit(limit);

  const courses = await query;

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
    apiResponse.success("Courses retrieved successfully", {
      count: courses.length,
      pagination,
      courses,
    })
  );
});

// @desc    Get single course
// @route   GET /api/courses/:id
// @access  Public
const getCourse = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.id).populate("department_id");

  if (!course) {
    return res
      .status(404)
      .json(apiResponse.error(`Course not found with id of ${req.params.id}`, 404));
  }

  res.status(200).json(
    apiResponse.success("Course retrieved successfully", { course })
  );
});

// @desc    Create new course
// @route   POST /api/courses
// @access  Private/Admin/Faculty
const createCourse = asyncHandler(async (req, res) => {
  const course = await Course.create(req.body);

  res.status(201).json(
    apiResponse.success("Course created successfully", { course }, 201)
  );
});

// @desc    Update course
// @route   PUT /api/courses/:id
// @access  Private/Admin/Faculty
const updateCourse = asyncHandler(async (req, res) => {
  const course = await Course.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!course) {
    return res
      .status(404)
      .json(apiResponse.error(`Course not found with id of ${req.params.id}`, 404));
  }

  res.status(200).json(
    apiResponse.success("Course updated successfully", { course })
  );
});

// @desc    Delete course
// @route   DELETE /api/courses/:id
// @access  Private/Admin
const deleteCourse = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.id);

  if (!course) {
    return res
      .status(404)
      .json(apiResponse.error(`Course not found with id of ${req.params.id}`, 404));
  }

  await course.deleteOne();

  res.status(200).json(
    apiResponse.success("Course deleted successfully", {})
  );
});


const resizeCoursePhoto = asyncHandler(async (req, res, next) => {
  if (!req.file) return next();

  const dir = path.join(__dirname, '.././public/img/courses');
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
  getCourses,
  getCourse,
  createCourse,
  updateCourse,
  deleteCourse,
  uploadCoursePhoto,
  resizeCoursePhoto
};
