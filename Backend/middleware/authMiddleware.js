const jwt = require("jsonwebtoken")
const User = require("../models/User")
const asyncHandler = require("./asyncHandler")
const apiResponse = require("../utils/apiResponse")
const validateMongodbId = require("../utils/validateMongoDBId")

// Authentication middleware
const authMiddlewarey = asyncHandler(async (req, res, next) => {
  let token

  // Get token from Authorization header
  token =
    req.headers.authorization && req.headers.authorization.startsWith("Bearer")
      ? req.headers.authorization.split(" ")[1]
      : null

  if (token) {
    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET)

      // Check if user still exists
      const currentUser = await User.findById(decoded.id)
      if (!currentUser) {
        return res.status(401).json(apiResponse.error("The user belonging to this token no longer exists!", 401))
      }

      // Check if user changed password after token was issued
      if (currentUser.changedPasswordAfter && currentUser.changedPasswordAfter(decoded.iat)) {
        return res.status(401).json(apiResponse.error("User recently changed password, please log in again!", 401))
      }

      // Add user to request object
      req.user = currentUser
      next()
    } catch (error) {
      return res.status(401).json(apiResponse.error("Not authorized, token failed.", 401))
    }
  } else {
    return res.status(401).json(apiResponse.error("Not authorized, no token.", 401))
  }
})

// Admin authorization middleware
const authorizeAdmin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next()
  } else {
    return res.status(403).json(apiResponse.error("Access denied: Admin authorization required.", 403))
  }
}

// Faculty authorization middleware
const authorizeFaculty = (req, res, next) => {
  if (req.user && req.user.role === "faculty") {
    next()
  } else {
    return res.status(403).json(apiResponse.error("Access denied: Faculty authorization required.", 403))
  }
}

// Student authorization middleware
const authorizeStudent = (req, res, next) => {
  if (req.user && req.user.role === "student") {
    next()
  } else {
    return res.status(403).json(apiResponse.error("Access denied: Student authorization required.", 403))
  }
}

// Admin or Faculty authorization middleware
const authorizeAdminOrFaculty = (req, res, next) => {
  if (req.user && (req.user.role === "admin" || req.user.role === "faculty")) {
    next()
  } else {
    return res.status(403).json(apiResponse.error("Access denied: Admin or faculty authorization required.", 403))
  }
}

// Authorize specific roles
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json(apiResponse.error("User not authenticated", 401))
    }

    if (!roles.includes(req.user.role)) {
      return res
        .status(403)
        .json(apiResponse.error(`User role ${req.user.role} is not authorized to access this route`, 403))
    }

    next()
  }
}

module.exports = {
  authMiddlewarey,
  authorizeAdmin,
  authorizeFaculty,
  authorizeStudent,
  authorizeAdminOrFaculty,
  authorize,
}

