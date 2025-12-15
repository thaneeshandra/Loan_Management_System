import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import DocumentUploader from '../../components/user/DocumentUploader';
import { FiUpload, FiFileText } from 'react-icons/fi';
import api from '../../services/api';

const UploadDocuments = () => {
  const [searchParams] = useSearchParams();
  const [selectedLoanId, setSelectedLoanId] = useState(null);
  const [userLoans, setUserLoans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get loan ID from URL params if provided
    const loanId = searchParams.get('loanId');
    if (loanId) {
      setSelectedLoanId(parseInt(loanId, 10));
    }
    // Fetch user's loans for selection
    fetchUserLoans();
    // eslint-disable-next-line
  }, [searchParams]);

  const fetchUserLoans = async () => {
    try {
      setLoading(true);
      const response = await api.get('/loans/history?page=0&size=100');
      setUserLoans(response.data.content || []);
    } catch (error) {
      console.error('Error fetching user loans:', error);
      setUserLoans([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-gray-900 border dark:border-gray-700 rounded-lg shadow-md p-6">
        <div className="flex items-center space-x-3 mb-4">
          <FiUpload className="text-blue-600 dark:text-blue-400" size={24} />
          <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Upload Documents</h1>
        </div>
        <p className="text-gray-600 dark:text-gray-300">
          Upload supporting documents for your loan applications. 
          Documents help us process your application faster and more accurately.
        </p>
      </div>

      {/* Loan Selection */}
      {!selectedLoanId && userLoans.length > 0 && (
        <div className="bg-white dark:bg-gray-900 border dark:border-gray-700 rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-100">
            Select a Loan Application
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {userLoans.map((loan) => (
              <div
                key={loan.id}
                onClick={() => setSelectedLoanId(loan.id)}
                className="border dark:border-gray-700 rounded-lg p-4 cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-900 hover:border-blue-300 dark:hover:border-blue-400 transition-colors"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-gray-100">{loan.loanType}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      ₹{loan.amountRequested?.toLocaleString('en-IN')}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Applied: {new Date(loan.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    loan.status === 'APPROVED' 
                      ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300'
                      : loan.status === 'REJECTED'
                      ? 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-300'
                      : 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-300'
                  }`}>
                    {loan.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900 rounded-lg">
            <p className="text-sm text-blue-800 dark:text-blue-200">
              💡 Tip: You can upload documents for any of your loan applications, 
              even after they've been approved or are pending review.
            </p>
          </div>
        </div>
      )}

      {/* Document Upload Section */}
      {selectedLoanId && (
        <>
          <div className="bg-white dark:bg-gray-900 border dark:border-gray-700 rounded-lg shadow-md p-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                Uploading for Loan #{selectedLoanId}
              </h2>
              <button
                onClick={() => setSelectedLoanId(null)}
                className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
              >
                Change Loan
              </button>
            </div>
          </div>
          
          <DocumentUploader loanId={selectedLoanId} />
        </>
      )}

      {/* General Upload Option */}
      {!selectedLoanId && userLoans.length === 0 && !loading && (
        <div className="bg-white dark:bg-gray-900 border dark:border-gray-700 rounded-lg shadow-md p-6">
          <div className="text-center">
            <FiFileText className="mx-auto mb-4 text-gray-400 dark:text-gray-600" size={48} />
            <h2 className="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-100">
              No Loan Applications Found
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              You need to apply for a loan first before uploading documents.
            </p>
            <a
              href="/apply"
              className="inline-flex items-center px-4 py-2 bg-blue-600 dark:bg-blue-700 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
            >
              <FiUpload className="mr-2" />
              Apply for a Loan
            </a>
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="bg-white dark:bg-gray-900 border dark:border-gray-700 rounded-lg shadow-md p-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 dark:border-blue-400"></div>
            <span className="ml-2 text-gray-600 dark:text-gray-300">Loading your loan applications...</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default UploadDocuments;
