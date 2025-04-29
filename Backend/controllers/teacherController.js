const Teacher = require("../models/Teacher");
const Department = require("../models/Department");
const apiResponse = require("../utils/apiResponse");
const asyncHandler = require("../middleware/asyncHandler");
const validateMongodbId = require("../utils/validateMongoDBId");
const multer = require("multer");
const sharp = require("sharp");
const path = require("path");
const fs = require("fs");

// Multer Storage setup in memory
const multerStorage = multer.memoryStorage();

// File filter for images only
const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new Error("Not an image! Please upload only images."), false);
  }
};

// Multer upload
const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

const uploadTeacherPhoto = upload.single("image");

// Resize uploaded teacher photo
const resizeTeacherPhoto = asyncHandler(async (req, res, next) => {
  if (!req.file) return next();

  const dir = path.join(__dirname, "../public/img/teachers");
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  const filename = `teacher-${Date.now()}-${Math.round(Math.random() * 1e9)}.jpeg`;
  req.file.filename = filename;

  await sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat("jpeg")
    .jpeg({ quality: 90 })
    .toFile(path.join(dir, filename));

  next();
});

// GET All Teachers
const getTeachers = asyncHandler(async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 25;
  const skip = (page - 1) * limit;

  const teachers = await Teacher.find()
    .skip(skip)
    .limit(limit)
    .sort("-createdAt");

  const total = await Teacher.countDocuments();

  const pagination = {};
  if (skip + limit < total) pagination.next = { page: page + 1, limit };
  if (skip > 0) pagination.prev = { page: page - 1, limit };

  res.status(200).json(
    apiResponse.success("Teachers retrieved successfully", {
      count: teachers.length,
      pagination,
      teachers,
    })
  );
});

// GET Single Teacher
const getTeacher = asyncHandler(async (req, res) => {
  if (!validateMongodbId(req.params.id)) {
    return res.status(400).json(apiResponse.error("Invalid teacher ID", 400));
  }

  const teacher = await Teacher.findById(req.params.id);

  if (!teacher) {
    return res.status(404).json(apiResponse.error(`Teacher not found with id ${req.params.id}`, 404));
  }

  res.status(200).json(apiResponse.success("Teacher retrieved successfully", { teacher }));
});

// CREATE Teacher
const createTeacher = asyncHandler(async (req, res) => {
  const {
    name,
    position,
    department_id,
    contact_info,
    profile,
    featured,
    status,
  } = req.body;

  if (!validateMongodbId(department_id)) {
    return res.status(400).json(apiResponse.error("Invalid department ID", 400));
  }

  const department = await Department.findById(department_id);
  if (!department) {
    return res.status(404).json(apiResponse.error("Department not found", 404));
  }

  const teacherData = {
    name,
    position,
    department_id,
    department_name: department.name,
    contact_info,
    profile,
    featured: featured || false,
    status: status || "active",
    image: req.file ? req.file.filename : "default-event.jpg",
  };

  const teacher = await Teacher.create(teacherData);

  res.status(201).json(apiResponse.success("Teacher created successfully", { teacher }));
});

// UPDATE Teacher
const updateTeacher = asyncHandler(async (req, res) => {
  if (!validateMongodbId(req.params.id)) {
    return res.status(400).json(apiResponse.error("Invalid teacher ID", 400));
  }

  const teacher = await Teacher.findById(req.params.id);
  if (!teacher) {
    return res.status(404).json(apiResponse.error(`Teacher not found with id ${req.params.id}`, 404));
  }

  const updateData = { ...req.body };

  if (req.body.department_id) {
    if (!validateMongodbId(req.body.department_id)) {
      return res.status(400).json(apiResponse.error("Invalid department ID", 400));
    }
    const department = await Department.findById(req.body.department_id);
    if (!department) {
      return res.status(404).json(apiResponse.error("Department not found", 404));
    }
    updateData.department_name = department.name;
  }

  if (req.file) {
    updateData.image = req.file.filename;
  }

  const updatedTeacher = await Teacher.findByIdAndUpdate(
    req.params.id,
    updateData,
    { new: true, runValidators: true }
  );

  res.status(200).json(apiResponse.success("Teacher updated successfully", { teacher: updatedTeacher }));
});

// DELETE Teacher
const deleteTeacher = asyncHandler(async (req, res) => {
  if (!validateMongodbId(req.params.id)) {
    return res.status(400).json(apiResponse.error("Invalid teacher ID", 400));
  }

  const teacher = await Teacher.findById(req.params.id);
  if (!teacher) {
    return res.status(404).json(apiResponse.error(`Teacher not found with id ${req.params.id}`, 404));
  }

  await teacher.deleteOne();

  res.status(200).json(apiResponse.success("Teacher deleted successfully", {}));
});

module.exports = {
  getTeachers,
  getTeacher,
  createTeacher,
  updateTeacher,
  deleteTeacher,
  uploadTeacherPhoto,
  resizeTeacherPhoto,
};
