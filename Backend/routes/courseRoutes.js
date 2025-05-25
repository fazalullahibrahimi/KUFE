const express = require("express")
const { getCourses, getCourse, createCourse, updateCourse, deleteCourse, uploadCoursePhoto,
  resizeCoursePhoto, getCourseCount, getCoursesByDepartment, getCourseStatistics } = require("../controllers/courseController")
const { authMiddleware } = require("../middleware/authMiddleware")
const { authorize, checkPermission } = require("../middleware/roleCheck")
const roles = require("../config/roles")

const router = express.Router()

// Public routes
router.get("/", getCourses)
router.get("/count", getCourseCount)
router.get("/statistics", getCourseStatistics)
router.get("/by-department/:departmentId", getCoursesByDepartment)
router.get("/:id", getCourse)

// Protected routes
router.use(authMiddleware)

// Admin and faculty can create/update/delete courses
router.post(
  "/",
  authorize(roles.ADMIN, roles.FACULTY),
  uploadCoursePhoto,
  resizeCoursePhoto,
  createCourse,
)

router.patch("/:id", authorize(roles.ADMIN, roles.FACULTY), checkPermission("manage_courses"),
uploadCoursePhoto,
resizeCoursePhoto,
updateCourse
);

router.delete("/:id", authorize(roles.ADMIN), deleteCourse)

module.exports = router

