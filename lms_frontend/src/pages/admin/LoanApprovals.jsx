import React, { useState, useEffect } from 'react';
import { FiRefreshCw, FiSearch } from 'react-icons/fi';
import { fetchAdminLoans } from '../../services/loanService'; // ✅ Use admin service
import { LOAN_STATUS } from '../../constants/loanConstants';
import LoanApprovalCard from '../../components/admin/LoanApprovalCard';

const LoanApprovals = () => {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch pending loans for approval
  const loadPendingLoans = async () => {
    setLoading(true);
    try {
      // ✅ Use admin service and correct status
      const data = await fetchAdminLoans({
        status: 'PENDING', // ✅ Uppercase status
        page: currentPage,
        size: 10,
        sort: 'createdAt,desc'
      });
      
      setLoans(data.content || []);
      setTotalPages(data.totalPages || 0);
      setTotalElements(data.totalElements || 0);
    } catch (error) {
      console.error('Failed to fetch pending loans:', error);
      setLoans([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPendingLoans();
  }, [currentPage]);

  // Handle loan status change and refresh list
  const handleStatusChange = (loanId, newStatus) => {
    // Remove the processed loan from the list
    setLoans(prevLoans => prevLoans.filter(loan => loan.id !== loanId));
    setTotalElements(prev => prev - 1);
  };

  const handleRefresh = () => {
    setCurrentPage(0);
    loadPendingLoans();
  };

  const filteredLoans = loans.filter(loan => 
    loan.user?.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    loan.user?.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    loan.user?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    loan.id?.toString().includes(searchTerm)
  );

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <span className="ml-4 text-gray-600">Loading pending loan applications...</span>
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
            Loan Approvals
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Review and approve pending loan applications ({totalElements} pending)
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
        <div className="relative flex-1 max-w-md">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search by name, email, or loan ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
          />
        </div>
      </div>

      {/* Loan Cards */}
      {filteredLoans.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-500 dark:text-gray-400">
            <FiRefreshCw className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-medium mb-2">No Pending Applications</h3>
            <p>All loan applications have been processed or no applications match your search.</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredLoans.map((loan) => (
            <LoanApprovalCard
              key={loan.id}
              loan={loan}
              onStatusChange={handleStatusChange}
            />
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

export default LoanApprovals;
