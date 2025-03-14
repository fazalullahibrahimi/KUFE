const express = require("express");
const facultyController = require("../controllers/facultyController.js");
const { authMiddlewarey } = require("../middleware/authMiddleware");
const { authorize } = require("../middleware/roleCheck");
const { facultyValidationRules, validate } = require("../utils/validators");
const roles = require("../config/roles");

const router = express.Router();
// Public routes
router.get("/", facultyController.getFaculties);
router.get("/:id", facultyController.getFaculty);

// Protected routes
router.use(authMiddlewarey);
router.use(authorize(roles.ADMIN));

router.post("/", facultyValidationRules(), validate, facultyController.createFaculty);
router.route("/:id")
.patch(facultyController.updateFaculty)
.delete(facultyController.deleteFaculty);


module.exports = router;
