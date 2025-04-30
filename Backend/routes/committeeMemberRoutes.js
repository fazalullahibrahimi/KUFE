// routes/committeeMemberRoutes.js

const express = require("express");
const committeeMemberController = require("../controllers/committeeMemberController");
const { authMiddleware, authorize } = require("../middleware/authMiddleware");
const roles = require("../config/roles");

const router = express.Router();

// Public routes
router.get("/", committeeMemberController.getAllCommitteeMembers);
router.get("/:id", committeeMemberController.getCommitteeMemberById);

// Apply authentication for protected routes
router.use(authMiddleware);

// Protected routes (Admin only)
router.post(
  "/",
  authorize(roles.ADMIN),
  committeeMemberController.createCommitteeMember
);

router.patch(
  "/:id",
  authorize(roles.ADMIN),
  committeeMemberController.updateCommitteeMember
);

router.delete(
  "/:id",
  authorize(roles.ADMIN),
  committeeMemberController.deleteCommitteeMember
);

module.exports = router;
