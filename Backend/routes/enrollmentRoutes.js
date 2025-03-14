const express = require("express")
const {
  getEnrollments,
  getEnrollment,
  createEnrollment,
  updateEnrollment,
  deleteEnrollment,
} = require("../controllers/enrollmentController")
const { protect } = require("../middleware/auth")
const { authorize, checkPermission } = require("../middleware/roleCheck")
const roles = require("../config/roles")

const router = express.Router()

// All enrollment routes are protected
router.use(protect)

// Students can view their own enrollments
router.get("/my-enrollments", getEnrollments)

// Faculty can view all enrollments
router.get("/", authorize(roles.ADMIN, roles.FACULTY), checkPermission("view_students"), getEnrollments)

router.get("/:id", authorize(roles.ADMIN, roles.FACULTY, roles.STUDENT), getEnrollment)

// Students can enroll in courses
router.post("/", authorize(roles.STUDENT), checkPermission("enroll_courses"), createEnrollment)

// Faculty can update grades
router.put("/:id", authorize(roles.ADMIN, roles.FACULTY), checkPermission("manage_courses"), updateEnrollment)

// Admin can delete enrollments
router.delete("/:id", authorize(roles.ADMIN), deleteEnrollment)

module.exports = router

