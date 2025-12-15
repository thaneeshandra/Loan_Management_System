import React, { useState, useEffect } from 'react';
import { FiFile, FiDownload, FiEye, FiCheck, FiX } from 'react-icons/fi';
import { downloadDocument, viewDocument, getAdminDocumentsForLoan, approveDocument, rejectDocument } from '../../services/documentService';
import { useNotification } from '../../context/NotificationContext'; // ✅ Use context, not hook

const AdminDocumentViewer = ({ loanId, isOpen, onClose }) => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { success, error: showError } = useNotification();
  
  useEffect(() => {
    if (loanId && isOpen) {
      fetchDocuments();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loanId, isOpen]);
  
  const fetchDocuments = async () => {
    try {
      setLoading(true);
      // Use admin endpoint to get documents for a loan
      const data = await getAdminDocumentsForLoan(loanId, 0, 50);
      setDocuments(data.content || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching documents:', err);
      setError('Failed to load documents');
      showError('Failed to load documents');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (documentId) => {
    try {
      await approveDocument(documentId);
      success('Document approved successfully');
      // Update local state
      setDocuments(prevDocs => 
        prevDocs.map(doc => 
          doc.id === documentId ? { ...doc, status: 'APPROVED' } : doc
        )
      );
    } catch (err) {
      console.error('Error approving document:', err);
      showError('Failed to approve document');
    }
  };

  const handleReject = async (documentId) => {
    try {
      const reason = prompt('Please provide a reason for rejection:');
      if (!reason) return;
      
      await rejectDocument(documentId, reason );
      success('Document rejected successfully');
      // Update local state
      setDocuments(prevDocs => 
        prevDocs.map(doc => 
          doc.id === documentId ? { ...doc, status: 'REJECTED' } : doc
        )
      );
    } catch (err) {
      console.error('Error rejecting document:', err);
      showError('Failed to reject document');
    }
  };

  const handleDownload = async (documentId, fileName) => {
    try {
      await downloadDocument(documentId, fileName);
      success('Document downloaded successfully');
    } catch (err) {
          console.error('Error downloading document:', err);
      showError('Failed to download document');
    }
  };

  const handleView = async (documentId) => {
    try {
      await viewDocument(documentId);
    } catch (err) {
          console.error('Error viewing document:', err);
      showError('Failed to view document');
    }
  };

  const getStatusBadge = (status) => {
    const statusLower = status?.toLowerCase() || 'pending';
    const statusClasses = {
      approved: 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900 dark:text-green-300 dark:border-green-700',
      rejected: 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900 dark:text-red-300 dark:border-red-700',
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900 dark:text-yellow-300 dark:border-yellow-700'
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${statusClasses[statusLower]}`}>
        {status || 'Pending'}
      </span>
    );
  };

  const getDocumentTypeIcon = (documentType) => {
    // You can add more icons based on document types
    return <FiFile className="w-5 h-5 text-blue-500" />;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-4xl max-h-[80vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="border-b dark:border-gray-700 p-4 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Documents for Loan #{loanId}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {loading ? (
            <div className="flex justify-center items-center h-40">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
            </div>
          ) : error ? (
            <div className="text-center p-4 text-red-500">{error}</div>
          ) : documents.length === 0 ? (
            <div className="text-center p-8 text-gray-500 dark:text-gray-400">
              No documents found for this loan.
            </div>
          ) : (
            <div className="space-y-4">
              {documents.map((doc) => (
                <div 
                  key={doc.id} 
                  className="border dark:border-gray-700 rounded-lg p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-gray-50 dark:hover:bg-gray-750"
                >
                  <div className="flex items-center gap-3 flex-1">
                    {getDocumentTypeIcon(doc.documentType)}
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-medium text-gray-900 dark:text-white">
                          {doc.documentType}
                        </span>
                        {getStatusBadge(doc.status)}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        Category: {doc.documentCategory} • Uploaded: {new Date(doc.uploadDate).toLocaleDateString()}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleView(doc.id)}
                      className="p-2 text-blue-600 hover:bg-blue-100 rounded dark:text-blue-400 dark:hover:bg-blue-900/30"
                      title="View Document"
                    >
                      <FiEye className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDownload(doc.id, doc.fileName)}
                      className="p-2 text-green-600 hover:bg-green-100 rounded dark:text-green-400 dark:hover:bg-green-900/30"
                      title="Download Document"
                    >
                      <FiDownload className="w-5 h-5" />
                    </button>
                    
                    {doc.status === 'PENDING' && (
                      <>
                        <button
                          onClick={() => handleApprove(doc.id)}
                          className="p-2 text-green-600 hover:bg-green-100 rounded dark:text-green-400 dark:hover:bg-green-900/30"
                          title="Approve Document"
                        >
                          <FiCheck className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleReject(doc.id)}
                          className="p-2 text-red-600 hover:bg-red-100 rounded dark:text-red-400 dark:hover:bg-red-900/30"
                          title="Reject Document"
                        >
                          <FiX className="w-5 h-5" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t dark:border-gray-700 p-4 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-lg"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDocumentViewer;
