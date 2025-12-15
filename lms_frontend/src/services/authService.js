import axiosInstance from './api';

// Login function
export const login = async (email, password) => {
  try {
    const response = await axiosInstance.post('/auth/login', { email, password }); // ✅ Remove /api
    return response.data;
  } catch (error) {
    console.error('Login error:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Login failed. Please check your credentials.');
  }
};

// Other auth functions
export const register = async (userData) => {
  const response = await axiosInstance.post('/auth/register', userData); // ✅ Remove /api
  return response.data;
};

// Add logout function
export const logout = () => {
  // Clear all auth data
  localStorage.removeItem('jwtToken');
  localStorage.removeItem('userRole');
  localStorage.removeItem('userName');
  localStorage.removeItem('userId');
};
