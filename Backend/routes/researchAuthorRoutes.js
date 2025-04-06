// routes/researchAuthorRoutes.js

const express = require("express");
const {
  getResearchAuthors,
  getResearchAuthor,
  createResearchAuthor,
  updateResearchAuthor,
  deleteResearchAuthor,
  getAuthorsByResearch,
  getResearchByAuthor,
  addMultipleAuthors,
} = require("../controllers/researchAuthorController");
const { authMiddleware } = require("../middleware/authMiddleware");
const { authorize } = require("../middleware/roleCheck");
const roles = require("../config/roles");

const router = express.Router();

// Public routes
router.get("/research/:researchId", getAuthorsByResearch);
router.get("/author/:authorId", getResearchByAuthor);

// Protected routes
router.use(authMiddleware);

// Admin routes
router.use(authorize(roles.ADMIN));

router.route("/")
  .get(getResearchAuthors)
  .post(createResearchAuthor);

router.route("/:id")
  .get(getResearchAuthor)
  .put(updateResearchAuthor)
  .delete(deleteResearchAuthor);

router.post("/bulk", addMultipleAuthors);

module.exports = router;