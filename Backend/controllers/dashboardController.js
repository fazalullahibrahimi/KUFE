const Student = require("../models/Student");
const Course = require("../models/Course");
const Department = require("../models/Department");
const Teacher = require("../models/Teacher");
const Faculty = require("../models/Faculty");
const Research = require("../models/Research");
const Event = require("../models/Event");
const News = require("../models/News");
const apiResponse = require("../utils/apiResponse");
const asyncHandler = require("../middleware/asyncHandler");

// @desc    Get comprehensive dashboard overview
// @route   GET /api/dashboard/overview
// @access  Public
const getDashboardOverview = asyncHandler(async (req, res) => {
  try {
    // Get all counts in parallel for better performance
    const [
      totalStudents,
      totalCourses,
      totalTeachers,
      totalDepartments,
      totalFaculties,
      totalResearch,
      totalEvents,
      totalNews,
      activePrograms
    ] = await Promise.all([
      Student.countDocuments(),
      Course.countDocuments(),
      Teacher.countDocuments(),
      Department.countDocuments(),
      Faculty.countDocuments(),
      Research.countDocuments(), // Remove status filter to get all research
      Event.countDocuments(),
      News.countDocuments(),
      Course.countDocuments() // Use total courses as active programs for now
    ]);

    // Calculate graduation rate (mock calculation - you can implement actual logic)
    const graduationRate = 85; // This should be calculated based on actual data

    // Get recent activity counts
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth();

    const [
      newStudentsThisYear,
      newCoursesThisYear,
      newResearchThisYear,
      upcomingEvents
    ] = await Promise.all([
      Student.countDocuments({
        enrollment_year: currentYear
      }),
      Course.countDocuments({
        createdAt: {
          $gte: new Date(currentYear, 0, 1)
        }
      }),
      Research.countDocuments({
        createdAt: {
          $gte: new Date(currentYear, 0, 1)
        }
      }),
      Event.countDocuments({
        date: {
          $gte: new Date()
        }
      })
    ]);

    const overview = {
      totalStudents,
      totalCourses,
      totalTeachers,
      totalDepartments,
      totalFaculties,
      totalResearch,
      totalEvents,
      totalNews,
      activePrograms,
      graduationRate,
      recentActivity: {
        newStudentsThisYear,
        newCoursesThisYear,
        newResearchThisYear,
        upcomingEvents
      },
      lastUpdated: new Date()
    };

    res.status(200).json(
      apiResponse.success("Dashboard overview retrieved successfully", {
        overview
      })
    );
  } catch (error) {
    console.error("Error getting dashboard overview:", error);
    res.status(500).json(
      apiResponse.error("Failed to get dashboard overview", 500)
    );
  }
});

// @desc    Get course statistics and distribution
// @route   GET /api/dashboard/course-stats
// @access  Public
const getCourseStatistics = asyncHandler(async (req, res) => {
  try {
    // Course distribution by department
    const coursesByDepartment = await Course.aggregate([
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
          count: { $sum: 1 },
          totalCredits: { $sum: "$credits" }
        }
      },
      {
        $project: {
          _id: 0,
          departmentId: "$_id",
          departmentName: 1,
          count: 1,
          totalCredits: 1
        }
      },
      {
        $sort: { count: -1 }
      }
    ]);

    // Course distribution by level
    const coursesByLevel = await Course.aggregate([
      {
        $group: {
          _id: "$level",
          count: { $sum: 1 }
        }
      },
      {
        $project: {
          _id: 0,
          level: "$_id",
          count: 1
        }
      },
      {
        $sort: { count: -1 }
      }
    ]);

    // Course distribution by semester
    const coursesBySemester = await Course.aggregate([
      {
        $group: {
          _id: "$semester",
          count: { $sum: 1 }
        }
      },
      {
        $project: {
          _id: 0,
          semester: "$_id",
          count: 1
        }
      },
      {
        $sort: { semester: 1 }
      }
    ]);

    // Average credits per course
    const avgCredits = await Course.aggregate([
      {
        $group: {
          _id: null,
          averageCredits: { $avg: "$credits" },
          totalCredits: { $sum: "$credits" },
          minCredits: { $min: "$credits" },
          maxCredits: { $max: "$credits" }
        }
      }
    ]);

    res.status(200).json(
      apiResponse.success("Course statistics retrieved successfully", {
        data: {
          coursesByDepartment,
          coursesByLevel,
          coursesBySemester,
          creditStatistics: avgCredits[0] || {
            averageCredits: 0,
            totalCredits: 0,
            minCredits: 0,
            maxCredits: 0
          },
          total: coursesByDepartment.reduce((sum, dept) => sum + dept.count, 0)
        }
      })
    );
  } catch (error) {
    console.error("Error getting course statistics:", error);
    res.status(500).json(
      apiResponse.error("Failed to get course statistics", 500)
    );
  }
});

// @desc    Get teacher statistics and distribution
// @route   GET /api/dashboard/teacher-stats
// @access  Public
const getTeacherStatistics = asyncHandler(async (req, res) => {
  try {
    // Teacher distribution by department
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

    // Teacher distribution by qualification
    const teachersByQualification = await Teacher.aggregate([
      {
        $group: {
          _id: "$qualification",
          count: { $sum: 1 }
        }
      },
      {
        $project: {
          _id: 0,
          qualification: "$_id",
          count: 1
        }
      },
      {
        $sort: { count: -1 }
      }
    ]);

    // Teacher distribution by experience
    const teachersByExperience = await Teacher.aggregate([
      {
        $addFields: {
          experienceRange: {
            $switch: {
              branches: [
                { case: { $lt: ["$experience", 2] }, then: "0-2 years" },
                { case: { $lt: ["$experience", 5] }, then: "2-5 years" },
                { case: { $lt: ["$experience", 10] }, then: "5-10 years" },
                { case: { $gte: ["$experience", 10] }, then: "10+ years" }
              ],
              default: "Unknown"
            }
          }
        }
      },
      {
        $group: {
          _id: "$experienceRange",
          count: { $sum: 1 },
          avgExperience: { $avg: "$experience" }
        }
      },
      {
        $project: {
          _id: 0,
          experienceRange: "$_id",
          count: 1,
          avgExperience: { $round: ["$avgExperience", 1] }
        }
      },
      {
        $sort: { count: -1 }
      }
    ]);

    res.status(200).json(
      apiResponse.success("Teacher statistics retrieved successfully", {
        data: {
          teachersByDepartment,
          teachersByQualification,
          teachersByExperience,
          total: teachersByDepartment.reduce((sum, dept) => sum + dept.count, 0)
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

// @desc    Get research statistics and trends
// @route   GET /api/dashboard/research-stats
// @access  Public
const getResearchStatistics = asyncHandler(async (req, res) => {
  try {
    // Research distribution by department
    const researchByDepartment = await Research.aggregate([
      {
        $lookup: {
          from: "departments",
          localField: "department_id",
          foreignField: "_id",
          as: "department"
        }
      },
      {
        $unwind: {
          path: "$department",
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $group: {
          _id: "$department_id",
          departmentName: { $first: { $ifNull: ["$department.name", "Unknown Department"] } },
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

    // Research by status
    const researchByStatus = await Research.aggregate([
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

    // Research trends by year
    const researchByYear = await Research.aggregate([
      {
        $group: {
          _id: { $year: "$createdAt" },
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
      apiResponse.success("Research statistics retrieved successfully", {
        data: {
          researchByDepartment,
          researchByStatus,
          researchByYear,
          total: researchByDepartment.reduce((sum, dept) => sum + dept.count, 0)
        }
      })
    );
  } catch (error) {
    console.error("Error getting research statistics:", error);
    res.status(500).json(
      apiResponse.error("Failed to get research statistics", 500)
    );
  }
});

// @desc    Get event and news statistics
// @route   GET /api/dashboard/activity-stats
// @access  Public
const getActivityStatistics = asyncHandler(async (req, res) => {
  try {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();

    // Events statistics
    const [
      totalEvents,
      upcomingEvents,
      pastEvents,
      eventsThisMonth,
      eventsThisYear
    ] = await Promise.all([
      Event.countDocuments(),
      Event.countDocuments({ date: { $gte: currentDate } }),
      Event.countDocuments({ date: { $lt: currentDate } }),
      Event.countDocuments({
        date: {
          $gte: new Date(currentYear, currentMonth, 1),
          $lt: new Date(currentYear, currentMonth + 1, 1)
        }
      }),
      Event.countDocuments({
        date: {
          $gte: new Date(currentYear, 0, 1),
          $lt: new Date(currentYear + 1, 0, 1)
        }
      })
    ]);

    // News statistics
    const [
      totalNews,
      newsThisMonth,
      newsThisYear
    ] = await Promise.all([
      News.countDocuments(),
      News.countDocuments({
        createdAt: {
          $gte: new Date(currentYear, currentMonth, 1),
          $lt: new Date(currentYear, currentMonth + 1, 1)
        }
      }),
      News.countDocuments({
        createdAt: {
          $gte: new Date(currentYear, 0, 1),
          $lt: new Date(currentYear + 1, 0, 1)
        }
      })
    ]);

    // Events by month (last 12 months)
    const eventsByMonth = await Event.aggregate([
      {
        $match: {
          date: {
            $gte: new Date(currentYear - 1, currentMonth, 1)
          }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: "$date" },
            month: { $month: "$date" }
          },
          count: { $sum: 1 }
        }
      },
      {
        $project: {
          _id: 0,
          year: "$_id.year",
          month: "$_id.month",
          count: 1
        }
      },
      {
        $sort: { year: 1, month: 1 }
      }
    ]);

    res.status(200).json(
      apiResponse.success("Activity statistics retrieved successfully", {
        data: {
          events: {
            total: totalEvents,
            upcoming: upcomingEvents,
            past: pastEvents,
            thisMonth: eventsThisMonth,
            thisYear: eventsThisYear
          },
          news: {
            total: totalNews,
            thisMonth: newsThisMonth,
            thisYear: newsThisYear
          },
          trends: {
            eventsByMonth
          }
        }
      })
    );
  } catch (error) {
    console.error("Error getting activity statistics:", error);
    res.status(500).json(
      apiResponse.error("Failed to get activity statistics", 500)
    );
  }
});

// @desc    Get recent activities for dashboard
// @route   GET /api/dashboard/recent-activities
// @access  Public
const getRecentActivities = asyncHandler(async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;

    // Get recent students
    const recentStudents = await Student.find()
      .populate('department_id', 'name')
      .sort({ createdAt: -1 })
      .limit(limit)
      .select('name email enrollment_year department_id createdAt');

    // Get recent courses
    const recentCourses = await Course.find()
      .populate('department_id', 'name')
      .sort({ createdAt: -1 })
      .limit(limit)
      .select('name code department_id instructor createdAt');

    // Get recent research
    const recentResearch = await Research.find()
      .populate('department_id', 'name')
      .sort({ createdAt: -1 })
      .limit(limit)
      .select('title status department_id createdAt');

    // Get upcoming events
    const upcomingEvents = await Event.find({ date: { $gte: new Date() } })
      .sort({ date: 1 })
      .limit(limit)
      .select('title date location description');

    // Get recent news
    const recentNews = await News.find()
      .sort({ createdAt: -1 })
      .limit(limit)
      .select('title content createdAt');

    res.status(200).json(
      apiResponse.success("Recent activities retrieved successfully", {
        data: {
          recentStudents,
          recentCourses,
          recentResearch,
          upcomingEvents,
          recentNews
        }
      })
    );
  } catch (error) {
    console.error("Error getting recent activities:", error);
    res.status(500).json(
      apiResponse.error("Failed to get recent activities", 500)
    );
  }
});

module.exports = {
  getDashboardOverview,
  getCourseStatistics,
  getTeacherStatistics,
  getResearchStatistics,
  getActivityStatistics,
  getRecentActivities
};
