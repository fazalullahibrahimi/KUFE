const express = require("express");
const {
  getStudents,
  getStudent,
  createStudent,
  updateStudent,
  deleteStudent,
  createMarks,
  updateMarks,
  getMarksById,
  deleteMarks,
  uploasStudentPhoto,
  resizeStudentPhoto,
  getStudentCount,
  getTopStudents,
} = require("../controllers/studentController");

const { authMiddleware, authorize } = require("../middleware/authMiddleware");
const roles = require("../config/roles");

const router = express.Router();

// Public routes
router.get("/onestudent", getStudent);
router.get("/studentcount", getStudentCount);
router.get("/top-students", getTopStudents);
router.get("/", getStudents);

// Apply auth middleware for protected routes
router.use(authMiddleware);

// Student CRUD (admin only)
router.post(
  "/",
  authorize(roles.ADMIN),
  uploasStudentPhoto,
  resizeStudentPhoto,
  createStudent
);

router.patch(
  "/:id",
  authorize(roles.ADMIN),
  uploasStudentPhoto,
  resizeStudentPhoto,
  updateStudent
);

router.delete("/:id", authorize(roles.ADMIN), deleteStudent);

// Student Marks routes (admin only)
router.post("/:id/marks", authorize(roles.ADMIN), createMarks);
router.patch("/:id/marks", authorize(roles.ADMIN), updateMarks);
router.get("/:id/marks", authorize(roles.ADMIN), getMarksById);
router.delete("/:id/marks", authorize(roles.ADMIN), deleteMarks);

module.exports = router;
