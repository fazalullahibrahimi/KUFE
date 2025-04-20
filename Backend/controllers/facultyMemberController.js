const FacultyMember = require("../models/FacultyMember");
const Department = require("../models/Department");
const apiResponse = require("../utils/apiResponse");
const asyncHandler = require("../middleware/asyncHandler");
const validateMongoDBId = require("../utils/validateMongoDBId");

// @desc    Get all faculty members
// @route   GET /api/faculty-members
// @access  Public
const getFacultyMembers = asyncHandler(async (req, res) => {
  let query;

  const reqQuery = { ...req.query };
  const removeFields = ["select", "sort", "page", "limit"];
  removeFields.forEach(param => delete reqQuery[param]);

  let queryStr = JSON.stringify(reqQuery);
  queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

  query = FacultyMember.find(JSON.parse(queryStr));

  if (req.query.select) {
    const fields = req.query.select.split(",").join(" ");
    query = query.select(fields);
  }

  if (req.query.sort) {
    const sortBy = req.query.sort.split(",").join(" ");
    query = query.sort(sortBy);
  } else {
    query = query.sort("-created_at");
  }

  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 25;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total = await FacultyMember.countDocuments();

  query = query.skip(startIndex).limit(limit);

  // Only populate department now
  query = query.populate({
    path: "department_id",
    select: "name",
  });

  const facultyMembers = await query;

  const pagination = {};
  if (endIndex < total) pagination.next = { page: page + 1, limit };
  if (startIndex > 0) pagination.prev = { page: page - 1, limit };

  res.status(200).json(
    apiResponse.success("Faculty members retrieved successfully", {
      count: facultyMembers.length,
      pagination,
      facultyMembers,
    })
  );
});

// @desc    Get single faculty member
// @route   GET /api/faculty-members/:id
// @access  Public
const getFacultyMember = asyncHandler(async (req, res) => {
  if (!validateMongoDBId(req.params.id)) {
    return res.status(400).json(apiResponse.error("Invalid faculty member ID", 400));
  }

  const facultyMember = await FacultyMember.findById(req.params.id).populate("department_id", "name");

  if (!facultyMember) {
    return res.status(404).json(apiResponse.error(`Faculty member not found with id of ${req.params.id}`, 404));
  }

  res.status(200).json(apiResponse.success("Faculty member retrieved successfully", { facultyMember }));
});

// @desc    Create new faculty member
// @route   POST /api/faculty-members
// @access  Private/Admin
const createFacultyMember = asyncHandler(async (req, res) => {
  const { name, position, department_id, contact_info, profile } = req.body;

  if (!validateMongoDBId(department_id)) {
    return res.status(400).json(apiResponse.error("Invalid department ID", 400));
  }

  const department = await Department.findById(department_id);
  if (!department) {
    return res.status(404).json(apiResponse.error("Department not found", 404));
  }

  const facultyMember = await FacultyMember.create({
    name,
    position,
    department_id,
    contact_info,
    profile,
  });

  res.status(201).json(apiResponse.success("Faculty member created successfully", { facultyMember }, 201));
});

// @desc    Update faculty member
// @route   PUT /api/faculty-members/:id
// @access  Private/Admin
const updateFacultyMember = asyncHandler(async (req, res) => {
  const { name, position, department_id, contact_info, profile } = req.body;

  if (!validateMongoDBId(req.params.id)) {
    return res.status(400).json(apiResponse.error("Invalid faculty member ID", 400));
  }

  if (department_id && !validateMongoDBId(department_id)) {
    return res.status(400).json(apiResponse.error("Invalid department ID", 400));
  }

  if (department_id) {
    const department = await Department.findById(department_id);
    if (!department) {
      return res.status(404).json(apiResponse.error("Department not found", 404));
    }
  }

  let facultyMember = await FacultyMember.findById(req.params.id);
  if (!facultyMember) {
    return res.status(404).json(apiResponse.error("Faculty member not found", 404));
  }

  const updateData = {};
  if (name) updateData.name = name;
  if (position) updateData.position = position;
  if (department_id) updateData.department_id = department_id;
  if (contact_info) updateData.contact_info = contact_info;
  if (profile) updateData.profile = profile;

  facultyMember = await FacultyMember.findByIdAndUpdate(req.params.id, updateData, {
    new: true,
    runValidators: true,
  }).populate("department_id", "name");

  res.status(200).json(apiResponse.success("Faculty member updated successfully", { facultyMember }));
});

// @desc    Delete faculty member
// @route   DELETE /api/faculty-members/:id
// @access  Private/Admin
const deleteFacultyMember = asyncHandler(async (req, res) => {
  if (!validateMongoDBId(req.params.id)) {
    return res.status(400).json(apiResponse.error("Invalid faculty member ID", 400));
  }

  const facultyMember = await FacultyMember.findById(req.params.id);
  if (!facultyMember) {
    return res.status(404).json(apiResponse.error("Faculty member not found", 404));
  }

  await facultyMember.remove();

  res.status(200).json(apiResponse.success("Faculty member deleted successfully", {}));
});

// @desc    Get faculty member count
// @route   GET /api/faculty-members/count
// @access  Public
const getFacultyMemberCount = asyncHandler(async (req, res) => {
  try {
    const count = await FacultyMember.countDocuments();
    res.status(200).json(count);
  } catch (error) {
    res.status(500).json(apiResponse.error("Failed to retrieve count", error));
  }
});

module.exports = {
  getFacultyMembers,
  getFacultyMember,
  createFacultyMember,
  updateFacultyMember,
  deleteFacultyMember,
  getFacultyMemberCount,
};
