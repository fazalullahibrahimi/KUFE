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


const getTeacherCount = asyncHandler(async (req, res) => {
  try {
    const count = await Teacher.countDocuments();
    res.status(200).json((count));
  } catch (error) {
    console.error("Error retrieving teacher count:", error);
    res.status(500).json(
      apiResponse.error("Failed to retrieve teacher count", 500)
    );
  }
});
const getTopTeachers = asyncHandler(async (req, res) => {
  const topTeachers = await Teacher.find({ featured: true, status: "active" })
    .sort({ "profile.publications.length": -1 }) // fallback sort
    .lean(); // use lean to optimize read

  // Sort manually by number of publications since MongoDB can't sort nested array lengths directly
  const sortedTeachers = topTeachers
    .sort((a, b) => (b.profile?.publications?.length || 0) - (a.profile?.publications?.length || 0))
    .slice(0, 3); // get top 3

  res.status(200).json(apiResponse.success("Top 3 teachers retrieved", sortedTeachers));
});

// @desc    Get teacher statistics by department
// @route   GET /api/teachers/statistics
// @access  Public
const getTeacherStatistics = asyncHandler(async (req, res) => {
  try {
    // Teachers by department
    const teachersByDepartment = await Teacher.aggregate([
      {
        $lookup: {
          from: "departments",
          localField: "department_id",
          foreignField: "_id",
          as: "department"
        }
      },
      {
        $unwind: "$department"
      },
      {
        $group: {
          _id: "$department_id",
          departmentName: { $first: "$department.name" },
          count: { $sum: 1 }
        }
      },
      {
        $project: {
          _id: 0,
          departmentId: "$_id",
          departmentName: 1,
          count: 1
        }
      },
      {
        $sort: { count: -1 }
      }
    ]);

    // Teachers by status
    const teachersByStatus = await Teacher.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 }
        }
      },
      {
        $project: {
          _id: 0,
          status: "$_id",
          count: 1
        }
      }
    ]);

    // Featured teachers count
    const featuredTeachersCount = await Teacher.countDocuments({ featured: true });
    const totalTeachers = await Teacher.countDocuments();

    res.status(200).json(
      apiResponse.success("Teacher statistics retrieved successfully", {
        data: {
          teachersByDepartment,
          teachersByStatus,
          featuredTeachersCount,
          totalTeachers,
          total: totalTeachers
        }
      })
    );
  } catch (error) {
    console.error("Error getting teacher statistics:", error);
    res.status(500).json(
      apiResponse.error("Failed to get teacher statistics", 500)
    );
  }
});

// @desc    Get teachers by department
// @route   GET /api/teachers/by-department/:departmentId
// @access  Public
const getTeachersByDepartment = asyncHandler(async (req, res) => {
  try {
    if (!validateMongodbId(req.params.departmentId)) {
      return res.status(400).json(apiResponse.error("Invalid department ID", 400));
    }

    const teachers = await Teacher.find({
      department_id: req.params.departmentId,
      status: "active"
    })
    .populate("department_id", "name")
    .sort("-createdAt");

    res.status(200).json(
      apiResponse.success("Teachers by department retrieved successfully", {
        count: teachers.length,
        teachers
      })
    );
  } catch (error) {
    res.status(500).json(
      apiResponse.error("Failed to get teachers by department", 500)
    );
  }
});

module.exports = {
  getTeachers,
  getTeacher,
  getTeacherCount,
  createTeacher,
  updateTeacher,
  deleteTeacher,
  uploadTeacherPhoto,
  resizeTeacherPhoto,
  getTopTeachers,
  getTeacherStatistics,
  getTeachersByDepartment,
};
