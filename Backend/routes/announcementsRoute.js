const express = require("express")
const {
  getAnnouncements,
  getAnnouncement,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
  getFeaturedAnnouncements,
} = require("../controllers/announcementController")

const router = express.Router()

// Import the authentication middleware
const {
  authMiddleware,
  authorizeAdmin,
  authorizeAdminOrFaculty,
} = require("../middleware/authMiddleware")

// Public routes
router.route("/featured").get(getFeaturedAnnouncements)
router.route("/:id").get(getAnnouncement)
router.route("/").get(getAnnouncements)

// Protected routes
// Create announcement - Admin or Faculty can create
router.route("/").post(authMiddleware, authorizeAdminOrFaculty, createAnnouncement)

// Update announcement - Admin or Faculty can update
router.route("/:id").put(authMiddleware, authorizeAdminOrFaculty, updateAnnouncement)

// Delete announcement - Only Admin can delete
router.route("/:id").delete(authMiddleware, authorizeAdmin, deleteAnnouncement);

module.exports = router
