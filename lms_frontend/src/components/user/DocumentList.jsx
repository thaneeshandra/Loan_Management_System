import React, { useState, useEffect } from 'react';
import { FiFile, FiDownload, FiEye, FiCheck, FiX, FiClock } from 'react-icons/fi';
import api from '../../services/api';
import { useNotification } from '../../context/NotificationContext';

const DocumentList = ({ loanId, showAllDocuments = false, documents: propDocuments, filterStatus }) => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { success, error: notifyError } = useNotification();
  const [imageUrl, setImageUrl] = useState('');

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      let response;

      if (showAllDocuments) {
        response = await api.get('/documents/user');
      } else if (loanId) {
        response = await api.get(`/documents/user?loanId=${loanId}`);
      } else {
        response = await api.get('/documents/user');
      }

      setDocuments(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching documents:', err);
      setError('Failed to load documents');
      notifyError('Failed to load documents');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // If documents are passed as props (from ViewDocuments), use them instead of fetching
    if (propDocuments !== undefined) {
      setDocuments(propDocuments);
      setLoading(false);
      setError(null);
    } else {
      fetchDocuments();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loanId, showAllDocuments, propDocuments]);

  useEffect(() => {
    return () => {
      if (imageUrl) {
        window.URL.revokeObjectURL(imageUrl);
      }
    };
  }, [imageUrl]);

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'approved':
        return <FiCheck className="text-green-500" />;
      case 'rejected':
        return <FiX className="text-red-500" />;
      case 'pending':
      default:
        return <FiClock className="text-yellow-500" />;
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

  const handleDownload = async (documentId, fileName) => {
    try {
      const response = await api.get(`/documents/${documentId}/download`, {
        responseType: 'blob'
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
 

    success('Document downloaded successfully');
    } catch (err) {
      console.error('Error downloading document:', err);
      notifyError('Failed to download document');
    }
  };

  const handleView = async (documentId) => {
    try {
      const response = await api.get(`/documents/${documentId}/view`, {
        responseType: 'blob'
      });
      const mimeType = response.data.type || 'image/jpeg'; // fallback if not set
      const url = window.URL.createObjectURL(new Blob([response.data], { type: mimeType }));
      setImageUrl(url);
      // Do NOT revokeObjectURL until you are done displaying the image
    } catch (err) {
      console.error('Error viewing document:', err);
      notifyError('Failed to view document');
    }
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-lg shadow-md p-6">
        <div className="flex items-center justify-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-gray-600 dark:text-gray-300">Loading documents...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-lg shadow-md p-6">
        <div className="text-center text-red-600 dark:text-red-400">
          <FiX className="mx-auto mb-2" size={24} />
          <p>{error}</p>
          <button
            onClick={fetchDocuments}
            className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
          {showAllDocuments ? 'All Documents' : 'Uploaded Documents'}
          {filterStatus && filterStatus !== 'all' && (
            <span className="ml-2 px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs rounded-full">
              {filterStatus.charAt(0).toUpperCase() + filterStatus.slice(1)}
            </span>
          )}
        </h3>
        <button
          onClick={propDocuments !== undefined ? () => window.location.reload() : fetchDocuments}
          className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-sm"
        >
          Refresh
        </button>
      </div>

      {documents.length === 0 ? (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <FiFile className="mx-auto mb-2" size={24} />
          {filterStatus && filterStatus !== 'all' ? (
            <p>No documents found with status: {filterStatus}</p>
          ) : (
            <p>No documents uploaded yet</p>
          )}
          {!showAllDocuments && !filterStatus && (
            <p className="text-sm mt-1">Upload documents to support your loan application</p>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {documents.map((document) => (
            <div
              key={document.id}
              className="border dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    {getStatusIcon(document.status)}
                  </div>
                  <div className="flex-grow">
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      {document.documentCategory}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {document.documentType}
                    </p>
                    {document.fileName && (
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        File: {document.fileName}
                      </p>
                    )}
                    {document.uploadedAt && (
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Uploaded: {new Date(document.uploadedAt).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  {getStatusBadge(document.status)}

                  <div className="flex space-x-1">
                    <button
                      onClick={() => handleView(document.id)}
                      className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900 rounded"
                      title="View Document"
                    >
                      <FiEye size={16} />
                    </button>
                    <button
                      onClick={() => handleDownload(document.id, document.fileName)}
                      className="p-2 text-green-600 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900 rounded"
                      title="Download Document"
                    >
                      <FiDownload size={16} />
                    </button>
                  </div>
                </div>
              </div>

              {document.rejectionReason && (
                <div className="mt-2 p-2 bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 rounded text-sm text-red-700 dark:text-red-300">
                  <strong>Rejection Reason:</strong> {document.rejectionReason}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {imageUrl && (
        <div className="my-4">
          {imageUrl.endsWith('.pdf') ? (
            <iframe src={imageUrl} width="100%" height="600px" title="PDF Preview" />
          ) : (
            <img src={imageUrl} alt="Document Preview" className="max-w-full h-auto rounded shadow" />
          )}
          <button
            onClick={() => {
              window.URL.revokeObjectURL(imageUrl);
              setImageUrl('');
            }}
            className="mt-2 px-3 py-1 bg-red-600 text-white rounded"
          >
            Close Preview
          </button>
        </div>
      )}
    </div>
  );
};

export default DocumentList;
