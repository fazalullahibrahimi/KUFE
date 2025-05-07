const mongoose = require('mongoose');

const subjectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  code: {
    type: String,
    required: true,
  },
  semester_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Semester',
    required: true,
  },
  credit_hours: {
    type: Number,
    required: true,
  },
  teacher_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Teacher', // Make sure this matches your actual teacher model name
    required: true,
  },
});

const Subject = mongoose.model('Subject', subjectSchema);

module.exports = Subject;
