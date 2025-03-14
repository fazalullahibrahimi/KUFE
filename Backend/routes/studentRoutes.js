const express = require("express")
const {
  getStudents,
  getStudent,
  createStudent,
  updateStudent,
  deleteStudent,
} = require("../controllers/studentController")
const { protect } = require("../middleware/auth")
const { authorize, checkPermission } = require("../middleware/roleCheck")
const roles = require("../config/roles")

const router = express.Router()

// Protected routes
router.use(protect)

// Faculty and admin can view students
router.get("/", authorize(roles.ADMIN, roles.FACULTY), checkPermission("view_students"), getStudents)

router.get("/:id", authorize(roles.ADMIN, roles.FACULTY), checkPermission("view_students"), getStudent)

// Admin can create/update/delete students
router.post("/", authorize(roles.ADMIN), createStudent)

router.put("/:id", authorize(roles.ADMIN), updateStudent)

router.delete("/:id", authorize(roles.ADMIN), deleteStudent)

module.exports = router

