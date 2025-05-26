const Semester = require('../models/Semester');

// Create a new semester
const createSemester = async (req, res) => {
  try {
    const { name } = req.body;
    const semester = new Semester({ name });
    await semester.save();
    res.status(201).json({ message: 'Semester created successfully!', semester });
  } catch (error) {
    res.status(500).json({ error: 'Error creating semester', details: error.message });
  }
};

// Get all semesters
const getSemesters = async (req, res) => {
  try {
    const semesters = await Semester.find();
    res.status(200).json({
      status: "success",
      message: "Semesters retrieved successfully",
      data: { semesters }
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Error fetching semesters",
      error: error.message
    });
  }
};

// Get a specific semester by ID
const getSemesterById = async (req, res) => {
  try {
    const semester = await Semester.findById(req.params.id);
    if (!semester) {
      return res.status(404).json({ error: 'Semester not found' });
    }
    res.status(200).json({ semester });
  } catch (error) {
    res.status(500).json({ error: 'Error fetching semester', details: error.message });
  }
};

// Update a semester
const updateSemester = async (req, res) => {
  try {
    const semester = await Semester.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!semester) {
      return res.status(404).json({ error: 'Semester not found' });
    }
    res.status(200).json({ message: 'Semester updated successfully', semester });
  } catch (error) {
    res.status(500).json({ error: 'Error updating semester', details: error.message });
  }
};

// Delete a semester
const deleteSemester = async (req, res) => {
  try {
    const semester = await Semester.findByIdAndDelete(req.params.id);
    if (!semester) {
      return res.status(404).json({ error: 'Semester not found' });
    }
    res.status(200).json({ message: 'Semester deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting semester', details: error.message });
  }
};

module.exports = {
  createSemester,
  getSemesters,
  getSemesterById,
  updateSemester,
  deleteSemester
};
