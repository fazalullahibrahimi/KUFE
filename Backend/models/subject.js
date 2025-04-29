const mongoose = require('mongoose');

const subjectSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  code: {
    type: String,
    required: true,
  },
  semester_id: {
    type: mongoose.Schema.Types.Number,
    ref: 'Semester',
    required: true,
  },
  credit_hours: {
    type: Number,
    required: true,
  },
});

const Subject = mongoose.model('Subject', subjectSchema);

module.exports = Subject;
