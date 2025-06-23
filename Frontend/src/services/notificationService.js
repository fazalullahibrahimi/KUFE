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
    if (error.response?.status === 401) {
      // Token expired, redirect to login
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const notificationService = {
  // Get user notifications
  async getNotifications(params = {}) {
    try {
      const { page = 1, limit = 20, unreadOnly = false } = params;
      const response = await apiClient.get('/notifications', {
        params: { page, limit, unreadOnly }
      });
      return {
        success: true,
        data: response.data.data,
      };
    } catch (error) {
      throw error;
    }
  },

  // Get notification statistics
  async getNotificationStats() {
    try {
      const response = await apiClient.get('/notifications/stats');
      return {
        success: true,
        data: response.data.data,
      };
    } catch (error) {
      throw error;
    }
  },

  // Mark notification as read
  async markAsRead(notificationId) {
    try {
      const response = await apiClient.patch(`/notifications/${notificationId}/read`);
      return {
        success: true,
        data: response.data.data,
      };
    } catch (error) {
      throw error;
    }
  },

  // Mark all notifications as read
  async markAllAsRead() {
    try {
      const response = await apiClient.patch('/notifications/mark-all-read');
      return {
        success: true,
        data: response.data.data,
      };
    } catch (error) {
      throw error;
    }
  },

  // Delete notification
  async deleteNotification(notificationId) {
    try {
      const response = await apiClient.delete(`/notifications/${notificationId}`);
      return {
        success: true,
        data: response.data.data,
      };
    } catch (error) {
      throw error;
    }
  },

  // Create notification (Admin only)
  async createNotification(notificationData) {
    try {
      const response = await apiClient.post('/notifications', notificationData);
      return {
        success: true,
        data: response.data.data,
      };
    } catch (error) {
      throw error;
    }
  },

  // Create system notification (Admin only)
  async createSystemNotification(notificationData) {
    try {
      const response = await apiClient.post('/notifications/system', notificationData);
      return {
        success: true,
        data: response.data.data,
      };
    } catch (error) {
      throw error;
    }
  },

  // Get notification icon based on type
  getNotificationIcon(type) {
    const icons = {
      system: '⚙️',
      user_registration: '👤',
      course_update: '📚',
      research_submission: '📄',
      research_review: '✅',
      marks_added: '📊',
      event_created: '📅',
      announcement: '📢',
      maintenance: '🔧',
      security: '🔒',
      general: '📝'
    };
    return icons[type] || icons.general;
  },

  // Get notification color based on priority
  getNotificationColor(priority) {
    const colors = {
      low: 'text-gray-600',
      medium: 'text-blue-600',
      high: 'text-orange-600',
      urgent: 'text-red-600'
    };
    return colors[priority] || colors.medium;
  },

  // Get notification background color based on priority
  getNotificationBgColor(priority, isRead = false) {
    if (isRead) {
      return 'bg-gray-50';
    }
    
    const colors = {
      low: 'bg-gray-50',
      medium: 'bg-blue-50',
      high: 'bg-orange-50',
      urgent: 'bg-red-50'
    };
    return colors[priority] || colors.medium;
  },

  // Format time ago
  formatTimeAgo(date) {
    const now = new Date();
    const notificationDate = new Date(date);
    const diff = now - notificationDate;
    
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    if (days < 7) return `${days} day${days > 1 ? 's' : ''} ago`;
    
    return notificationDate.toLocaleDateString();
  }
};

export default notificationService;
