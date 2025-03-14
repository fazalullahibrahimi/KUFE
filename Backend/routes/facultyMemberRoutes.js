const express = require("express")
const {
  getFacultyMembers,
  getFacultyMember,
  createFacultyMember,
  updateFacultyMember,
  deleteFacultyMember,
} = require("../controllers/facultyMemberController")
const { authMiddleware } = require("../middleware/authMiddleware")
const { authorize } = require("../middleware/roleCheck")
const roles = require("../config/roles")

const router = express.Router()

// Public routes
router.get("/", getFacultyMembers)
router.get("/:id", getFacultyMember)

// Protected routes
router.use(authMiddleware)
router.use(authorize(roles.ADMIN))

router.post("/", createFacultyMember)
router.put("/:id", updateFacultyMember)
router.delete("/:id", deleteFacultyMember)

module.exports = router

