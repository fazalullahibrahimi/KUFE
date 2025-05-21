const express = require("express")
const {
  getResources,
  getResource,
  createResource,
  updateResource,
  deleteResource,
} = require("../controllers/resourceController")
const { authMiddleware } = require("../middleware/authMiddleware")
const { authorize, checkPermission } = require("../middleware/roleCheck")
const upload = require("../middleware/upload")
const roles = require("../config/roles")

const router = express.Router()

// Protected routes
router.use(authMiddleware)

// All users can view resources
router.get("/", getResources)
router.get("/:id", getResource)

// Faculty can create resources
router.post(
  "/",
  authorize(roles.ADMIN, roles.FACULTY),
  checkPermission("manage_resources"),
  upload.single("resource_file"),
  createResource,
)

// Resource owners can update their resources
router.put("/:id", upload.single("resource_file"), updateResource)

// Admin can delete resources
router.delete("/:id", authorize(roles.ADMIN), deleteResource)

module.exports = router

