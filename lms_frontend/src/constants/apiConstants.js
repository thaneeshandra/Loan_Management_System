// API Base Configuration
export const API_CONFIG = {
  BASE_URL: process.env.REACT_APP_API_URL || "http://localhost:8081/api",
  TIMEOUT: 10000,
  RETRY_ATTEMPTS: 3
};

// Authentication Endpoints
export const AUTH_ENDPOINTS = {
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  FORGOT_PASSWORD: '/auth/forgot-password',
  REFRESH_TOKEN: '/auth/refresh',
  LOGOUT: '/auth/logout'
};

// User Endpoints
export const USER_ENDPOINTS = {
  ME: '/users/me',
  PROFILE: '/users/profile',
  STATS: '/admin/users/stats',
  LIST: '/users',
  BY_ID: (id) => `/users/${id}`,
  UPDATE_STATUS: (id) => `/users/${id}/status`
};

// Loan Endpoints
export const LOAN_ENDPOINTS = {
  // User loan endpoints
  MY_LOANS: '/loans/my-loans',
  APPLY: '/loans',
  BY_ID: (id) => `/loans/${id}`,
  DETAILS: (id) => `/loans/${id}/details`,
  
  // Admin loan endpoints
  ALL_LOANS: '/loans',
  UPDATE_STATUS: (id) => `/loans/${id}/status`,
  STATS: '/loans/stats',
  
  // Dashboard endpoints
  USER_LOANS_PAGINATED: '/loans/user',
  ADMIN_LOANS_PAGINATED: '/admin/loans'
};

// Document Endpoints
export const DOCUMENT_ENDPOINTS = {
  UPLOAD: '/documents/upload',
  LIST: '/documents',
  BY_ID: (id) => `/documents/${id}`,
  DELETE: (id) => `/documents/${id}`,
  DOWNLOAD: (id) => `/documents/${id}/download`
};

// Transaction Endpoints
export const TRANSACTION_ENDPOINTS = {
  LIST: '/transactions',
  BY_LOAN_ID: '/transactions',
  CREATE: '/transactions',
  BY_ID: (id) => `/transactions/${id}`
};

// Notification Endpoints
export const NOTIFICATION_ENDPOINTS = {
  LIST: '/notifications',
  MARK_READ: (id) => `/notifications/${id}/read`,
  MARK_ALL_READ: '/notifications/mark-all-read'
};

// Dashboard Endpoints
export const DASHBOARD_ENDPOINTS = {
  USER_STATS: '/dashboard/stats',
  ADMIN_STATS: '/admin/dashboard/stats',
  USER_ACTIVITIES: '/dashboard/activities',
  ADMIN_ACTIVITIES: '/admin/dashboard/activities'
};

// Settings Endpoints
export const SETTINGS_ENDPOINTS = {
  GET: '/settings',
  UPDATE: '/settings',
  SYSTEM: '/admin/settings'
};

// Utility function to build endpoint with query parameters
export const buildEndpoint = (baseEndpoint, params = {}) => {
  const url = new URL(baseEndpoint, API_CONFIG.BASE_URL);
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      url.searchParams.append(key, value);
    }
  });
  return url.pathname + url.search;
};