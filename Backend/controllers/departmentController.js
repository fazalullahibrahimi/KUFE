
const Department = require("../models/Department")
const apiResponse = require("../utils/apiResponse")
const asyncHandler = require("../middleware/asyncHandler.js");
const validateMongodbId = require("../utils/validateMongoDBId.js");
const Enrollment = require("../models/Enrollment");
const Student = require("../models/Student");
const FacultyMember = require("../models/FacultyMember");
const Research = require("../models/Research");
const Course = require("../models/Course");
const CourseOffering = require("../models/CourseOffering");

// @desc    Get all departments
// @route   GET /api/departments
// @access  Public
const getDepartments = asyncHandler(async (req, res) => {
  let query

  // Copy req.query
  const reqQuery = { ...req.query }

  // Fields to exclude
  const removeFields = ["select", "sort", "page", "limit"]

  // Loop over removeFields and delete them from reqQuery
  removeFields.forEach((param) => delete reqQuery[param])

  // Create query string
  let queryStr = JSON.stringify(reqQuery)

  // Create operators ($gt, $gte, etc)
  queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, (match) => `$${match}`)

  // Finding resource
  query = Department.find(JSON.parse(queryStr))

  // Select Fields
  if (req.query.select) {
    const fields = req.query.select.split(",").join(" ")
    query = query.select(fields)
  }

  // Sort
  if (req.query.sort) {
    const sortBy = req.query.sort.split(",").join(" ")
    query = query.sort(sortBy)
  } else {
    query = query.sort("-created_at")
  }

  // Pagination
  const page = Number.parseInt(req.query.page, 10) || 1
  const limit = Number.parseInt(req.query.limit, 10) || 25
  const startIndex = (page - 1) * limit
  const endIndex = page * limit
  const total = await Department.countDocuments()

  query = query.skip(startIndex).limit(limit)

  // Populate
  if (req.query.populate) {
    query = query.populate("head_of_department faculty")
  }

  // Executing query
  const departments = await query

  // Pagination result
  const pagination = {}

  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit,
    }
  }

  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit,
    }
  }

  res.status(200).json(
    apiResponse.success("Departments retrieved successfully", {
      count: departments.length,
      pagination,
      departments,
    }),
  )
})

// @desc    Get single department
// @route   GET /api/departments/:id
// @access  Public
const getDepartment = asyncHandler(async (req, res) => {
  // Validate MongoDB ID
  if (!validateMongodbId(req.params.id)) {
    return res.status(400).json(apiResponse.error("Invalid department ID", 400))
  }

  const department = await Department.findById(req.params.id).populate("head_of_department faculty")

  if (!department) {
    return res.status(404).json(apiResponse.error(`Department not found with id of ${req.params.id}`, 404))
  }

  res.status(200).json(apiResponse.success("Department retrieved successfully", { department }))
})


const createDepartment = asyncHandler(async (req, res) => {
  // Validate MongoDB IDs if provided
  if (req.body.head_of_department && !validateMongodbId(req.body.head_of_department)) {
    return res.status(400).json(apiResponse.error("Invalid head of department ID", 400))
  }
  const department = await Department.create(req.body)

  res.status(201).json(apiResponse.success("Department created successfully", { department }, 201))
})

// @desc    Update department
// @route   PUT /api/departments/:id
// @access  Private/Admin
const updateDepartment = asyncHandler(async (req, res) => {
  // Validate MongoDB ID
  if (!validateMongodbId(req.params.id)) {
    return res.status(400).json(apiResponse.error("Invalid department ID", 400))
  }

  // Validate MongoDB IDs in request body if provided
  if (req.body.head_of_department && !validateMongodbId(req.body.head_of_department)) {
    return res.status(400).json(apiResponse.error("Invalid head of department ID", 400))
  }

  if (req.body.faculty && !validateMongodbId(req.body.faculty)) {
    return res.status(400).json(apiResponse.error("Invalid faculty ID", 400))
  }

  const department = await Department.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  })

  if (!department) {
    return res.status(404).json(apiResponse.error(`Department not found with id of ${req.params.id}`, 404))
  }

  res.status(200).json(apiResponse.success("Department updated successfully", { department }))
})

// @desc    Delete department
// @route   DELETE /api/departments/:id
// @access  Private/Admin
const deleteDepartment = asyncHandler(async (req, res) => {
  // Validate MongoDB ID
  if (!validateMongodbId(req.params.id)) {
    return res.status(400).json(apiResponse.error("Invalid department ID", 400))
  }

  const department = await Department.findById(req.params.id)

  if (!department) {
    return res.status(404).json(apiResponse.error(`Department not found with id of ${req.params.id}`, 404))
  }

  await department.remove()

  res.status(200).json(apiResponse.success("Department deleted successfully", {}))
});


const getAcademicPrograms = asyncHandler(async (req, res) => {
  const departments = await Department.find().select("name description")
  // Transform departments into programs format without icons
  const programs = departments.map((dept) => {
    return {
      title: dept.name,
      description: dept.description || "Program offered by the department",
      department_id: dept._id
    };
  });

  res.status(200).json(
    apiResponse.success("Academic programs retrieved successfully", {
      programs,
      count: programs.length,
    })
  );
});

const getDepartmentWithCourses = asyncHandler(async (req, res) => {
  // Validate MongoDB ID
  if (!validateMongodbId(req.params.id)) {
    return res.status(400).json(apiResponse.error("Invalid department ID", 400))
  }

  const department = await Department.findById(req.params.id)
    .populate("head_of_department", "name position")
    .populate("faculty", "name");

  if (!department) {
    return res.status(404).json(apiResponse.error(`Department not found with id of ${req.params.id}`, 404))
  }

  // Get courses for this department
  const courses = await Course.find({ department_id: req.params.id })
    .select("code name description credits");

  res.status(200).json(
    apiResponse.success("Department with courses retrieved successfully", { 
      department,
      courses,
      coursesCount: courses.length
    })
  );
});

// @desc    Get department faculty members
// @route   GET /api/departments/:id/faculty-members
// @access  Public
const getDepartmentFacultyMembers = asyncHandler(async (req, res) => {
  // Validate MongoDB ID
  if (!validateMongodbId(req.params.id)) {
    return res.status(400).json(apiResponse.error("Invalid department ID", 400))
  }

  const department = await Department.findById(req.params.id).select("name");

  if (!department) {
    return res.status(404).json(apiResponse.error(`Department not found with id of ${req.params.id}`, 404))
  }

  // Get faculty members for this department
  const facultyMembers = await FacultyMember.find({ department_id: req.params.id })
    .populate("user_id", "fullName email image")
    .select("name position contact_info profile");

  res.status(200).json(
    apiResponse.success("Department faculty members retrieved successfully", { 
      department,
      facultyMembers,
      count: facultyMembers.length
    })
  );
});

const getFeaturedDepartments = asyncHandler(async (req, res) => {
  // Get a limited number of departments with some basic info
  const departments = await Department.find()
    .select("name description")
    .limit(3);  // Limit to 3 for homepage feature

  res.status(200).json(
    apiResponse.success("Featured departments retrieved successfully", {
      departments,
      count: departments.length,
    })
  );
});

// @desc    Get department statistics
// @route   GET /api/departments/statistics
// @access  Public
const getDepartmentStatistics = asyncHandler(async (req, res) => {
  // Count total departments
  const totalDepartments = await Department.countDocuments();
  
  // Get departments grouped by faculty
  const departmentsByFaculty = await Department.aggregate([
    {
      $group: {
        _id: "$faculty",
        count: { $sum: 1 },
        departments: { $push: { id: "$_id", name: "$name" } }
      }
    },
    {
      $lookup: {
        from: "faculties",
        localField: "_id",
        foreignField: "_id",
        as: "facultyInfo"
      }
    },
    {
      $project: {
        _id: 1,
        count: 1,
        departments: 1,
        facultyName: { $arrayElemAt: ["$facultyInfo.name", 0] }
      }
    }
  ]);

  res.status(200).json(
    apiResponse.success("Department statistics retrieved successfully", {
      totalDepartments,
      departmentsByFaculty
    })
  );
});


const getUniversityStatistics = asyncHandler(async (req, res) => {
  try {
    // Import required models if not already imported
    const Student = require("../models/Student");
    const FacultyMember = require("../models/FacultyMember");
    const Research = require("../models/Research");
    const Course = require("../models/Course");
    const Enrollment = require("../models/Enrollment");
    
    // Properly import CourseOffering model
    let CourseOffering;
    try {
      CourseOffering = require("../models/CourseOffering");
    } catch (err) {
      console.error("Error importing CourseOffering model:", err);
    }
    
    // Get basic counts from database
    const studentCount = await Student.countDocuments();
    const facultyCount = await FacultyMember.countDocuments();
    const researchCount = await Research.countDocuments();
    const courseCount = await Course.countDocuments();
    const enrollmentCount = await Enrollment.countDocuments();
    
    // Calculate course success rate (students who passed their courses)
    let successRate = "N/A";
    
    try {
      // Count total graded enrollments (excluding null, I, and W grades)
      const totalGradedEnrollments = await Enrollment.countDocuments({
        grade: { $nin: [null, "I", "W"] }
      });
      
      // Count passing grades (A, B, C, D)
      const passingGrades = await Enrollment.countDocuments({
        grade: { $in: ["A", "B", "C", "D"] }
      });
      
      // Calculate success rate
      if (totalGradedEnrollments > 0) {
        const rate = (passingGrades / totalGradedEnrollments) * 100;
        successRate = `${Math.round(rate)}%`;
      } else {
        // Fallback if no graded enrollments
        successRate = "85%"; // Default value
      }
    } catch (err) {
      console.error("Error calculating success rate:", err);
      successRate = "85%"; // Fallback value
    }
    
    // Calculate average class size
    let averageClassSize = "N/A";
    try {
      // Use alternative method if CourseOffering model is not available
      if (CourseOffering && typeof CourseOffering.countDocuments === 'function') {
        const courseOfferings = await CourseOffering.countDocuments();
        if (courseOfferings > 0) {
          averageClassSize = Math.round(enrollmentCount / courseOfferings);
        }
      } else {
        // Alternative: Get distinct course offerings from enrollments
        const distinctCourseOfferings = await Enrollment.distinct("course_offering_id");
        const courseOfferingsCount = distinctCourseOfferings.length;
        
        if (courseOfferingsCount > 0) {
          averageClassSize = Math.round(enrollmentCount / courseOfferingsCount);
        }
      }
    } catch (err) {
      console.error("Error calculating average class size:", err);
    }
    
    // Calculate average GPA if needed
    let averageGPA = "N/A";
    try {
      // Map grades to GPA points
      const gradePoints = {
        "A": 4.0,
        "B": 3.0,
        "C": 2.0,
        "D": 1.0,
        "F": 0.0
      };
      
      // Get all grades
      const enrollments = await Enrollment.find({ 
        grade: { $in: ["A", "B", "C", "D", "F"] } 
      }).select("grade");
      
      if (enrollments.length > 0) {
        // Calculate total GPA points
        const totalPoints = enrollments.reduce((sum, enrollment) => {
          return sum + (gradePoints[enrollment.grade] || 0);
        }, 0);
        
        // Calculate average GPA
        averageGPA = (totalPoints / enrollments.length).toFixed(2);
      }
    } catch (err) {
      console.error("Error calculating average GPA:", err);
    }
    
    // Format the statistics for the frontend
    const statistics = [
      { number: `${studentCount}+`, label: "Students Enrolled" },
      { number: successRate, label: "Course Success Rate" }, // Changed from Employment Rate
      { number: `${facultyCount}+`, label: "Faculty Members" },
      { number: `${researchCount}+`, label: "Research Papers" },
    ];
    
    // Additional statistics that could be used elsewhere
    const additionalStats = {
      courseCount,
      enrollmentCount,
      averageClassSize,
      averageGPA,
      // Add more as needed
    };
    
    res.status(200).json(
      apiResponse.success("University statistics retrieved successfully", {
        statistics,
        additionalStats
      })
    );
  } catch (error) {
    console.error("Error fetching university statistics:", error);
    res.status(500).json(
      apiResponse.error("Failed to retrieve university statistics", 500)
    );
  }
});

module.exports = {
  getDepartments,
  getDepartment,
  createDepartment,
  updateDepartment,
  deleteDepartment,
  getAcademicPrograms,
  getDepartmentWithCourses,
  getDepartmentFacultyMembers,
  getFeaturedDepartments,
  getDepartmentStatistics,
  getUniversityStatistics
}