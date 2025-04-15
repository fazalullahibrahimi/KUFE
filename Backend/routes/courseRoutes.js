const express = require("express")
const { getCourses, getCourse, createCourse, updateCourse, deleteCourse, uploadCoursePhoto,
  resizeCoursePhoto } = require("../controllers/courseController")
const { authMiddleware } = require("../middleware/authMiddleware")
const { authorize, checkPermission } = require("../middleware/roleCheck")
const { courseValidationRules, validate } = require("../utils/validators")
const roles = require("../config/roles")

const router = express.Router()

// Public routes
router.get("/", getCourses)

router.get("/:id", getCourse)

// Protected routes
router.use(authMiddleware)

// Admin and faculty can create/update/delete courses
router.post(
  "/",
  authorize(roles.ADMIN, roles.FACULTY),
  checkPermission("manage_courses"),
  courseValidationRules(),
  validate,
  uploadCoursePhoto,
  resizeCoursePhoto,
  createCourse,
)

router.put("/:id", authorize(roles.ADMIN, roles.FACULTY), checkPermission("manage_courses"), updateCourse)

router.delete("/:id", authorize(roles.ADMIN), deleteCourse)

module.exports = router

