const Subject = require('../models/subject');

// Create a new subject
const createSubject = async (req, res) => {
  try {
    const { name, code, semester_id, credit_hours, teacher_id } = req.body;

    if (!teacher_id) {
      return res.status(400).json({ error: 'Teacher ID is required' });
    }

    const subject = new Subject({ name, code, semester_id, credit_hours, teacher_id });
    await subject.save();
    res.status(201).json({ message: 'Subject created successfully!', subject });
  } catch (error) {
    res.status(500).json({ error: 'Error creating subject', details: error.message });
  }
};

// Get all subjects
const getSubjects = async (req, res) => {
  try {
    const subjects = await Subject.find()
      .populate('semester_id')
      .populate({
        path: 'teacher_id',
        select: '_id name'  // select only the teacher's _id and name
      });

    res.status(200).json({
      status: "success",
      message: "Subjects retrieved successfully",
      data: { subjects }
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Error fetching subjects",
      error: error.message
    });
  }
};


// Get a specific subject by ID
const getSubjectById = async (req, res) => {
  try {
    const subject = await Subject.findById(req.params.id)
    .populate('semester_id')
    .populate({
      path: 'teacher_id',
      select: '_id name'  // select only the teacher's _id and name
    });

    if (!subject) {
      return res.status(404).json({ error: 'Subject not found' });
    }
    res.status(200).json({ subject });
  } catch (error) {
    res.status(500).json({ error: 'Error fetching subject', details: error.message });
  }
};

// Update a subject
const updateSubject = async (req, res) => {
  try {
    const subject = await Subject.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!subject) {
      return res.status(404).json({ error: 'Subject not found' });
    }
    res.status(200).json({ message: 'Subject updated successfully', subject });
  } catch (error) {
    res.status(500).json({ error: 'Error updating subject', details: error.message });
  }
};

// Delete a subject
const deleteSubject = async (req, res) => {
  try {
    const subject = await Subject.findByIdAndDelete(req.params.id);
    if (!subject) {
      return res.status(404).json({ error: 'Subject not found' });
    }
    res.status(200).json({ message: 'Subject deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting subject', details: error.message });
  }
};

module.exports = {
  createSubject,
  getSubjects,
  getSubjectById,
  updateSubject,
  deleteSubject
};
