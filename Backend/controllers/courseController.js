const Course = require("../models/Course");
const Department= require("../models/Department")
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


const createCourse = asyncHandler(async (req, res) => {
  const {
    code,
    name,
    description,
    credits,
    department_id,
    instructor,
    semester,
    level,
    schedule,
    location,
    prerequisites = [],
    materials = [],
  } = req.body;


  // Parse materials if sent as JSON string
  let parsedMaterials = [];
  try {
    parsedMaterials = typeof materials === "string" ? JSON.parse(materials) : materials;
  } catch (err) {
    return res.status(400).json(apiResponse.error("Invalid materials format", 400));
  }

  // Check department existence
  const department = await Department.findById(department_id);
  if (!department) {
    return res.status(404).json(apiResponse.error("Department not found", 404));
  }

  const course = await Course.create({
    code,
    name,
    description,
    credits,
    department_id,
    instructor,
    semester,
    level,
    schedule,
    location,
    prerequisites,
    materials: parsedMaterials,
    image:req.file ? req.file.filename : undefined,
  });

  res.status(201).json(
    apiResponse.success("Course created successfully", { course }, 201)
  );
});

const updateCourse = asyncHandler(async (req, res) => {
  const {
    code,
    name,
    description,
    credits,
    department_id,
    instructor,
    semester,
    level,
    schedule,
    location,
    prerequisites,
    materials,
  } = req.body;

  // Validate department if provided
  if (department_id) {
    const department = await Department.findById(department_id);
    if (!department) {
      return res.status(404).json(apiResponse.error("Department not found", 404));
    }
  }

  let parsedMaterials = undefined;
  if (materials !== undefined) {
    try {
      parsedMaterials = typeof materials === "string" ? JSON.parse(materials) : materials;
    } catch (err) {
      return res.status(400).json(apiResponse.error("Invalid materials format", 400));
    }
  }

  const updateData = {
    ...(code && { code }),
    ...(name && { name }),
    ...(description && { description }),
    ...(credits && { credits }),
    ...(department_id && { department_id }),
    ...(instructor && { instructor }),
    ...(semester && { semester }),
    ...(level && { level }),
    ...(schedule && { schedule }),
    ...(location && { location }),
    ...(prerequisites && { prerequisites }),
    ...(parsedMaterials !== undefined && { materials: parsedMaterials }), // ✅ Important fix
  };

  if (req.file) {
    updateData.image = req.file.filename;
  }

  const course = await Course.findByIdAndUpdate(req.params.id, updateData, {
    new: true,
    runValidators: true,
  });

  if (!course) {
    return res.status(404).json(apiResponse.error(`Course not found with ID ${req.params.id}`, 404));
  }

  res.status(200).json(apiResponse.success("Course updated successfully", { course }));
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

// @desc    Get total number of courses
// @route   GET /api/courses/count
// @access  Public
const getCourseCount = asyncHandler(async (req, res) => {
  try {
    const count = await Course.countDocuments();
    res.status(200).json(
      apiResponse.success("Course count retrieved successfully", {
        count
      })
    );
  } catch (error) {
    res.status(500).json(
      apiResponse.error("Failed to get course count", 500)
    );
  }
});

// @desc    Get courses by department
// @route   GET /api/courses/by-department/:departmentId
// @access  Public
const getCoursesByDepartment = asyncHandler(async (req, res) => {
  try {
    const courses = await Course.find({ department_id: req.params.departmentId })
      .populate("department_id", "name")
      .sort("-createdAt");

    res.status(200).json(
      apiResponse.success("Courses by department retrieved successfully", {
        count: courses.length,
        courses
      })
    );
  } catch (error) {
    res.status(500).json(
      apiResponse.error("Failed to get courses by department", 500)
    );
  }
});

// @desc    Get course statistics
// @route   GET /api/courses/statistics
// @access  Public
const getCourseStatistics = asyncHandler(async (req, res) => {
  try {
    const totalCourses = await Course.countDocuments();

    // Courses by level
    const coursesByLevel = await Course.aggregate([
      {
        $group: {
          _id: "$level",
          count: { $sum: 1 }
        }
      },
      {
        $project: {
          _id: 0,
          level: "$_id",
          count: 1
        }
      }
    ]);

    // Average credits
    const avgCredits = await Course.aggregate([
      {
        $group: {
          _id: null,
          averageCredits: { $avg: "$credits" },
          totalCredits: { $sum: "$credits" }
        }
      }
    ]);

    res.status(200).json(
      apiResponse.success("Course statistics retrieved successfully", {
        totalCourses,
        coursesByLevel,
        creditStatistics: avgCredits[0] || { averageCredits: 0, totalCredits: 0 }
      })
    );
  } catch (error) {
    res.status(500).json(
      apiResponse.error("Failed to get course statistics", 500)
    );
  }
});

module.exports = {
  getCourses,
  getCourse,
  createCourse,
  updateCourse,
  deleteCourse,
  uploadCoursePhoto,
  resizeCoursePhoto,
  getCourseCount,
  getCoursesByDepartment,
  getCourseStatistics
};
