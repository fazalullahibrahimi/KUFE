/**
 * Helper functions for the application
 */

/**
 * Get the authentication token from local storage
 * @returns {string} The authentication token or empty string if not found
 */
export const getToken = () => {
  return localStorage.getItem("token") || "";
};

/**
 * Get the current user from local storage
 * @returns {Object|null} The current user object or null if not found
 */
export const getCurrentUser = () => {
  try {
    const userString = localStorage.getItem("user");
    if (!userString) return null;
    return JSON.parse(userString);
  } catch (error) {
    console.error("Error parsing user from localStorage:", error);
    return null;
  }
};

/**
 * Format a date string to a readable format
 * @param {string} dateString - The date string to format
 * @returns {string} The formatted date string
 */
export const formatDate = (dateString) => {
  if (!dateString) return "N/A";

  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch (error) {
    console.error("Error formatting date:", error);
    return "Invalid date";
  }
};

/**
 * Check if a string is a valid MongoDB ObjectId
 * @param {string} id - The ID to check
 * @returns {boolean} True if the ID is a valid ObjectId
 */
export const isValidObjectId = (id) => {
  return /^[0-9a-fA-F]{24}$/.test(id);
};
