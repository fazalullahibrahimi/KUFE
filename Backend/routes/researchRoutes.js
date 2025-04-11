// routes/researchRoutes.js

const express = require("express");
const {
  getResearch,
  getSingleResearch,
  createResearch,
  updateResearch,
  deleteResearch,
  getResearchByStatus
} = require("../controllers/researchController");
const { authMiddleware } = require("../middleware/authMiddleware");
const { authorize, checkPermission } = require("../middleware/roleCheck");
const upload = require("../middleware/upload");
const roles = require("../config/roles");

const router = express.Router();

// Public routes for published research
router.get("/", getResearch);
router.get("/:id", getSingleResearch);

// Protected routes
router.use(authMiddleware);

// Admin can get research by status
router.get("/status/:status", authorize(roles.ADMIN), getResearchByStatus);

// All roles can create research
router.post("/", upload.single("research_file"), checkPermission("submit_research"), createResearch);

// Authors can update their research
router.put("/:id", upload.single("research_file"), updateResearch);

// Admin can delete research
router.delete("/:id", authorize(roles.ADMIN), deleteResearch);

module.exports = router;