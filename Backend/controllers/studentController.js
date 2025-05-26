const Student = require("../models/Student");
const Department = require("../models/Department");
const Subject = require("../models/subject");
const Semester = require("../models/Semester");
const apiResponse = require("../utils/apiResponse");
const asyncHandler = require("../middleware/asyncHandler");

const Email = require("../utils/email");


const multer = require("multer");
const sharp = require("sharp");
const path = require("path");
const fs = require("fs");



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
const uploasStudentPhoto = upload.single("image");
// @desc    Get all students
// @route   GET /api/students
// @access  Private/Admin/Faculty
const getStudents = asyncHandler(async (req, res) => {
  let query;

  const reqQuery = { ...req.query };
  const removeFields = ["select", "sort", "page", "limit"];
  removeFields.forEach(param => delete reqQuery[param]);

  let queryStr = JSON.stringify(reqQuery);
  queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

  query = Student.find(JSON.parse(queryStr));

  if (req.query.select) {
    const fields = req.query.select.split(",").join(" ");
    query = query.select(fields);
  }

  if (req.query.sort) {
    const sortBy = req.query.sort.split(",").join(" ");
    query = query.sort(sortBy);
  } else {
    query = query.sort("-createdAt");
  }

  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 25;
  const startIndex = (page - 1) * limit;
  const total = await Student.countDocuments();

  query = query.skip(startIndex).limit(limit);

  query = query.populate("department_id", "name");

  const students = await query;

  const pagination = {};
  if ((page * limit) < total) pagination.next = { page: page + 1, limit };
  if (startIndex > 0) pagination.prev = { page: page - 1, limit };

  res.status(200).json(apiResponse.success("Students retrieved successfully", {
    count: students.length,
    pagination,
    students,
  }));
});

// @desc    Get single student
// @route   GET /api/students/:id
// @access  Private/Admin/Faculty
const getStudent = asyncHandler(async (req, res) => {
  const student = await Student.findById(req.params.id)
    .populate("department_id", "name");

  if (!student) {
    return res.status(404).json(apiResponse.error(`Student not found with id of ${req.params.id}`, 404));
  }

  res.status(200).json(apiResponse.success("Student retrieved successfully", { student }));
});

// @desc    Create new student
// @route   POST /api/students
// @access  Private/Admin
const createStudent = asyncHandler(async (req, res) => {
  const {
    name,
    department_id,
    student_id_number,
    enrollment_year,
    date_of_birth,
    gender,
    email,
    phone,
    address,
    status,
  } = req.body;

  // Check if department exists
  const department = await Department.findById(department_id);
  if (!department) {
    return res.status(404).json(apiResponse.error("Department not found", 404));
  }

  // Check if student ID number is unique


  // Create student with or without image
  const student = await Student.create({
    name,
    department_id,
    student_id_number,
    enrollment_year,
    date_of_birth,
    gender,
    email,
    phone,
    address,
    status,
    profile_image: req.file ? req.file.filename : undefined,
  });

  res
    .status(201)
    .json(apiResponse.success("Student created successfully", { student }, 201));
});


// @desc    Update student
// @route   PUT /api/students/:id
// @access  Private/Admin
const updateStudent = asyncHandler(async (req, res) => {
  const {
    name,
    department_id,
    enrollment_year,
    date_of_birth,
    gender,
    email,
    phone,
    address,
    status,
  } = req.body;

  // Check if department_id is provided and valid
  if (department_id) {
    const department = await Department.findById(department_id);
    if (!department) {
      return res.status(404).json(apiResponse.error("Department not found", 404));
    }
  }

  // Check if student exists
  let student = await Student.findById(req.params.id);
  if (!student) {
    return res.status(404).json(apiResponse.error(`Student not found with id of ${req.params.id}`, 404));
  }

  // Prepare update data
  const updateData = {
    name,
    department_id,
    enrollment_year,
    date_of_birth,
    gender,
    email,
    phone,
    address,
    status,
  };

  // If a new profile image is uploaded, update it
  if (req.file) {
    updateData.profile_image = req.file.filename;
  }

  // Update student document
  student = await Student.findByIdAndUpdate(req.params.id, updateData, {
    new: true,
    runValidators: true,
  }).populate("department_id", "name");

  res.status(200).json(apiResponse.success("Student updated successfully", { student }));
});


// @desc    Delete student
// @route   DELETE /api/students/:id
// @access  Private/Admin
const deleteStudent = asyncHandler(async (req, res) => {
  const student = await Student.findById(req.params.id);
  if (!student) {
    return res.status(404).json(apiResponse.error(`Student not found with id of ${req.params.id}`, 404));
  }

  await student.deleteOne();

  res.status(200).json(apiResponse.success("Student deleted successfully", {}));
});

const resizeStudentPhoto = asyncHandler(async (req, res, next) => {
  if (!req.file) return next();

  const dir = path.join(__dirname, '.././public/img/students');
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



// Get total number of students
const getStudentCount = async (req, res) => {
  try {
    const count = await Student.countDocuments();
    res.status(200).json(count);
  } catch (error) {
    res.status(500).json({ message: "Failed to get student count", error });
  }
};

// @desc    Get student count by department
// @route   GET /api/students/count-by-department
// @access  Public
const getStudentCountByDepartment = asyncHandler(async (req, res) => {
  try {
    const departmentCounts = await Student.aggregate([
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

    res.status(200).json(
      apiResponse.success("Student count by department retrieved successfully", {
        data: departmentCounts,
        total: departmentCounts.reduce((sum, dept) => sum + dept.count, 0)
      })
    );
  } catch (error) {
    console.error("Error getting student count by department:", error);
    res.status(500).json(
      apiResponse.error("Failed to get student count by department", 500)
    );
  }
});

// @desc    Get student count by enrollment year
// @route   GET /api/students/count-by-year
// @access  Public
const getStudentCountByYear = asyncHandler(async (req, res) => {
  try {
    const yearCounts = await Student.aggregate([
      {
        $group: {
          _id: "$enrollment_year",
          count: { $sum: 1 }
        }
      },
      {
        $project: {
          _id: 0,
          year: "$_id",
          count: 1
        }
      },
      {
        $sort: { year: -1 }
      }
    ]);

    res.status(200).json(
      apiResponse.success("Student count by year retrieved successfully", {
        data: yearCounts,
        total: yearCounts.reduce((sum, year) => sum + year.count, 0)
      })
    );
  } catch (error) {
    console.error("Error getting student count by year:", error);
    res.status(500).json(
      apiResponse.error("Failed to get student count by year", 500)
    );
  }
});

// @desc    Get student count by city
// @route   GET /api/students/count-by-city
// @access  Public
const getStudentCountByCity = asyncHandler(async (req, res) => {
  try {
    const cityCounts = await Student.aggregate([
      {
        $match: {
          "address.city": { $exists: true, $ne: null, $ne: "" }
        }
      },
      {
        $group: {
          _id: "$address.city",
          count: { $sum: 1 }
        }
      },
      {
        $project: {
          _id: 0,
          city: "$_id",
          count: 1
        }
      },
      {
        $sort: { count: -1 }
      }
    ]);

    res.status(200).json(
      apiResponse.success("Student count by city retrieved successfully", {
        data: cityCounts,
        total: cityCounts.reduce((sum, city) => sum + city.count, 0)
      })
    );
  } catch (error) {
    console.error("Error getting student count by city:", error);
    res.status(500).json(
      apiResponse.error("Failed to get student count by city", 500)
    );
  }
});




// const createMarks = asyncHandler(async (req, res) => {
//   const { subject_id, semester_id, teacher_id, midterm, final, assignment, grade, remarks } = req.body;

//   const studentId = req.params.id;
//   const student = await Student.findById(studentId);

//   if (!student) {
//     return res.status(404).json(apiResponse.error("Student not found", 404));
//   }

//   const total = (midterm || 0) + (final || 0) + (assignment || 0);

//   const newMark = {
//     subject_id,
//     semester_id,
//     teacher_id, // 🆕 include teacher_id
//     midterm,
//     final,
//     assignment,
//     total,
//     grade,
//     remarks,
//   };

//   student.marks.push(newMark);
//   await student.save();

//   res.status(201).json(apiResponse.success("Marks added successfully", { marks: student.marks }));
// });


const createMarks = asyncHandler(async (req, res) => {
  const { subject_id, semester_id, teacher_id, midterm, final, assignment, grade, remarks } = req.body;

  const studentId = req.params.id;
  const student = await Student.findById(studentId);

  if (!student) {
    return res.status(404).json(apiResponse.error("Student not found", 404));
  }

  const total = (midterm || 0) + (final || 0) + (assignment || 0);

  const newMark = {
    subject_id,
    semester_id,
    teacher_id,
    midterm,
    final,
    assignment,
    total,
    grade,
    remarks,
  };

  student.marks.push(newMark);
  await student.save();

  // 🔍 Fetch subject and semester names
  const subject = await Subject.findById(subject_id);
  const semester = await Semester.findById(semester_id);

  // 📧 Send email to student
  try {
    const email = new Email(student, ""); // No link needed
    const content = `
      <div style="font-family: Arial, sans-serif;">
        <h2 style="color: #2c3e50;">Marks Notification</h2>
        <p>Dear ${student.name || "Student"},</p>
        <p>Your marks for the subject <strong>${subject?.name || "Unknown Subject"}</strong>
        in <strong>${semester?.name || "Unknown Semester"}</strong> have been recorded successfully.</p>

        <table style="border-collapse: collapse; width: 100%; margin-top: 10px;">
          <tr style="background-color: #f2f2f2;">
            <th style="padding: 8px; border: 1px solid #ddd;">Midterm</th>
            <th style="padding: 8px; border: 1px solid #ddd;">Final</th>
            <th style="padding: 8px; border: 1px solid #ddd;">Assignment</th>
            <th style="padding: 8px; border: 1px solid #ddd;">Total</th>
            <th style="padding: 8px; border: 1px solid #ddd;">Grade</th>
            <th style="padding: 8px; border: 1px solid #ddd;">Remarks</th>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #ddd;">${midterm}</td>
            <td style="padding: 8px; border: 1px solid #ddd;">${final}</td>
            <td style="padding: 8px; border: 1px solid #ddd;">${assignment}</td>
            <td style="padding: 8px; border: 1px solid #ddd;">${total}</td>
            <td style="padding: 8px; border: 1px solid #ddd;">${grade}</td>
            <td style="padding: 8px; border: 1px solid #ddd;">${remarks || "None"}</td>
          </tr>
        </table>

        <p style="margin-top: 20px;">If you have any questions, please contact your teacher or department office.</p>
        <p>Best regards,<br>Kandahar University Faculty of Economic</p>
      </div>
    `;

    await email.send("marksAdded", "Your Marks Have Been Added", content);
  } catch (err) {
    console.error("Failed to send marks email:", err.message);
  }

  res.status(201).json(apiResponse.success("Marks added successfully", { marks: student.marks }));
});




const updateMarks = asyncHandler(async (req, res) => {
  const student = await Student.findById(req.params.studentId);
  if (!student) {
    return res.status(404).json(apiResponse.error("Student not found", 404));
  }

  const index = parseInt(req.params.markIndex);
  if (isNaN(index) || index < 0 || index >= student.marks.length) {
    return res.status(404).json(apiResponse.error("Mark entry not found", 404));
  }

  const mark = student.marks[index];

  mark.subject_id = req.body.subject_id || mark.subject_id;
  mark.semester_id = req.body.semester_id || mark.semester_id;
  mark.teacher_id = req.body.teacher_id || mark.teacher_id; // 🆕 update teacher
  mark.midterm = req.body.midterm ?? mark.midterm;
  mark.final = req.body.final ?? mark.final;
  mark.assignment = req.body.assignment ?? mark.assignment;
  mark.grade = req.body.grade || mark.grade;
  mark.remarks = req.body.remarks || mark.remarks;
  mark.total = (mark.midterm || 0) + (mark.final || 0) + (mark.assignment || 0);

  await student.save();

  res.status(200).json(apiResponse.success("Marks updated successfully", { marks: student.marks }));
});







const getMarksById = asyncHandler(async (req, res) => {
  const student = await Student.findById(req.params.studentId)
    .populate("marks.subject_id", "name")
    .populate("marks.semester_id", "name")
    .populate("marks.teacher_id", "name"); // 🆕 populate teacher

  if (!student) {
    return res.status(404).json(apiResponse.error("Student not found", 404));
  }

  const index = parseInt(req.params.markIndex);
  if (isNaN(index) || index < 0 || index >= student.marks.length) {
    return res.status(404).json(apiResponse.error("Mark entry not found", 404));
  }

  const mark = student.marks[index];

  res.status(200).json(apiResponse.success("Mark retrieved successfully", { mark }));
});



const deleteMarks = asyncHandler(async (req, res) => {
  const student = await Student.findById(req.params.studentId);
  if (!student) {
    return res.status(404).json(apiResponse.error("Student not found", 404));
  }

  const index = parseInt(req.params.markIndex);
  if (isNaN(index) || index < 0 || index >= student.marks.length) {
    return res.status(404).json(apiResponse.error("Mark entry not found", 404));
  }

  student.marks.splice(index, 1);
  await student.save();

  res.status(200).json(apiResponse.success("Mark deleted successfully", { marks: student.marks }));
});

const getTopStudents = asyncHandler(async (req, res) => {
  const topStudents = await Student.aggregate([
    { $unwind: "$marks" },
    {
      $match: {
        "marks.total": { $gte: 90 }
      }
    },
    {
      $group: {
        _id: "$_id",
        name: { $first: "$name" },
        student_id_number: { $first: "$student_id_number" },
        email: { $first: "$email" },
        phone: { $first: "$phone" },
        profile_image: { $first: "$profile_image" },
        totalHighMarks: { $sum: "$marks.total" }
      }
    },
    { $sort: { totalHighMarks: -1 } },
    { $limit: 3 }
  ]);

  if (!topStudents || topStudents.length === 0) {
    return res
      .status(404)
      .json(apiResponse.error("No top students found with marks ≥ 90", 404));
  }

  res
    .status(200)
    .json(apiResponse.success("Top students retrieved successfully", topStudents));
});

// @desc    Get complete academic record by student ID number (Simple Test Version)
// @route   GET /api/students/academic-record/:studentIdNumber
// @access  Private/Admin/Faculty/Student
const getCompleteAcademicRecord = asyncHandler(async (req, res) => {
  const { studentIdNumber } = req.params;

  console.log(`=== DEBUG: Academic Record Request ===`);
  console.log(`Requested Student ID: "${studentIdNumber}"`);
  console.log(`Student ID Type: ${typeof studentIdNumber}`);
  console.log(`Student ID Length: ${studentIdNumber.length}`);

  // Let's also check all students in the database to see what IDs exist
  const allStudents = await Student.find({}, 'student_id_number name').limit(10);
  console.log(`All students in database:`, allStudents.map(s => ({ id: s.student_id_number, name: s.name })));

  // Find student by student_id_number (first without populate to check if student exists)
  let student = await Student.findOne({ student_id_number: studentIdNumber });

  if (!student) {
    console.log(`Student not found with exact ID: "${studentIdNumber}"`);

    // Let's try a case-insensitive search
    student = await Student.findOne({
      student_id_number: { $regex: new RegExp(`^${studentIdNumber}$`, 'i') }
    });

    if (student) {
      console.log(`Found student with case-insensitive search: ${student.name}`);
    } else {
      console.log(`Student not found even with case-insensitive search`);
      return res.status(404).json(
        apiResponse.error(`Student not found with ID number: ${studentIdNumber}`, 404)
      );
    }
  }

  console.log(`Student found: ${student.name}`);

  // For now, let's just return a simple response to test if the student is found
  res.status(200).json(
    apiResponse.success("Student found successfully", {
      student: {
        _id: student._id,
        name: student.name,
        student_id_number: student.student_id_number,
        email: student.email,
        phone: student.phone,
        department: student.department_id,
        enrollment_year: student.enrollment_year,
        status: student.status,
        profile_image: student.profile_image,
        marks: student.marks
      },
      academicSummary: {
        totalCredits: 0,
        completedSubjects: student.marks ? student.marks.length : 0,
        overallCGPA: 0,
        academicStatus: "Test Mode"
      },
      semesterRecords: {},
      lastUpdated: student.updatedAt
    })
  );
});

module.exports = {
  getStudents,
  getStudent,
  getStudentCount,
  createStudent,
  updateStudent,
  deleteStudent,
  createMarks,
  updateMarks,
  getMarksById,
  deleteMarks,
  uploasStudentPhoto,
  resizeStudentPhoto,
  getTopStudents,
  getStudentCountByDepartment,
  getStudentCountByYear,
  getStudentCountByCity,
  getCompleteAcademicRecord,
};

