const express = require("express")
const facultyMemberController= require("../controllers/facultyMemberController")

const { authorize } = require("../middleware/roleCheck")
const roles = require("../config/roles")

const router = express.Router()

// Public routes
router.get("/", facultyMemberController.getFacultyMembers)
router.get("/:id", facultyMemberController.getFacultyMember)

// Protected routes

router.use(authorize(roles.ADMIN))

router.post("/", facultyMemberController.createFacultyMember)
router.route("/:id")
.patch(facultyMemberController.updateFacultyMember)
.delete(facultyMemberController.deleteFacultyMember)

module.exports = router

