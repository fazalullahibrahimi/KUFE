const express = require("express");
const {
  getSemesters,
  getSemesterById,
  createSemester,
  updateSemester,
  deleteSemester
} = require("../controllers/semesterController");

const { authMiddleware, authorize } = require("../middleware/authMiddleware");
const roles = require("../config/roles");

const router = express.Router();

// Public routes
router.get("/", getSemesters);  // Should call getSemesters from semesterController
router.get("/:id", getSemesterById);  // Should call getSemester from semesterController

// Apply auth middleware for protected routes
router.use(authMiddleware);

// Protected routes (admin only)
router.post("/", authorize(roles.ADMIN), createSemester);  // Should call createSemester
router.patch("/:id", authorize(roles.ADMIN), updateSemester);  // Should call updateSemester
router.delete("/:id", authorize(roles.ADMIN), deleteSemester);  // Should call deleteSemester

module.exports = router;
