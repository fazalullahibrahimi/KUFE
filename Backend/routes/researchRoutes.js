const express = require("express")
const {
  getPublishedResearch,
  getAllResearch,
  getSingleResearch,
  createResearch,
  updateResearch,
  deleteResearch,
  getResearchByStatus,
  reviewResearch,
  getResearchByStudent,
  getResearchByDepartment,
  searchResearch,
  researchUpload,
  updateResearchReview,
  uploadFile,
  processUploadedFile
} = require("../controllers/researchController")
const { authMiddleware } = require("../middleware/authMiddleware")
const { authorize, checkPermission,requireRoles } = require("../middleware/roleCheck")
const roles = require("../config/roles")



const router = express.Router()

// Public routes
router.get("/published", getPublishedResearch)
router.get("/search", searchResearch)
router.get("/:id", getSingleResearch)
router.get("/",getAllResearch)
// Protected routes
router.use(authMiddleware)

// Status filters (admin and faculty)
router.get("/status/:status", authorize([roles.ADMIN, roles.TEACHER]), getResearchByStatus)

// Student and department filters (admin and faculty)
router.get("/student/:student_id", authorize([roles.ADMIN, roles.TEACHER]), getResearchByStudent)
router.get("/department/:department_id", authorize([roles.ADMIN, roles.TEACHER]), getResearchByDepartment)

// Create research (students with submit_research permission)
router.post("/",requireRoles([roles.ADMIN]), createResearch)
router.post("/uploadResearch" ,requireRoles([roles.STUDENT]),uploadFile,processUploadedFile,researchUpload);
router.patch("/:id/review", requireRoles([roles.COMMITTEE]), updateResearchReview )
// Review research (faculty with manage_research permission)
// router.patch( "/:id/review",requireRoles([roles.COMMITTEE]),reviewResearch)

// Update research (admin or original author)
router.patch("/:id",processUploadedFile, updateResearch)

// Delete research (admin only)
router.delete("/:id", authorize(roles.ADMIN), deleteResearch)

module.exports = router