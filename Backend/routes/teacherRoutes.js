const express = require("express");
const teacherController = require("../controllers/teacherController.js");
const { authMiddleware, authorize } = require("../middleware/authMiddleware");;
const roles = require("../config/roles");

const router = express.Router();

// Public routes
router.get("/", teacherController.getTeachers);
router.get("/:id", teacherController.getTeacher);
router.use(authMiddleware);

// Protected routes

router.post("/", authorize(roles.ADMIN),
teacherController.uploadTeacherPhoto,
teacherController.resizeTeacherPhoto,
teacherController.createTeacher
);

router.patch("/:id", authorize(roles.ADMIN),
teacherController.updateTeacher,
teacherController.resizeTeacherPhoto,
teacherController.updateTeacher
);
router.delete("/:id", authorize(roles.ADMIN), teacherController.deleteTeacher);


module.exports = router

