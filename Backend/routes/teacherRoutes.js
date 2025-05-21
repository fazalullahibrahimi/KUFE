const express = require("express");
const teacherController = require("../controllers/teacherController");
const { authMiddleware, authorize } = require("../middleware/authMiddleware");
const roles = require("../config/roles");

const router = express.Router();

// Public routes
router.get("/count",teacherController.getTeacherCount);
router.get("/top-teachers",teacherController.getTopTeachers);
router.get("/", teacherController.getTeachers);
router.get("/:id", teacherController.getTeacher);


// Apply authentication for protected routes
router.use(authMiddleware);

// Protected routes (Admin only)
router.post(
  "/",
  authorize(roles.ADMIN),
  teacherController.uploadTeacherPhoto,
  teacherController.resizeTeacherPhoto,
  teacherController.createTeacher
);

router.patch(
  "/:id",
  authorize(roles.ADMIN),
  teacherController.uploadTeacherPhoto,
  teacherController.resizeTeacherPhoto,
  teacherController.updateTeacher
);

router.delete(
  "/:id",
  authorize(roles.ADMIN),
  teacherController.deleteTeacher
);

module.exports = router;
