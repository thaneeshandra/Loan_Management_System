import React, { useContext, useEffect, useState } from "react";
import { LoanContext } from "../../context/LoanContext";
import { useNotification } from "../../context/NotificationContext";
import LoanDetailsNavigation from "../../components/user/LoanDetailsNavigation";
import StatusBadge from "../../components/common/StatusBadge";
import Pagination from "../../components/common/Pagination";
import { formatCurrency, getLoanTypeLabel } from "../../utils/format";
import { FiFilter, FiRefreshCw, FiX } from "react-icons/fi";

const LoanHistory = () => {
  const { getLoanHistory, error: contextError } = useContext(LoanContext);
  const [loans, setLoans] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [pagination, setPagination] = useState({
    totalPages: 0,
    totalElements: 0,
    currentPage: 0,
  });
  const { error } = useNotification();

  // Filter states
  const [filters, setFilters] = useState({
    status: 'all',
    loanType: 'all',
    amountRange: 'all'
  });
  const [showFilters, setShowFilters] = useState(false);

  // Filter helper functions
  const filterLoans = React.useCallback((loansData) => {
    return loansData.filter(loan => {
      // Status filter
      if (filters.status !== 'all' && loan.status?.toLowerCase() !== filters.status.toLowerCase()) {
        return false;
      }
      
      // Loan type filter
      if (filters.loanType !== 'all' && loan.loanType?.toLowerCase() !== filters.loanType.toLowerCase()) {
        return false;
      }
      
      // Amount range filter
      if (filters.amountRange !== 'all') {
        const amount = loan.amountRequested || 0;
        switch (filters.amountRange) {
          case 'under50k':
            if (amount >= 50000) return false;
            break;
          case '50k-100k':
            if (amount < 50000 || amount > 100000) return false;
            break;
          case '100k-500k':
            if (amount < 100000 || amount > 500000) return false;
            break;
          case 'over500k':
            if (amount <= 500000) return false;
            break;
          default:
            break;
        }
      }
      
      return true;
    });
  }, [filters]);

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      status: 'all',
      loanType: 'all',
      amountRange: 'all'
    });
  };

  const hasActiveFilters = filters.status !== 'all' || filters.loanType !== 'all' || filters.amountRange !== 'all';

  // Fetch loans with pagination
  const fetchLoans = React.useCallback(
    async (page = 0) => {
      try {
        setIsLoading(true);
        // Pass sort param for newest first
        const result = await getLoanHistory(page, 10, "createdAt,desc");

        if (contextError) {
          error("Failed to fetch loan history. Please try again later.");
          setLoans([]);
          setPagination({
            totalPages: 0,
            totalElements: 0,
            currentPage: 0,
          });
        } else if (result && result.content) {
          const filteredLoans = filterLoans(result.content);
          setLoans(filteredLoans);
          setPagination({
            totalPages: result.totalPages || 0,
            totalElements: result.totalElements || 0,
            currentPage: result.number || 0,
          });
        } else {
          setLoans([]);
          setPagination({
            totalPages: 0,
            totalElements: 0,
            currentPage: 0,
          });
        }
      } catch (err) {
        console.error("Unexpected error fetching loan history:", err);
        error("An unexpected error occurred. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    },
    [getLoanHistory, contextError, error, filterLoans]
  );

  useEffect(() => {
    fetchLoans();
  }, [fetchLoans]);

  // Refetch loans when filters change
  useEffect(() => {
    fetchLoans(0);
  }, [filters, fetchLoans]);

  // Pagination handler for Pagination component (1-based)
  const handlePageChange = (pageNumber) => {
    fetchLoans(pageNumber - 1);
  };

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-green-700 dark:text-green-300">
          Loan History
        </h2>
        <div className="flex justify-center items-center h-32">
          <div className="animate-spin rounded-full h-10 w-10 border-4 border-green-500 border-t-transparent"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-md">
      {/* Header with Filter Toggle */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-green-700 dark:text-green-300">
          Loan History
        </h2>
        <div className="flex items-center space-x-3">
          {hasActiveFilters && (
            <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs rounded-full">
              Filters Active
            </span>
          )}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center space-x-2 px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
          >
            <FiFilter size={16} />
            <span>{showFilters ? 'Hide Filters' : 'Show Filters'}</span>
          </button>
        </div>
      </div>

      {/* Filter Section */}
      {showFilters && (
        <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border dark:border-gray-700">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Status
              </label>
              <select
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-green-500 focus:border-green-500"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
                <option value="disbursed">Disbursed</option>
                <option value="closed">Closed</option>
              </select>
            </div>

            {/* Loan Type Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Loan Type
              </label>
              <select
                value={filters.loanType}
                onChange={(e) => handleFilterChange('loanType', e.target.value)}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-green-500 focus:border-green-500"
              >
                <option value="all">All Types</option>
                <option value="personal">Personal Loan</option>
                <option value="home">Home Loan</option>
                <option value="vehicle">Vehicle Loan</option>
                <option value="education">Education Loan</option>
                <option value="business">Business Loan</option>
              </select>
            </div>

            {/* Amount Range Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Amount Range
              </label>
              <select
                value={filters.amountRange}
                onChange={(e) => handleFilterChange('amountRange', e.target.value)}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-green-500 focus:border-green-500"
              >
                <option value="all">All Amounts</option>
                <option value="under50k">Under ₹50,000</option>
                <option value="50k-100k">₹50,000 - ₹1,00,000</option>
                <option value="100k-500k">₹1,00,000 - ₹5,00,000</option>
                <option value="over500k">Over ₹5,00,000</option>
              </select>
            </div>
          </div>

          {/* Filter Actions */}
          <div className="flex justify-between items-center mt-4">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Showing {loans.length} of {pagination.totalElements} loans
            </div>
            <div className="flex space-x-2">
              <button
                onClick={clearFilters}
                className="flex items-center space-x-1 px-3 py-1 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 border border-gray-300 dark:border-gray-600 rounded transition-colors"
              >
                <FiX size={14} />
                <span>Clear Filters</span>
              </button>
              <button
                onClick={() => fetchLoans(0)}
                className="flex items-center space-x-1 px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded transition-colors"
              >
                <FiRefreshCw size={14} />
                <span>Refresh</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {loans.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500 dark:text-gray-400 text-lg">
            No loan history available.
          </p>
          <p className="text-gray-400 dark:text-gray-500 mt-2">
            When you apply for loans, they will appear here.
          </p>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full table-auto border-collapse">
              <thead>
                <tr className="bg-green-50 dark:bg-green-950 border-b border-green-200 dark:border-green-800">
                  <th className="p-3 text-left text-green-700 dark:text-green-300">
                    Loan ID
                  </th>
                  <th className="p-3 text-left text-green-700 dark:text-green-300">
                    Type
                  </th>
                  <th className="p-3 text-left text-green-700 dark:text-green-300">
                    Amount
                  </th>
                  <th className="p-3 text-left text-green-700 dark:text-green-300">
                    Tenure
                  </th>
                  <th className="p-3 text-left text-green-700 dark:text-green-300">
                    Status
                  </th>
                  <th className="p-3 text-left text-green-700 dark:text-green-300">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {loans.map((loan, index) => (
                  <tr
                    key={loan?.id || index}
                    className="border-b border-gray-100 dark:border-gray-800 hover:bg-green-50 dark:hover:bg-green-900 transition-colors"
                  >
                    <td className="p-3 text-gray-700 dark:text-gray-200">
                      {loan?.id}
                    </td>
                    <td className="p-3 text-gray-700 dark:text-gray-200">
                      {getLoanTypeLabel(loan?.loanType)}
                    </td>
                    <td className="p-3 font-medium text-gray-900 dark:text-gray-100">
                      {formatCurrency(loan?.amountRequested)}
                    </td>
                    <td className="p-3 text-gray-700 dark:text-gray-200">
                      {loan?.loanTenure ? `${loan.loanTenure} years` : "N/A"}
                    </td>
                    <td className="p-3">
                      <StatusBadge status={loan?.status} />
                    </td>
                    <td className="p-3">
                      <LoanDetailsNavigation loanId={loan?.id} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <Pagination
              currentPage={pagination.currentPage + 1}
              totalPages={pagination.totalPages}
              onPageChange={handlePageChange}
            />
          )}
        </>
      )}
    </div>
  );
};

export default LoanHistory;