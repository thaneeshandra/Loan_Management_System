import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiCreditCard, FiCalendar, FiDollarSign, FiFileText, FiUser, FiClock, FiCheck, FiX } from 'react-icons/fi';
import { getAdminLoanById, updateAdminLoanStatus } from '../../services/loanService';
import { formatCurrency, formatDate, getLoanTypeLabel } from '../../utils/format';
import { useNotification } from '../../context/NotificationContext';

const AdminLoanDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { success, error } = useNotification();
  
  const [loan, setLoan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [apiError, setApiError] = useState(null);

  useEffect(() => {
    const fetchLoanDetails = async () => {
      try {
        setLoading(true);
        setApiError(null);
        const loanData = await getAdminLoanById(id);
        setLoan(loanData);
      } catch (err) {
        console.error('Error fetching loan details:', err);
        setApiError('Failed to fetch loan details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchLoanDetails();
    }
  }, [id]);

  const handleStatusUpdate = async (newStatus) => {
    try {
      setUpdating(true);
      await updateAdminLoanStatus(id, newStatus);
      setLoan(prev => ({ ...prev, status: newStatus }));
      success(`Loan ${newStatus.toLowerCase()} successfully!`);
    } catch (err) {
      console.error('Error updating loan status:', err);
      error('Failed to update loan status. Please try again.');
    } finally {
      setUpdating(false);
    }
  };

  const getLoanStatusClass = (status) => {
    switch (status) {
      case 'APPROVED': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'PENDING': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'REJECTED': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      case 'CLOSED': return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
      default: return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                <span className="ml-4 text-gray-600 dark:text-gray-300">Loading loan details...</span>

      </div>
    );
  }

  if (apiError) {
    return (
       <div className="max-w-3xl mx-auto p-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
        <h2 className="text-xl font-bold text-red-700 dark:text-red-300 mb-4">Error</h2>
        <p className="text-red-600 dark:text-red-400">{apiError}</p>
        <div className="mt-4 flex gap-3">
          <button 
            onClick={() => navigate('/admin/loans')} 
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 flex items-center"
          >
            <FiArrowLeft className="mr-2" /> Back to Loans
          </button>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!loan) {
    return (
      <div className="max-w-3xl mx-auto p-6 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
        <h2 className="text-xl font-bold text-yellow-700 dark:text-yellow-300 mb-4">Loan Not Found</h2>
        <p className="text-yellow-600 dark:text-yellow-400">The requested loan could not be found.</p>
        <button 
          onClick={() => navigate('/admin/loans')} 
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center"
        >
          <FiArrowLeft className="mr-2" /> Back to Loans
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto bg-white dark:bg-gray-900 shadow-lg rounded-lg overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between bg-blue-600 dark:bg-blue-800 p-4 text-white">
        <div className="flex items-center">
          <button 
            onClick={() => navigate('/admin/loans')} 
            className="mr-4 p-1 hover:bg-blue-700 dark:hover:bg-blue-900 rounded"
          >
            <FiArrowLeft size={20} />
          </button>
          <h2 className="text-xl font-bold">Admin - Loan Details #{loan.id}</h2>
        </div>
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getLoanStatusClass(loan.status)}`}>
          {loan.status}
        </span>
      </div>

      {/* Action Buttons */}
      {loan.status === 'PENDING' && (
        <div className="bg-gray-50 dark:bg-gray-800 p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Loan Actions
            </h3>
            <div className="flex space-x-3">
              <button
                onClick={() => handleStatusUpdate('APPROVED')}
                disabled={updating}
                className="flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white rounded-lg transition-colors"
              >
                <FiCheck className="mr-2" size={16} />
                {updating ? 'Updating...' : 'Approve'}
              </button>
              <button
                onClick={() => handleStatusUpdate('REJECTED')}
                disabled={updating}
                className="flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white rounded-lg transition-colors"
              >
                <FiX className="mr-2" size={16} />
                {updating ? 'Updating...' : 'Reject'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Loan Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6 bg-gray-50 dark:bg-gray-800">
        <div className="bg-white dark:bg-gray-900 p-4 rounded-lg shadow">
          <div className="flex items-center text-blue-600 dark:text-blue-400 mb-2">
            <FiCreditCard className="mr-2" size={18} />
            <h3 className="font-medium">Loan Amount</h3>
          </div>
          <p className="text-2xl font-bold mb-1 text-gray-900 dark:text-gray-100">{formatCurrency(loan.amountRequested)}</p>
          <p className="text-sm text-gray-500 dark:text-gray-300">{getLoanTypeLabel(loan.loanType)}</p>
        </div>
        
        <div className="bg-white dark:bg-gray-900 p-4 rounded-lg shadow">
          <div className="flex items-center text-green-600 dark:text-green-400 mb-2">
            <FiUser className="mr-2" size={18} />
            <h3 className="font-medium">Applicant</h3>
          </div>
          <p className="text-lg font-bold mb-1 text-gray-900 dark:text-gray-100">{loan.userName || 'N/A'}</p>
          {/* <p className="text-sm text-gray-500 dark:text-gray-300">{loan.userEmail || 'N/A'}</p> */}
        </div>
        
        <div className="bg-white dark:bg-gray-900 p-4 rounded-lg shadow">
          <div className="flex items-center text-purple-600 dark:text-purple-400 mb-2">
            <FiCalendar className="mr-2" size={18} />
            <h3 className="font-medium">Tenure</h3>
          </div>
          <p className="text-lg font-bold mb-1 text-gray-900 dark:text-gray-100">{loan.loanTenure} Years</p>
          <p className="text-sm text-gray-500 dark:text-gray-300">at {loan.interestRate}% interest</p>
        </div>
      </div>

      {/* Loan Details */}
      <div className="p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center text-gray-900 dark:text-gray-100">
          <FiFileText className="mr-2" size={18} />
          Loan Details
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3 mb-6">
          <div className="border-b pb-2 border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-500 dark:text-gray-300">Loan ID</p>
            <p className="font-medium text-gray-900 dark:text-gray-100">{loan.id}</p>
          </div>
          
          <div className="border-b pb-2 border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-500 dark:text-gray-300">Employment Type</p>
            <p className="font-medium text-gray-900 dark:text-gray-100">{loan.employmentType || 'N/A'}</p>
          </div>
          
          <div className="border-b pb-2 border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-500 dark:text-gray-300">Applied On</p>
            <p className="font-medium text-gray-900 dark:text-gray-100">{formatDate(loan.createdAt)}</p>
          </div>
          
          {/* <div className="border-b pb-2 border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-500 dark:text-gray-300">Monthly Income</p>
            <p className="font-medium text-gray-900 dark:text-gray-100">{formatCurrency(loan.monthlyIncome || 0)}</p>
          </div> */}
          
          {loan.loanApprovalDate && (
            <div className="border-b pb-2 border-gray-200 dark:border-gray-700">
              <p className="text-sm text-gray-500 dark:text-gray-300">Approved On</p>
              <p className="font-medium text-gray-900 dark:text-gray-100">{formatDate(loan.loanApprovalDate)}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminLoanDetails;