const express = require("express");
const departmentController = require("../controllers/departmentController.js");

const {authorize} = require("../middleware/roleCheck");
const { departmentValidationRules, validate } = require("../utils/validators");
const roles = require("../config/roles");
const { authMiddleware } = require("../middleware/authMiddleware.js");

const router = express.Router();

// Public routes for frontend dynamic 

router.get("/programs", departmentController.getAcademicPrograms);
router.get("/programcount", departmentController.getAcademicProgramCount);
router.get("/featured", departmentController.getFeaturedDepartments);
router.get("/statistics", departmentController.getDepartmentStatistics);
router.get("/:id/courses", departmentController.getDepartmentWithCourses);
router.get("/university-statistics", departmentController.getUniversityStatistics);
router.get("/researchPaperCount", departmentController.getResearchPaperCount);
router.get("/getdepartmentName", departmentController.getDepartmentName);
router.get("/:id", departmentController.getDepartmentDetails);
// Standard public routes
router.get("/", departmentController.getDepartments);
router.get("/:id", departmentController.getDepartment);

// Protected routes
router.use(authMiddleware);
router.use((req, res, next) => authorize(roles.ADMIN)(req, res, next)); // Ensure authorize returns a function

router.post("/", departmentValidationRules(), validate, departmentController.createDepartment);
router.patch("/:id", departmentValidationRules(), validate, departmentController.updateDepartment);
router.delete("/:id", departmentController.deleteDepartment);

module.exports = router;