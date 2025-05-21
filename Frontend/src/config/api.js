/**
 * API configuration file
 * 
 * This file centralizes API URL configuration to make it easier to change
 * the backend URL in one place instead of throughout the codebase.
 */

// Get the API URL from environment variables or use the default
const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:4400/api/v1';

export default API_URL;
