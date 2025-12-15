// src/services/api.js - IMPORTANT FIX
import axios from 'axios';

// Include /api in baseURL for consistency
const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:8081/api";

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  timeout: 10000,
});

// Attach JWT token to every request
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("jwtToken");
  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  
  // Debug logging (remove in production)
  console.log('API Request:', {
    method: config.method,
    url: config.url,
    baseURL: config.baseURL,
    fullURL: `${config.baseURL}${config.url}`,
  });
  
  return config;
}, (error) => Promise.reject(error));

// Enhanced response interceptor with smarter 401 handling
axiosInstance.interceptors.response.use(
  (response) => {
    console.log('API Response:', response.status, response.config.url);
    return response;
  },
  (error) => {
    console.error('API Error:', {
      status: error.response?.status,
      url: error.config?.url,
      data: error.response?.data,
    });
    
    if (error.response?.status === 401) {
      // Only auto-logout for auth-related endpoints or if token is actually invalid
      const isAuthEndpoint = error.config?.url?.includes('/auth/');
      const currentPath = window.location.pathname;
      
      // Don't auto-logout if we're already on login page or for non-auth endpoints
      if (!isAuthEndpoint && !currentPath.includes('/login')) {
        console.warn('🚨 401 error on non-auth endpoint:', error.config?.url);
        // Don't auto-logout, let the component handle the error
        return Promise.reject(error instanceof Error ? error : new Error(error));
      }
      
      // Only clear auth data if it's actually an auth failure
      localStorage.removeItem('jwtToken');
      localStorage.removeItem('userRole');
      localStorage.removeItem('userName');
      localStorage.removeItem('userId');
      
      // Use React Router navigation instead of window.location
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }
    
    return Promise.reject(error instanceof Error ? error : new Error(error));
  }
);

export default axiosInstance;
