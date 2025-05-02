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
} = require("../controllers/researchController")
const { authMiddleware } = require("../middleware/authMiddleware")
const { authorize, checkPermission,requireRoles } = require("../middleware/roleCheck")
const roles = require("../config/roles")

// Configure multer for file uploads
const multer = require("multer")
const path = require("path")
const fs = require("fs")

// Configure multer storage for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = "public/uploads/research"

    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true })
    }

    cb(null, uploadDir)
  },
  filename: (req, file, cb) => {
    // Create unique filename with original extension
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9)
    const ext = path.extname(file.originalname)
    cb(null, file.fieldname + "-" + uniqueSuffix + ext)
  },
})

// File filter to only allow certain file types
const fileFilter = (req, file, cb) => {
  const allowedFileTypes = [".pdf", ".doc", ".docx"]
  const ext = path.extname(file.originalname).toLowerCase()

  if (allowedFileTypes.includes(ext)) {
    cb(null, true)
  } else {
    cb(new Error("Only PDF, DOC, and DOCX files are allowed!"), false)
  }
}

// Configure multer upload
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB max file size
  },
})

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
router.post("/", upload.single("file"), requireRoles([roles.ADMIN,roles.STUDENT]), createResearch)

// Review research (faculty with manage_research permission)
router.patch( "/:id/review",requireRoles([roles.COMMITTEE]),reviewResearch)

// Update research (admin or original author)
router.patch("/:id", upload.single("file"), updateResearch)

// Delete research (admin only)
router.delete("/:id", authorize(roles.ADMIN), deleteResearch)

module.exports = router
