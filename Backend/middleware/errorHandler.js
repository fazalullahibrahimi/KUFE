const apiResponse = require("../utils/apiResponse")

/**
 * Global error handler middleware
 * @param {Error} err - Error object
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @param {NextFunction} next - Express next function
 */
exports.errorHandler = (err, req, res, next) => {
  let error = { ...err }
  error.message = err.message

  // Log error for development
  console.error(`Error: ${err.message}`)
  if (process.env.NODE_ENV === "development") {
    console.error(err.stack)
  }

  // Mongoose bad ObjectId
  if (err.name === "CastError") {
    const message = `Resource not found with id of ${err.value}`
    error = new Error(message)
    error.statusCode = 404
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0]
    const message = `Duplicate field value entered: ${field}. Please use another value`
    error = new Error(message)
    error.statusCode = 400
  }

  // Mongoose validation error
  if (err.name === "ValidationError") {
    const message = Object.values(err.errors)
      .map((val) => val.message)
      .join(", ")
    error = new Error(message)
    error.statusCode = 400
  }

  // JWT errors
  if (err.name === "JsonWebTokenError") {
    const message = "Invalid token. Please log in again."
    error = new Error(message)
    error.statusCode = 401
  }

  if (err.name === "TokenExpiredError") {
    const message = "Your token has expired. Please log in again."
    error = new Error(message)
    error.statusCode = 401
  }

  // Multer file upload errors
  if (err.code === "LIMIT_FILE_SIZE") {
    const message = "File too large. Maximum size is 10MB"
    error = new Error(message)
    error.statusCode = 400
  }

  if (err.code === "LIMIT_UNEXPECTED_FILE") {
    const message = "Unexpected field for file upload"
    error = new Error(message)
    error.statusCode = 400
  }

  // Default to 500 server error
  const statusCode = error.statusCode || 500
  const message = error.message || "Server Error"

  // Send response
  res.status(statusCode).json(apiResponse.error(message, statusCode))
}

/**
 * Async handler to avoid try-catch blocks in controllers
 * @param {Function} fn - Async function to handle
 * @returns {Function} - Express middleware function
 */
exports.asyncHandler = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

