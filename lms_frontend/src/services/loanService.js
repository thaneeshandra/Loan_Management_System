import api from './api';

// Fetch all loans (admin only) - Use correct admin endpoint
export const fetchAdminLoans = async (params = {}) => {
  try {
    const response = await api.get('/admin/loans', {  // ✅ Admin endpoint
      params: {
        status: params.status || undefined,
        page: params.page || 0,
        size: params.size || 10,
        sort: params.sort || 'createdAt,desc'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching admin loans:', error);
    throw error;
  }
};

// Fetch all loans (regular endpoint) - Keep existing
export const fetchLoans = async (params = {}) => {
  try {
    const response = await api.get('/loans', {
      params: {
        loanType: params.loanType || undefined,
        status: params.status || undefined,
        page: params.page || 0,
        size: params.size || 10,
        sort: params.sort || 'createdAt,desc'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching loans:', error);
    throw error;
  }
};

// Fetch loans for the current user
export const fetchUserLoans = async () => {
  try {
    const response = await api.get('/loans/history', {
      params: {
        size: 1000 // Get all loans for stats calculation
      }
    });
    return response.data.content;
  } catch (error) {
    console.error('Error fetching user loans:', error);
    throw error;
  }
};

// Fetch paginated user loans
export const fetchUserLoansPaginated = async (page = 0, size = 10) => {
  try {
    const response = await api.get('/loans/history', {
      params: {
        page,
        size,
        sort: 'createdAt,desc'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching paginated user loans:', error);
    throw error;
  }
};

// Fetch loan statistics for dashboard - NEW
export const fetchUserLoanStats = async () => {
  try {
    const response = await api.get('/loans/stats');
    return response.data;
  } catch (error) {
    console.error('Error fetching user loan stats:', error);
    throw error;
  }
};

// Update a loan's status
export const updateLoanStatus = async (id, status) => {
  try {
    const response = await api.put(`/loans/${id}/status`, null, {
      params: { status }
    });
    return response.data;
  } catch (error) {
    console.error(`Error updating loan status for id ${id}:`, error);
    throw error;
  }
};

// Apply for a new loan
export const applyLoan = async (loanData) => {
  try {
    const response = await api.post('/loans', loanData);
    return response.data;
  } catch (error) {
    console.error('Error applying for loan:', error);
    throw error;
  }
};

// Get loan by id
export const getLoanById = async (id) => {
  try {
    const response = await api.get(`/loans/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching loan with id ${id}:`, error);
    throw error;
  }
};

// ✅ Admin function for updating loan status
export const updateAdminLoanStatus = async (id, status) => {
  try {
    const response = await api.put(`/admin/loans/${id}/status`, null, {
      params: { status }
    });
    return response.data;
  } catch (error) {
    console.error(`Error updating admin loan status for id ${id}:`, error);
    throw error;
  }
};

export const getAdminLoanById = async (id) => {
  try {
    const response = await api.get(`/admin/loans/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching admin loan with id ${id}:`, error);
    throw error;
  }
};