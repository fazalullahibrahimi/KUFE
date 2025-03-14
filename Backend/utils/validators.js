const { body, param, validationResult } = require("express-validator")

// User validation rules
const userValidationRules = () => {
  return [
    body("username").notEmpty().withMessage("Username is required"),
    body("email").isEmail().withMessage("Please include a valid email"),
    body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters long"),
    body("role").isIn(["student", "faculty", "admin"]).withMessage("Role must be student, faculty, or admin"),
  ]
}

// Faculty validation rules
const facultyValidationRules = () => {
  return [
    body("name").notEmpty().withMessage("Faculty name is required"),
    body("overview").notEmpty().withMessage("Overview is required"),
  ]
}

// Department validation rules
const departmentValidationRules = () => {
  return [
    body("name").notEmpty().withMessage("Department name is required"),
    body("description").notEmpty().withMessage("Description is required"),
  ]
}

// Course validation rules
const courseValidationRules = () => {
  return [
    body("code").notEmpty().withMessage("Course code is required"),
    body("name").notEmpty().withMessage("Course name is required"),
    body("credits").isNumeric().withMessage("Credits must be a number"),
    body("department_id").isMongoId().withMessage("Valid department ID is required"),
  ]
}

// Validate request
const validate = (req, res, next) => {
  const errors = validationResult(req)
  if (errors.isEmpty()) {
    return next()
  }

  const extractedErrors = []
  errors.array().map((err) => extractedErrors.push({ [err.param]: err.msg }))

  return res.status(422).json({
    status: "error",
    message: "Validation failed",
    errors: extractedErrors,
  })
}

module.exports = {
  userValidationRules,
  facultyValidationRules,
  departmentValidationRules,
  courseValidationRules,
  validate,
}

