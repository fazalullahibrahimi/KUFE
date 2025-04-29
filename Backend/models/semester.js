const mongoose = require('mongoose');

const semesterSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
});

const Semester = mongoose.model('Semester', semesterSchema);

module.exports = Semester;
