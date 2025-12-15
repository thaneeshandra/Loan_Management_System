import React, { useState, useEffect, useContext } from 'react';
import { fetchAdminLoans, updateAdminLoanStatus } from '../../services/loanService';
import { FiFilter, FiRefreshCw, FiCheck, FiX, FiEye } from 'react-icons/fi';
import { ThemeContext } from '../../context/ThemeContext';
import LoanDetails from '../user/LoanDetails'; // Adjust path if needed
import { useNavigate } from 'react-router-dom';

const ManageLoans = () => {
  const { theme } = useContext(ThemeContext);
    const navigate = useNavigate();
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedLoanId, setSelectedLoanId] = useState(null); // Add state for modal

  useEffect(() => {
    const loadLoans = async () => {
      setLoading(true);
      try {
        const data = await fetchAdminLoans({
          status: filter === 'all' ? undefined : filter,
          page,
          size: 10,
          sort: 'createdAt,desc'
        });
        setLoans(data.content);
        setTotalPages(data.totalPages);
      } catch (err) {
        console.error('Failed to fetch loans:', err);
      } finally {
        setLoading(false);
      }
    };

    loadLoans();
  }, [filter, page]);

  const handleStatusChange = async (id, newStatus) => {
    try {
      await updateAdminLoanStatus(id, newStatus);
      setLoans(loans.map(loan => loan.id === id ? { ...loan, status: newStatus } : loan));
    } catch (err) {
      console.error('Failed to update loan status:', err);
    }
  };

const handleViewDetails = (loan) => {
    navigate(`/admin/loans/${loan.id}`);
  };
  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
    approved: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
    rejected: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
  };

  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Manage Loans</h1>
          <p className="text-gray-600 dark:text-gray-300">Review and manage all loan applications.</p>
        </div>
        <button 
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
          onClick={() => {setFilter('all');
            setPage(0);
            window.location.reload();
          }}
        >
          <FiRefreshCw /> Refresh
        </button>
      </div>

      {/* Filter options */}
      <div className="flex gap-2 mb-4">
        <div className="flex items-center gap-1 text-gray-700 dark:text-gray-300">
          <FiFilter /> <span>Filter:</span>
        </div>
        {['all', 'pending', 'approved', 'rejected'].map(option => (
          <button
            key={option}
            className={`px-3 py-1 rounded-full text-sm transition-colors ${
              filter === option 
                ? 'bg-blue-600 text-white dark:bg-blue-700' 
                : 'bg-gray-200 text-gray-700 dark:bg-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-500'
            }`}
            onClick={() => {setFilter(option);
              setPage(0);

            }}
          >
            {option.charAt(0).toUpperCase() + option.slice(1)}
          </button>
        ))}
      </div>

      {/* Loans table */}
      {loading ? (
        <div className="flex justify-center my-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 dark:border-blue-400"></div>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow">
            <thead className="bg-gray-100 dark:bg-gray-700">
              <tr>
                <th className="px-4 py-3 text-left text-gray-900 dark:text-white">ID</th>
                <th className="px-4 py-3 text-left text-gray-900 dark:text-white">Borrower</th>
                <th className="px-4 py-3 text-left text-gray-900 dark:text-white">Amount</th>
                <th className="px-4 py-3 text-left text-gray-900 dark:text-white">Type</th>
                <th className="px-4 py-3 text-left text-gray-900 dark:text-white">Date</th>
                <th className="px-4 py-3 text-left text-gray-900 dark:text-white">Status</th>
                <th className="px-4 py-3 text-left text-gray-900 dark:text-white">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
              {loans.length > 0 ? (
                loans.map((loan) => (
                  <tr key={loan.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    <td className="px-4 py-3 text-gray-900 dark:text-white">{loan.id}</td>
                    <td className="px-4 py-3 text-gray-900 dark:text-white">{loan.userName}</td>
                    <td className="px-4 py-3 text-gray-900 dark:text-white">₹{loan.amountRequested?.toLocaleString()}</td>
                    <td className="px-4 py-3 text-gray-900 dark:text-white">{loan.loanType}</td>
                    <td className="px-4 py-3 text-gray-900 dark:text-white">{loan.createdAt?.slice(0, 10)}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs ${statusColors[loan.status?.toLowerCase()]}`}>
                        {loan.status?.charAt(0).toUpperCase() + loan.status?.slice(1)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button
                          className="p-1 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded transition-colors"
                          title="View Details"
                          onClick={() => handleViewDetails(loan)}
                        >
                          <FiEye />
                        </button>
                        
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="px-4 py-6 text-center text-gray-500 dark:text-gray-400">
                    No loan applications found matching the current filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      <div className="flex justify-end mt-4 space-x-2">
        <button
          onClick={() => setPage((prev) => Math.max(prev - 1, 0))}
          disabled={page === 0}
          className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:opacity-50 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
        >
          Prev
        </button>
        <span className="px-3 py-1 text-gray-900 dark:text-white">{page + 1} / {totalPages}</span>
        <button
          onClick={() => setPage((prev) => Math.min(prev + 1, totalPages - 1))}
          disabled={page + 1 >= totalPages}
          className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:opacity-50 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
        >
          Next
        </button>
      </div>

      {/* Loan Details Modal */}
      {selectedLoanId && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg max-w-3xl w-full p-6 relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
              onClick={() => setSelectedLoanId(null)}
            >
              ×
            </button>
            <LoanDetails id={selectedLoanId} isAdminView />
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageLoans;
