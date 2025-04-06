const mongoose = require('mongoose');

/**
 * Validates if the provided id is a valid MongoDB ObjectId
 * @param {string|ObjectId} id - The id to validate
 * @returns {boolean} - True if valid, false otherwise
 */
const validateMongoDBId = (id) => {
  // Check if id is undefined or null
  if (!id) return false;
  
  try {
    // Handle string conversion if needed
    const idString = id.toString();
    
    // Check if it's a valid ObjectId format
    return mongoose.Types.ObjectId.isValid(idString);
  } catch (error) {
    // If any error occurs during validation, return false
    return false;
  }
};

module.exports = validateMongoDBId;