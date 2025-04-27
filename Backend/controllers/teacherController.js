const Teacher = require("../models/Teacher")
const FacultyMember = require("../models/FacultyMember")
const apiResponse = require("../utils/apiResponse")
const asyncHandler = require("../middleware/asyncHandler.js")
const validateMongodbId = require("../utils/validateMongoDBId.js")




const multer = require("multer");
const sharp = require("sharp");
const path = require("path");
const fs = require("fs");
const crypto = require("crypto");
const Joi = require('joi');

// Multer and image processing setup remains the same
// Configure Multer Storage in memory
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

const uploadTeacherPhoto = upload.single("image");



const getTeachers = asyncHandler(async (req, res) => {
  // Pagination & filtering logic stays the same...
  const page = Number(req.query.page) || 1
  const limit = Number(req.query.limit) || 25
  const skip = (page - 1) * limit

  const query = Teacher.find()
    .populate({
      path: "faculty_member_id",
      select: "name position user_id department_id", // ✅ select the fields you're going to populate
      populate: [
        {
          path: "user_id",
          select: "username email",
        },
        {
          path: "department_id",
          select: "name",
        },
      ],
    })
    .skip(skip)
    .limit(limit)
    .sort("-createdAt")

  const teachers = await query
  const total = await Teacher.countDocuments()

  const pagination = {}
  if (skip + limit < total) pagination.next = { page: page + 1, limit }
  if (skip > 0) pagination.prev = { page: page - 1, limit }

  res.status(200).json(
    apiResponse.success("Teachers retrieved successfully", {
      count: teachers.length,
      pagination,
      teachers,
    })
  )
})



const getTeacher = asyncHandler(async (req, res) => {
  if (!validateMongodbId(req.params.id)) {
    return res.status(400).json(apiResponse.error("Invalid teacher ID", 400))
  }

  const teacher = await Teacher.findById(req.params.id).populate({
    path: "faculty_member_id",
    select: "name position user_id department_id", // ✅ include these in the first select
    populate: [
      {
        path: "user_id",
        select: "username email",
      },
      {
        path: "department_id",
        select: "name",
      },
    ],
  })

  if (!teacher) {
    return res.status(404).json(apiResponse.error(`Teacher not found with id of ${req.params.id}`, 404))
  }

  res.status(200).json(apiResponse.success("Teacher retrieved successfully", { teacher }))
})



const createTeacher = asyncHandler(async (req, res) => {
  const { faculty_member_id, specialization, office_hours } = req.body

  // Validate MongoDB ID
  if (!validateMongodbId(faculty_member_id)) {
    return res.status(400).json(apiResponse.error("Invalid faculty member ID", 400))
  }

  // Check if faculty member exists
  const facultyMember = await FacultyMember.findById(faculty_member_id)
  if (!facultyMember) {
    return res.status(404).json(apiResponse.error("Faculty member not found", 404))
  }

  // Check for existing teacher for this faculty member
  const existingTeacher = await Teacher.findOne({ faculty_member_id })
  if (existingTeacher) {
    return res.status(400).json(apiResponse.error("Teacher already exists for this faculty member", 400))
  }

  // Handle uploaded image
  const image = req.file ? req.file.filename : "default-event.jpg"

  // Create teacher
  const teacher = await Teacher.create({
    faculty_member_id,
    specialization,
    office_hours,
    image,
  })

  res.status(201).json(apiResponse.success("Teacher created successfully", { teacher }, 201))
})

const updateTeacher = asyncHandler(async (req, res) => {
  const { specialization, office_hours } = req.body

  // Validate MongoDB ID
  if (!validateMongodbId(req.params.id)) {
    return res.status(400).json(apiResponse.error("Invalid teacher ID", 400))
  }

  let teacher = await Teacher.findById(req.params.id)
  if (!teacher) {
    return res.status(404).json(apiResponse.error(`Teacher not found with id of ${req.params.id}`, 404))
  }

  // Build update object
  const updateData = {
    specialization: specialization || teacher.specialization,
    office_hours: office_hours || teacher.office_hours,
    image: req.file ? req.file.filename : teacher.image,
  }

  teacher = await Teacher.findByIdAndUpdate(req.params.id, updateData, {
    new: true,
    runValidators: true,
  }).populate({
    path: "faculty_member_id",
    select: "name position",
    populate: [
      { path: "user_id", select: "username email" },
      { path: "department_id", select: "name" },
    ],
  })

  res.status(200).json(apiResponse.success("Teacher updated successfully", { teacher }))
})



const deleteTeacher = asyncHandler(async (req, res) => {
  // Validate MongoDB ID
  if (!validateMongodbId(req.params.id)) {
    return res.status(400).json(apiResponse.error("Invalid teacher ID", 400))
  }

  const teacher = await Teacher.findById(req.params.id)

  if (!teacher) {
    return res.status(404).json(apiResponse.error(`Teacher not found with id of ${req.params.id}`, 404))
  }

  await teacher.remove()

  res.status(200).json(apiResponse.success("Teacher deleted successfully", {}))
});


const resizeTeacherPhoto = asyncHandler(async (req, res, next) => {
  if (!req.file) return next();

  const dir = path.join(__dirname, '.././public/img/teachers');
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
  getTeachers,
  getTeacher,
  createTeacher,
  updateTeacher,
  deleteTeacher,
  uploadTeacherPhoto,
  resizeTeacherPhoto
  
}
