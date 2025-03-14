const express = require("express");
const departmentController = require("../controllers/departmentController.js");

const authorize = require("../middleware/roleCheck");
const { departmentValidationRules, validate } = require("../utils/validators");
const roles = require("../config/roles");

const router = express.Router();

// Public routes
router.get("/", departmentController.getDepartments);
router.get("/:id", departmentController.getDepartment);

// Protected routes
router.use((req, res, next) => authorize(roles.ADMIN)(req, res, next)); // Ensure authorize returns a function

router.post("/", departmentValidationRules(), validate, departmentController.createDepartment);
router.put("/:id", departmentValidationRules(), validate, departmentController.updateDepartment);
router.delete("/:id", departmentController.deleteDepartment);

module.exports = router;
