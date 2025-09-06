import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API calls
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (userData) => api.put('/auth/profile', userData),
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
  resetPassword: (token, password) => api.post('/auth/reset-password', { token, password }),
};

// Items API calls
export const itemsAPI = {
  getItems: (params = {}) => api.get('/items', { params }),
  getItem: (id) => api.get(`/items/${id}`),
  createItem: (itemData) => {
    const formData = new FormData();
    Object.keys(itemData).forEach(key => {
      if (key === 'images' && Array.isArray(itemData[key])) {
        itemData[key].forEach((image, index) => {
          formData.append(`images`, image);
        });
      } else {
        formData.append(key, itemData[key]);
      }
    });
    return api.post('/items', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
  updateItem: (id, itemData) => {
    const formData = new FormData();
    Object.keys(itemData).forEach(key => {
      if (key === 'images' && Array.isArray(itemData[key])) {
        itemData[key].forEach((image, index) => {
          formData.append(`images`, image);
        });
      } else {
        formData.append(key, itemData[key]);
      }
    });
    return api.put(`/items/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
  deleteItem: (id) => api.delete(`/items/${id}`),
  searchItems: (query, filters = {}) => api.get('/items/search', { 
    params: { q: query, ...filters } 
  }),
};

// Transactions API calls
export const transactionsAPI = {
  initiateTransaction: (transactionData) => api.post('/transactions/initiate', transactionData),
  processPayment: (paymentData) => api.post('/transactions/payment', paymentData),
  getUserTransactions: (userId) => api.get(`/transactions/user/${userId}`),
  getTransaction: (id) => api.get(`/transactions/${id}`),
  updateTransactionStatus: (id, status) => api.put(`/transactions/${id}/status`, { status }),
};

// Analytics API calls
export const analyticsAPI = {
  getUserAnalytics: (userId) => api.get(`/analytics/user/${userId}`),
  getCommunityAnalytics: () => api.get('/analytics/community'),
  getLeaderboard: () => api.get('/analytics/leaderboard'),
  getEcoImpact: (userId) => api.get(`/analytics/eco-impact/${userId}`),
};

// Indian Payments API calls
export const indianPaymentsAPI = {
  initiatePayment: (paymentData) => api.post('/indian-payments/initiate', paymentData),
  processPayment: (paymentData) => api.post('/indian-payments/process', paymentData),
  getGSTRates: () => api.get('/indian-payments/gst/rates'),
  getQuickDonationAmounts: () => api.get('/indian-payments/donation/amounts'),
};

// Utility functions
export const handleApiError = (error) => {
  if (error.response) {
    // Server responded with error status
    return {
      message: error.response.data?.message || 'An error occurred',
      status: error.response.status,
      data: error.response.data
    };
  } else if (error.request) {
    // Request was made but no response received
    return {
      message: 'Network error. Please check your connection.',
      status: 0,
      data: null
    };
  } else {
    // Something else happened
    return {
      message: error.message || 'An unexpected error occurred',
      status: 0,
      data: null
    };
  }
};

export default api;
