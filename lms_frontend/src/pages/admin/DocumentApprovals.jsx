import React, { useState, useEffect } from 'react';
import { FiRefreshCw, FiSearch, FiDownload, FiEye, FiCheck, FiX } from 'react-icons/fi';
import api from '../../services/api';
import { viewDocument, downloadDocument } from '../../services/documentService';
import useNotification from '../../hooks/useNotification';

const DocumentApprovals = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const { showSuccess, showError } = useNotification();

  // Fetch pending documents for approval
  const loadPendingDocuments = async () => {
    setLoading(true);
    try {
      // Only fetch PENDING documents
      const response = await api.get('/admin/documents', {
        params: {
          status: 'PENDING',
          page: currentPage,
          size: 10,
          sort: 'uploadDate,desc',
          search: searchTerm || undefined
        }
      });
      
      setDocuments(response.data.content || []);
      setTotalPages(response.data.totalPages || 0);
      setTotalElements(response.data.totalElements || 0);
    } catch (error) {
      console.error('Failed to fetch pending documents:', error);
      showError('Failed to load pending documents');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPendingDocuments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

  // Handle document status change (approve/reject)
  const handleStatusChange = async (documentId, status) => {
    try {
      if (status === 'REJECTED') {
        const reason = prompt('Please provide a reason for rejection:');
        if (!reason) return; // Cancel if no reason provided
        
        await api.put(`/admin/documents/${documentId}/reject`, null, { params: { reason } });
      } else {
        await api.put(`/admin/documents/${documentId}/approve`);
      }
      
      showSuccess(`Document ${status.toLowerCase()} successfully`);
      
      // Remove the processed document from the list
      setDocuments(prevDocs => prevDocs.filter(doc => doc.id !== documentId));
      setTotalElements(prev => prev - 1);
    } catch (error) {
      console.error(`Error ${status.toLowerCase()}ing document:`, error);
      showError(`Failed to ${status.toLowerCase()} document`);
    }
  };

  const handleView = async (documentId) => {
    try {
      await viewDocument(documentId);
    } catch (error) {
      showError('Failed to view document');
    }
  };

  const handleDownload = async (documentId, fileName) => {
    try {
      await downloadDocument(documentId, fileName || `document-${documentId}`);
      showSuccess('Document downloaded successfully');
    } catch (error) {
      showError('Failed to download document');
    }
  };

  const handleRefresh = () => {
    setCurrentPage(0);
    setSearchTerm('');
    loadPendingDocuments();
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(0);
    loadPendingDocuments();
  };

  // Not using this currently, can be expanded later for different document types
  /* const getDocumentTypeIcon = (documentType) => {
    return <FiFileText className="text-blue-500" />;
  }; */

  if (loading && documents.length === 0) {
    return (
      <div className="p-6">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <span className="ml-4 text-gray-600">Loading pending documents...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Document Approvals
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Review and approve pending document submissions ({totalElements} pending)
          </p>
        </div>
        <button
          onClick={handleRefresh}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
        >
          <FiRefreshCw className="w-4 h-4" />
          Refresh
        </button>
      </div>

      {/* Search */}
      <div className="flex items-center gap-4">
        <form onSubmit={handleSearch} className="relative flex-1 max-w-md">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search by document type or user..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
          />
          <button
            type="submit"
            className="absolute right-2 top-1/2 transform -translate-y-1/2 px-2 py-1 bg-blue-600 text-white rounded"
          >
            Search
          </button>
        </form>
      </div>

      {/* Document Cards */}
      {documents.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-500 dark:text-gray-400">
            <FiCheck className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-medium mb-2">No Pending Documents</h3>
            <p>All documents have been processed or no documents match your search.</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {documents.map((doc) => (
            <div 
              key={doc.id} 
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-shadow"
            >
              {/* Document Header */}
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {doc.documentType}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">
                      Pending
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleView(doc.id)}
                    className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-full"
                    title="View Document"
                  >
                    <FiEye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDownload(doc.id, doc.fileName)}
                    className="p-2 text-green-600 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/30 rounded-full"
                    title="Download Document"
                  >
                    <FiDownload className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Document Details */}
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Category:</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {doc.documentCategory}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400">User:</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {doc.userName} (ID: {doc.userId})
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Loan ID:</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {doc.loanId || 'N/A'}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Uploaded:</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {new Date(doc.uploadedAt).toLocaleDateString()}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={() => handleStatusChange(doc.id, 'APPROVED')}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
                >
                  <FiCheck className="w-4 h-4" />
                  Approve
                </button>
                
                <button
                  onClick={() => handleStatusChange(doc.id, 'REJECTED')}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
                >
                  <FiX className="w-4 h-4" />
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-8">
          <div className="flex space-x-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
              disabled={currentPage === 0}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 transition"
            >
              Previous
            </button>
            <span className="px-4 py-2 text-gray-700 dark:text-gray-300">
              Page {currentPage + 1} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages - 1, prev + 1))}
              disabled={currentPage >= totalPages - 1}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 transition"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentApprovals;
