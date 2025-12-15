import api from './api';

// Admin function to fetch all users
export const fetchUsers = async (page = 0, size = 10, sort = 'name', direction = 'asc', filters = {}) => {
  try {
    const params = {
      page,
      size,
      sort: `${sort},${direction}`,
      ...(filters.search && { search: filters.search }),
      ...(filters.role && { role: filters.role }),
    };

    // Try admin endpoint first for manage users functionality
    try {
      const response = await api.get('/admin/users', { params });
      return response;
    } catch (adminError) {
      // Fallback to regular users endpoint
      if (adminError.response?.status === 404 || adminError.response?.status === 401) {
        const response = await api.get('/users', { params });
        return response;
      }
      throw adminError;
    }
  } catch (error) {
    console.error('Failed to fetch users:', error);
    throw error;
  }
};

export const getUserProfile = async () => {
  const response = await api.get('/users/me');
  return response.data;
};

export const updateUserProfile = async (userData) => {
  const response = await api.put('/users/me', userData);
  return response.data;
};

// Admin function to update any user
export const updateUser = async (userId, userData) => {
  try {
    const response = await api.put(`/admin/users/${userId}`, userData);
    return response.data;
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
};

// Admin function to delete a user
export const deleteUser = async (userId) => {
  try {
    const response = await api.delete(`/admin/users/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error;
  }
};
