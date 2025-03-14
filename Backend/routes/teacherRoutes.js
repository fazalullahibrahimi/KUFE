const express = require("express")
const teacherController = require("../controllers/teacherController.js")
const { authorize } = require("../middleware/roleCheck")
const roles = require("../config/roles")

const router = express.Router()

// Public routes
router.get("/", teacherController.getTeachers)
router.get("/:id", teacherController.getTeacher)

// Protected routes
router.use(authorize(roles.ADMIN))

router.post("/", teacherController.createTeacher);
router.route("/:id")
.patch(teacherController.updateTeacher)
.delete(teacherController.deleteTeacher)


module.exports = router

