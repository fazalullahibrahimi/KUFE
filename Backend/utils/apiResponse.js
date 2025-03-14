/**
 * @desc    Send any success response
 *
 * @param   {string} message
 * @param   {object | array} data
 * @param   {number} statusCode
 */
exports.success = (message, data, statusCode = 200) => {
  return {
    status: "success",
    message,
    data,
  }
}

/**
 * @desc    Send any error response
 *
 * @param   {string} message
 * @param   {number} statusCode
 */
exports.error = (message, statusCode = 500) => {
  return {
    status: "error",
    message,
  }
}

/**
 * @desc    Send any validation response
 *
 * @param   {object | array} errors
 */
exports.validation = (errors) => {
  return {
    status: "error",
    message: "Validation errors",
    errors,
  }
}

