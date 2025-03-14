const express = require("express")
const {
  getCourseOfferings,
  getCourseOffering,
  createCourseOffering,
  updateCourseOffering,
  deleteCourseOffering,
} = require("../controllers/courseOfferingController")
const { protect } = require("../middleware/auth")
const { authorize, checkPermission } = require("../middleware/roleCheck")
const roles = require("../config/roles")

const router = express.Router()

// Public routes
router.get("/", getCourseOfferings)
router.get("/:id", getCourseOffering)

// Protected routes
router.use(protect)

// Admin and faculty can create/update/delete course offerings
router.post("/", authorize(roles.ADMIN, roles.FACULTY), checkPermission("manage_courses"), createCourseOffering)

router.put("/:id", authorize(roles.ADMIN, roles.FACULTY), checkPermission("manage_courses"), updateCourseOffering)

router.delete("/:id", authorize(roles.ADMIN), deleteCourseOffering)

module.exports = router

