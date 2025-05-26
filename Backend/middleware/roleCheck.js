const apiResponse = require("../utils/apiResponse")
const roles = require("../config/roles")

// Check user role
exports.authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json(apiResponse.error("User not authenticated", 401))
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res
        .status(403)
        .json(apiResponse.error(`User role ${req.user.role} is not authorized to access this route`, 403))
    }

    next()
  }
}

// Check permission
exports.checkPermission = (permission) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json(apiResponse.error("User not authenticated", 401))
    }

    const userRole = req.user.role
    const userPermissions = roles.permissions[userRole] || []

    // Admin has all permissions
    if (userRole === roles.ADMIN || userPermissions.includes("manage_all") || userPermissions.includes(permission)) {
      return next()
    }

    return res.status(403).json(apiResponse.error("You do not have permission to perform this action", 403))
  }
}

// middleware/roleCheck.js

exports.requireRoles = (rolesList) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json(apiResponse.error("User not authenticated", 401))
    }

    if (!rolesList.includes(req.user.role)) {
      return res
        .status(403)
        .json(apiResponse.error(`Only ${rolesList.join(" or ")} can perform this action`, 403))
    }

    next()
  }
}
