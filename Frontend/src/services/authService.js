import axios from 'axios';

// Create axios instance with base configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:4400/api/v1';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token expiration
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      // Token expired, redirect to login
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }

    return Promise.reject(error);
  }
);

export const authService = {
  // Login user
  async login(credentials) {
    try {
      const response = await apiClient.post('/user/login', credentials);
      return {
        success: true,
        data: {
          user: response.data.user,
          token: response.data.user.token,
        },
      };
    } catch (error) {
      throw error;
    }
  },

  // Register user
  async register(userData) {
    try {
      const formData = new FormData();
      
      // Append all form fields
      Object.keys(userData).forEach(key => {
        if (userData[key] !== null && userData[key] !== undefined) {
          formData.append(key, userData[key]);
        }
      });

      const response = await apiClient.post('/user/register', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      throw error;
    }
  },

  // Logout user
  async logout() {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        await apiClient.post('/user/logout');
      }
    } catch (error) {
      console.error('Logout error:', error);
      // Don't throw error for logout, just log it
    }
  },

  // Verify token validity
  async verifyToken(token) {
    try {
      const response = await apiClient.get('/user/profile', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.status === 200;
    } catch (error) {
      return false;
    }
  },

  // Get current user profile
  async getCurrentUser() {
    try {
      const response = await apiClient.get('/user/profile');
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      throw error;
    }
  },

  // Update user profile
  async updateProfile(userData) {
    try {
      const formData = new FormData();
      
      Object.keys(userData).forEach(key => {
        if (userData[key] !== null && userData[key] !== undefined) {
          formData.append(key, userData[key]);
        }
      });

      const response = await apiClient.patch('/user/profile', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      throw error;
    }
  },

  // Change password
  async changePassword(passwordData) {
    try {
      const response = await apiClient.patch('/user/password', passwordData);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      throw error;
    }
  },

  // Forgot password
  async forgotPassword(email) {
    try {
      const response = await apiClient.post('/user/forgotpassword', { email });
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      throw error;
    }
  },

  // Reset password
  async resetPassword(token, password) {
    try {
      const response = await apiClient.post(`/user/resetpassword/${token}`, {
        password,
      });
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      throw error;
    }
  },

  // Verify email with OTP
  async verifyEmailOTP(email, otp) {
    try {
      const response = await apiClient.post('/user/verify-email-otp', {
        email,
        otp,
      });
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      throw error;
    }
  },

  // Resend verification OTP
  async resendVerificationOTP(email) {
    try {
      const response = await apiClient.post('/user/resend-verification-otp', {
        email,
      });
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      throw error;
    }
  },

  // Verify email with token
  async verifyEmail(token) {
    try {
      const response = await apiClient.get(`/user/verify-email/${token}`);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      throw error;
    }
  },

  // Check authentication status
  isAuthenticated() {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    return !!(token && user);
  },

  // Get stored token
  getToken() {
    return localStorage.getItem('token');
  },

  // Get stored user
  getUser() {
    try {
      const userString = localStorage.getItem('user');
      return userString ? JSON.parse(userString) : null;
    } catch (error) {
      console.error('Error parsing user from localStorage:', error);
      return null;
    }
  },

  // Clear auth data
  clearAuthData() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
};

export default authService;
