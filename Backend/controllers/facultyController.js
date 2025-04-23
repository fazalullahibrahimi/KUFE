const Faculty = require("../models/Faculty")
const apiResponse = require("../utils/apiResponse")
const asyncHandler = require("../middleware/asyncHandler")
const validateMongodbId = require("../utils/validateMongoDBId")

// @desc    Get all faculties
// @route   GET /api/faculty
// @access  Public
const getFaculties = asyncHandler(async (req, res) => {
  const faculties = await Faculty.find()

  res.status(200).json(apiResponse.success("Faculties retrieved successfully", 
    { faculties, count: faculties.length }))
})

const getFacultiesCount = asyncHandler(async (req, res) => {
  const faculties = await Faculty.find()
  res.status(200).json(apiResponse.success("Faculties retrieved successfully", { count: faculties.length }
  ))
})
// @desc    Get single faculty
// @route   GET /api/faculty/:id
// @access  Public
const getFaculty = asyncHandler(async (req, res) => {
  // Validate MongoDB ID
  if (!validateMongodbId(req.params.id)) {
    return res.status(400).json(apiResponse.error("Invalid faculty ID", 400))
  }

  const faculty = await Faculty.findById(req.params.id)

  if (!faculty) {
    return res.status(404).json(apiResponse.error(`Faculty not found with id of ${req.params.id}`, 404))
  }

  res.status(200).json(apiResponse.success("Faculty retrieved successfully", { faculty }));
});

// @desc    Create new faculty
// @route   POST /api/faculty
// @access  Private/Admin
const createFaculty = asyncHandler(async (req, res) => {
  const faculty = await Faculty.create(req.body)
  res.status(201).json(apiResponse.success("Faculty created successfully", { faculty }, 201));
});

// @desc    Update faculty
// @route   PUT /api/faculty/:id
// @access  Private/Admin
const updateFaculty = asyncHandler(async (req, res) => {
  // Validate MongoDB ID
  if (!validateMongodbId(req.params.id)) {
    return res.status(400).json(apiResponse.error("Invalid faculty ID", 400))
  }

  const faculty = await Faculty.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  })

  if (!faculty) {
    return res.status(404).json(apiResponse.error(`Faculty not found with id of ${req.params.id}`, 404))
  }

  res.status(200).json(apiResponse.success("Faculty updated successfully", { faculty }))
})


const deleteFaculty = asyncHandler(async (req, res) => {
  // Validate MongoDB ID
  if (!validateMongodbId(req.params.id)) {
    return res.status(400).json(apiResponse.error("Invalid faculty ID", 400));
  }

  const faculty = await Faculty.findById(req.params.id);

  if (!faculty) {
    return res.status(404).json(apiResponse.error(`Faculty not found with id of ${req.params.id}`, 404));
  }

  await faculty.deleteOne(); // Use deleteOne instead of remove

  res.status(200).json(apiResponse.success("Faculty deleted successfully", {}));
});


module.exports = {
  getFaculties,
  getFaculty,
  createFaculty,
  updateFaculty,
  deleteFaculty,
  getFacultiesCount
}

