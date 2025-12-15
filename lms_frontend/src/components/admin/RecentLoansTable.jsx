import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FiCreditCard, FiEye } from 'react-icons/fi';
import { formatCurrency, formatDate, getLoanTypeLabel } from '../../utils/format';

const RecentLoansTable = ({ loans, page, totalPages, setPage }) => {
  const navigate = useNavigate();

  const getStatusBadge = (status) => {
    const statusClasses = {
      'APPROVED': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      'PENDING': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
      'REJECTED': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
    };
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusClasses[status] || statusClasses.PENDING}`}>
        {status || 'Unknown'}
      </span>
    );
  };

  // Safety check for loans array
  if (!loans || !Array.isArray(loans)) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        <div className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Recent Loan Applications</h2>
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <FiCreditCard className="mx-auto h-12 w-12 mb-4 opacity-50" />
            <p>No loan data available</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Recent Loan Applications</h2>
          <button
            onClick={() => navigate('/admin/loans')}
            className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium flex items-center gap-1 hover:gap-2 transition-all"
          >
            View All <span>→</span>
          </button>
        </div>
        
        {loans.length === 0 ? (
          <div className="text-center py-12 text-gray-500 dark:text-gray-400">
            <FiCreditCard className="mx-auto h-16 w-16 mb-4 opacity-50" />
            <p className="text-lg font-medium">No loan applications found</p>
            <p className="text-sm mt-2">Loan applications will appear here when users apply</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-left">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-4 py-3 text-gray-700 dark:text-gray-300 font-medium">User</th>
                  <th className="px-4 py-3 text-gray-700 dark:text-gray-300 font-medium">Loan Type</th>
                  <th className="px-4 py-3 text-gray-700 dark:text-gray-300 font-medium">Amount</th>
                  <th className="px-4 py-3 text-gray-700 dark:text-gray-300 font-medium">Status</th>
                  <th className="px-4 py-3 text-gray-700 dark:text-gray-300 font-medium">Applied On</th>
                  <th className="px-4 py-3 text-gray-700 dark:text-gray-300 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {loans.map((loan, index) => {
                  // Safety check for individual loan objects
                  if (!loan) {
                    console.warn(`Invalid loan at index ${index}:`, loan);
                    return null;
                  }

                  return (
                    <tr 
                      key={loan.id || index} 
                      className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      <td className="px-4 py-3 text-gray-900 dark:text-gray-300 font-medium">
                        <div className="flex flex-col">
                          <span>{loan.userName || 'N/A'}</span>
                          {loan.userEmail && (
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {loan.userEmail}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-900 dark:text-gray-300">
                        {getLoanTypeLabel(loan.loanType)}
                      </td>
                      <td className="px-4 py-3 text-gray-900 dark:text-gray-300 font-medium">
                        {formatCurrency(loan.amountRequested)}
                      </td>
                      <td className="px-4 py-3">
                        {getStatusBadge(loan.status)}
                      </td>
                      <td className="px-4 py-3 text-gray-900 dark:text-gray-300">
                        {formatDate(loan.createdAt)}
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => navigate(`/admin/loans/${loan.id}`)}
                          className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 p-1 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition-colors"
                          title="View Details"
                        >
                          <FiEye className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-700 dark:text-gray-300">
              Showing page {page + 1} of {totalPages}
            </p>
            <div className="flex space-x-2">
              <button
                onClick={() => setPage((prev) => Math.max(prev - 1, 0))}
                disabled={page === 0}
                className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded disabled:opacity-50 disabled:cursor-not-allowed text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Previous
              </button>
              <span className="px-3 py-1 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded">
                {page + 1} / {totalPages}
              </span>
              <button
                onClick={() => setPage((prev) => Math.min(prev + 1, totalPages - 1))}
                disabled={page + 1 >= totalPages}
                className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded disabled:opacity-50 disabled:cursor-not-allowed text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecentLoansTable;