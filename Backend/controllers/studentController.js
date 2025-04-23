const Student = require("../models/Student");
const Department = require("../models/Department");
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

const uploasStudentPhoto = upload.single("image");
// @desc    Get all students
// @route   GET /api/students
// @access  Private/Admin/Faculty
const getStudents = asyncHandler(async (req, res) => {
  let query;

  const reqQuery = { ...req.query };
  const removeFields = ["select", "sort", "page", "limit"];
  removeFields.forEach(param => delete reqQuery[param]);

  let queryStr = JSON.stringify(reqQuery);
  queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

  query = Student.find(JSON.parse(queryStr));

  if (req.query.select) {
    const fields = req.query.select.split(",").join(" ");
    query = query.select(fields);
  }

  if (req.query.sort) {
    const sortBy = req.query.sort.split(",").join(" ");
    query = query.sort(sortBy);
  } else {
    query = query.sort("-createdAt");
  }

  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 25;
  const startIndex = (page - 1) * limit;
  const total = await Student.countDocuments();

  query = query.skip(startIndex).limit(limit);

  query = query.populate("department_id", "name");

  const students = await query;

  const pagination = {};
  if ((page * limit) < total) pagination.next = { page: page + 1, limit };
  if (startIndex > 0) pagination.prev = { page: page - 1, limit };

  res.status(200).json(apiResponse.success("Students retrieved successfully", {
    count: students.length,
    pagination,
    students,
  }));
});

// @desc    Get single student
// @route   GET /api/students/:id
// @access  Private/Admin/Faculty
const getStudent = asyncHandler(async (req, res) => {
  const student = await Student.findById(req.params.id)
    .populate("department_id", "name");

  if (!student) {
    return res.status(404).json(apiResponse.error(`Student not found with id of ${req.params.id}`, 404));
  }

  res.status(200).json(apiResponse.success("Student retrieved successfully", { student }));
});

// @desc    Create new student
// @route   POST /api/students
// @access  Private/Admin
const createStudent = asyncHandler(async (req, res) => {
  const {
    name,
    department_id,
    student_id_number,
    enrollment_year,
    date_of_birth,
    gender,
    email,
    phone,
    address,
    status,
  } = req.body;

  // Check if department exists
  const department = await Department.findById(department_id);
  if (!department) {
    return res.status(404).json(apiResponse.error("Department not found", 404));
  }

  // Check if student ID number is unique


  // Create student with or without image
  const student = await Student.create({
    name,
    department_id,
    student_id_number,
    enrollment_year,
    date_of_birth,
    gender,
    email,
    phone,
    address,
    status,
    profile_image: req.file ? req.file.filename : undefined,
  });

  res
    .status(201)
    .json(apiResponse.success("Student created successfully", { student }, 201));
});


// @desc    Update student
// @route   PUT /api/students/:id
// @access  Private/Admin
const updateStudent = asyncHandler(async (req, res) => {
  const {
    name,
    department_id,
    enrollment_year,
    date_of_birth,
    gender,
    email,
    phone,
    address,
    status,
  } = req.body;

  // Check if department_id is provided and valid
  if (department_id) {
    const department = await Department.findById(department_id);
    if (!department) {
      return res.status(404).json(apiResponse.error("Department not found", 404));
    }
  }

  // Check if student exists
  let student = await Student.findById(req.params.id);
  if (!student) {
    return res.status(404).json(apiResponse.error(`Student not found with id of ${req.params.id}`, 404));
  }

  // Prepare update data
  const updateData = {
    name,
    department_id,
    enrollment_year,
    date_of_birth,
    gender,
    email,
    phone,
    address,
    status,
  };

  // If a new profile image is uploaded, update it
  if (req.file) {
    updateData.profile_image = req.file.filename;
  }

  // Update student document
  student = await Student.findByIdAndUpdate(req.params.id, updateData, {
    new: true,
    runValidators: true,
  }).populate("department_id", "name");

  res.status(200).json(apiResponse.success("Student updated successfully", { student }));
});


// @desc    Delete student
// @route   DELETE /api/students/:id
// @access  Private/Admin
const deleteStudent = asyncHandler(async (req, res) => {
  const student = await Student.findById(req.params.id);
  if (!student) {
    return res.status(404).json(apiResponse.error(`Student not found with id of ${req.params.id}`, 404));
  }

  await student.deleteOne();

  res.status(200).json(apiResponse.success("Student deleted successfully", {}));
});

const resizeStudentPhoto = asyncHandler(async (req, res, next) => {
  if (!req.file) return next();

  const dir = path.join(__dirname, '.././public/img/students');
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



// Get total number of students
const getStudentCount = async (req, res) => {
  try {
    const count = await Student.countDocuments();
    res.status(200).json(count);
  } catch (error) {
    res.status(500).json({ message: "Failed to get student count", error });
  }
};


module.exports = {
  getStudents,
  getStudent,
  createStudent,
  updateStudent,
  deleteStudent,
  uploasStudentPhoto,
  resizeStudentPhoto,
  getStudentCount
};
