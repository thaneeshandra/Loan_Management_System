// src/components/admin/LoanApprovalCard.jsx
import React, { useState } from 'react';
import { FiUser, FiDollarSign, FiCalendar, FiCheck, FiX, FiClock, FiFileText } from 'react-icons/fi';
import { updateAdminLoanStatus } from '../../services/loanService'; // ✅ Use admin service
import { useNotification } from '../../context/NotificationContext';
import AdminDocumentViewer from './AdminDocumentViewer';

const LoanApprovalCard = ({ loan, onStatusChange }) => {
  const { success, error } = useNotification();
  const [isUpdating, setIsUpdating] = useState(false);
  const [showDocuments, setShowDocuments] = useState(false);

  const handleAction = async (status) => {
    try {
      setIsUpdating(true);
      
      // ✅ Use correct status values and property names
      await updateAdminLoanStatus(loan.id, status); // Use loan.id, not loan.loan_id
      
      success(`Loan ${status.toLowerCase()} successfully!`);
      
      // ✅ Notify parent component to refresh data
      if (onStatusChange) {
        onStatusChange(loan.id, status);
      }
      
    } catch (err) {
      console.error('Error updating loan status:', err);
      error(`Failed to ${status.toLowerCase()} loan. Please try again.`);
    } finally {
      setIsUpdating(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-shadow">
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Loan Application #{loan.id}
          </h3>
          <div className="flex items-center gap-2 mt-1">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">
              <FiClock className="w-3 h-3 mr-1" />
              {loan.status}
            </span>
          </div>
        </div>
      </div>

      {/* Loan Details */}
      <div className="space-y-3 mb-6">
        <div className="flex items-center gap-2">
          <FiUser className="w-4 h-4 text-gray-500" />
          <span className="text-sm text-gray-600 dark:text-gray-400">Applicant:</span>
          <span className="text-sm font-medium text-gray-900 dark:text-white">
            {loan.userName}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <FiDollarSign className="w-4 h-4 text-gray-500" />
          <span className="text-sm text-gray-600 dark:text-gray-400">Amount:</span>
          <span className="text-sm font-medium text-gray-900 dark:text-white">
            {formatCurrency(loan.amountRequested)}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <FiCalendar className="w-4 h-4 text-gray-500" />
          <span className="text-sm text-gray-600 dark:text-gray-400">Applied on:</span>
          <span className="text-sm font-medium text-gray-900 dark:text-white">
            {formatDate(loan.createdAt)}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-4 mt-4">
          <div>
            <span className="text-sm text-gray-600 dark:text-gray-400">Loan Type:</span>
            <p className="text-sm font-medium text-gray-900 dark:text-white">
              {loan.loanType?.replace(/_/g, ' ')}
            </p>
          </div>
          <div>
            <span className="text-sm text-gray-600 dark:text-gray-400">Tenure:</span>
            <p className="text-sm font-medium text-gray-900 dark:text-white">
              {loan.loanTenure} years
            </p>
          </div>
        </div>
      </div>

      {/* View Documents Button */}
      <button
        onClick={() => setShowDocuments(true)}
        className="w-full flex items-center justify-center gap-2 px-4 py-2 mb-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
      >
        <FiFileText className="w-4 h-4" />
        View Documents
      </button>
      
      {/* Action Buttons */}
      <div className="flex gap-3">
        <button
          onClick={() => handleAction('APPROVED')} // ✅ Use uppercase status
          disabled={isUpdating}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white rounded-lg font-medium transition-colors"
        >
          <FiCheck className="w-4 h-4" />
          {isUpdating ? 'Processing...' : 'Approve'}
        </button>
        
        <button
          onClick={() => handleAction('REJECTED')} // ✅ Use uppercase status
          disabled={isUpdating}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white rounded-lg font-medium transition-colors"
        >
          <FiX className="w-4 h-4" />
          {isUpdating ? 'Processing...' : 'Reject'}
        </button>
      </div>
      
      {/* Document Viewer Modal */}
      {showDocuments && (
        <AdminDocumentViewer 
          loanId={loan.id} 
          isOpen={showDocuments}
          onClose={() => setShowDocuments(false)}
        />
      )}
    </div>
  );
};

export default LoanApprovalCard;
