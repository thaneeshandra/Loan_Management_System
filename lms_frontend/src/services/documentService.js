import api from './api';

// Upload a document
export const uploadDocument = async (formData) => {
  try {
    const response = await api.post('/documents', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error uploading document:', error);
    throw error;
  }
};

// Get documents for a loan (admin)
export const getAdminDocumentsForLoan = async (loanId, page = 0, size = 10) => {
  try {
    const response = await api.get('/admin/documents', { 
      params: { 
        loanId,
        page,
        size 
      } 
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching documents for loan:', error);
    throw error;
  }
};

// Get user documents
export const getUserDocuments = async (loanId = null) => {
  try {
    const params = loanId ? { loanId } : {};
    const response = await api.get('/documents/user', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching user documents:', error);
    throw error;
  }
};

// Download a document
export const downloadDocument = async (documentId, fileName) => {
  try {
    const response = await api.get(`/documents/${documentId}/download`, {
      responseType: 'blob'
    });
    
    // Create blob link to download
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', fileName || 'document');
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
    
    return true;
  } catch (error) {
    console.error('Error downloading document:', error);
    throw error;
  }
};

// View a document (open in new tab)
export const viewDocument = async (documentId) => {
  try {
    const response = await api.get(`/documents/${documentId}/view`, {
      responseType: 'blob'
    });
    
    // Open in new tab
    const url = window.URL.createObjectURL(new Blob([response.data]));
    window.open(url, '_blank');
    window.URL.revokeObjectURL(url);
    
    return true;
  } catch (error) {
    console.error('Error viewing document:', error);
    throw error;
  }
};

// Get all documents (admin) - New function
export const getAllAdminDocuments = async (status = null, search = null, userId = null, loanId = null, page = 0, size = 10) => {
  try {
    const params = { page, size };
    
    if (status) params.status = status;
    if (search) params.search = search;
    if (userId) params.userId = userId;
    if (loanId) params.loanId = loanId;
    
    const response = await api.get('/admin/documents', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching admin documents:', error);
    throw error;
  }
};

// Approve document (admin) - New function
export const approveDocument = async (documentId) => {
  try {
    const response = await api.put(`/admin/documents/${documentId}/approve`);
    return response.data;
  } catch (error) {
    console.error('Error approving document:', error);
    throw error;
  }
};

// Reject document (admin) - New function
export const rejectDocument = async (documentId, reason) => {
  try {
    const response = await api.put(`/admin/documents/${documentId}/reject`, null, {
      params: { reason }
    });
    return response.data;
  } catch (error) {
    console.error('Error rejecting document:', error);
    throw error;
  }
};

// Get document details by ID - New function
export const getDocumentById = async (documentId) => {
  try {
    const response = await api.get(`/documents/${documentId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching document details:', error);
    throw error;
  }
};

// Update document status (admin) - New function for bulk operations
export const updateDocumentStatus = async (documentId, status, reason = null) => {
  try {
    const endpoint = status === 'APPROVED' ? 'approve' : 'reject';
    const config = reason ? { params: { reason } } : {};
    
    const response = await api.put(`/admin/documents/${documentId}/${endpoint}`, null, config);
    return response.data;
  } catch (error) {
    console.error('Error updating document status:', error);
    throw error;
  }
};