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
  getStudentCountByDepartment,
  getStudentCountByYear,
  getStudentCountByCity,
} = require("../controllers/studentController");

const { authMiddleware } = require("../middleware/authMiddleware");
const { authorize, checkPermission,requireRoles } = require("../middleware/roleCheck")
const roles = require("../config/roles");

const router = express.Router();

// Public routes
router.get("/top-students", getTopStudents);
router.get("/onestudent", getStudent);
router.get("/studentcount", getStudentCount);
router.get("/count-by-department", getStudentCountByDepartment);
router.get("/count-by-year", getStudentCountByYear);
router.get("/count-by-city", getStudentCountByCity);
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
router.post("/:id/marks", requireRoles([roles.ADMIN,roles.STUDENT,roles.TEACHER]), createMarks);
router.patch("/:id/marks", requireRoles([roles.ADMIN,roles.STUDENT,roles.TEACHER]), updateMarks);
router.get("/:id/marks", requireRoles([roles.ADMIN,roles.STUDENT,roles.TEACHER]), getMarksById);
router.delete("/:id/marks", requireRoles([roles.ADMIN,roles.STUDENT,roles.TEACHER]), deleteMarks);

module.exports = router;
