import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { FiArrowLeft, FiCreditCard, FiCalendar, FiDollarSign, FiFileText, FiUser, FiClock } from 'react-icons/fi';

const LoanDetails = () => {
  const { id } = useParams(); // Get loan ID from URL
  const navigate = useNavigate();
  
  const [loan, setLoan] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Transaction pagination
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [pageSize] = useState(5);

  useEffect(() => {
    const fetchLoanDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch loan details
        const loanResponse = await api.get(`/loans/${id}`);
        setLoan(loanResponse.data);
          try {
          // Try to fetch transactions, but don't fail the whole component if this endpoint doesn't exist
          const transactionsResponse = await api.get(`/transactions/loan/${id}`, {
            params: { page: currentPage, size: pageSize }
          });
          
          setTransactions(transactionsResponse.data.content || []);
          setTotalPages(transactionsResponse.data.totalPages || 0);        } catch (transactionError) {
          console.warn('Could not load transactions, endpoint may not exist yet:', transactionError);
          // TODO: Show user-friendly message about transactions not being available
          setTransactions([]);
          setTotalPages(0);
        }
      } catch (err) {
        console.error('Error fetching loan details:', err);
        setError('Failed to fetch loan details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchLoanDetails();
  }, [id, currentPage, pageSize, navigate]);

  const formatCurrency = (amount) => 
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amount);

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };
  
  const getLoanStatusClass = (status) => {
    switch (status) {
      case 'APPROVED': return 'bg-green-100 text-green-800';
      case 'PENDING': return 'bg-yellow-100 text-yellow-800';
      case 'REJECTED': return 'bg-red-100 text-red-800';
      case 'CLOSED': return 'bg-gray-100 text-gray-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-3xl mx-auto p-6 bg-red-50 border border-red-200 rounded-lg">
        <h2 className="text-xl font-bold text-red-700 mb-4">Error</h2>
        <p className="text-red-600">{error}</p>
        <button 
          onClick={() => navigate(-1)} 
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Go Back
        </button>
      </div>
    );
  }

  if (!loan) {
    return (
      <div className="max-w-3xl mx-auto p-6 bg-yellow-50 border border-yellow-200 rounded-lg">
        <h2 className="text-xl font-bold text-yellow-700 mb-4">Loan Not Found</h2>
        <p className="text-yellow-600">The requested loan could not be found.</p>
        <button 
          onClick={() => navigate('/loans')} 
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center"
        >
          <FiArrowLeft className="mr-2" /> Back to Loans
        </button>
      </div>
    );
  }

  // Calculate EMI (Equated Monthly Installment)
  const calculateEMI = () => {
    if (!loan || !loan.amountRequested || !loan.interestRate || !loan.loanTenure) {
      return 0;
    }
    
    const principal = loan.amountRequested;
    const rate = loan.interestRate / 100 / 12; // monthly interest rate
    const tenure = loan.loanTenure * 12; // convert years to months
    
    // EMI formula: P × r × (1 + r)^n / ((1 + r)^n - 1)
    const emi = principal * rate * Math.pow(1 + rate, tenure) / (Math.pow(1 + rate, tenure) - 1);
    return isNaN(emi) ? 0 : emi;
  };
  
  // Calculate total amount payable
  const totalPayable = calculateEMI() * (loan.loanTenure * 12);
  
  // Calculate total interest payable
  const totalInterest = totalPayable - loan.amountRequested;

  return (
    <div className="max-w-4xl mx-auto bg-white dark:bg-gray-900 shadow-lg rounded-lg overflow-hidden">
      {/* Header with back button */}
      <div className="flex items-center justify-between bg-blue-600 dark:bg-blue-800 p-4 text-white">
        <div className="flex items-center">
          <button 
            onClick={() => navigate('/loans/my-loans')} 
            className="mr-4 p-1 hover:bg-blue-700 dark:hover:bg-blue-900 rounded"
          >
            <FiArrowLeft size={20} />
          </button>
          <h2 className="text-xl font-bold">Loan Details #{loan.id}</h2>
        </div>
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getLoanStatusClass(loan.status)}`}>
          {loan.status}
        </span>
      </div>
      
      {/* Loan Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6 bg-gray-50 dark:bg-gray-800">
        <div className="bg-white dark:bg-gray-900 p-4 rounded-lg shadow">
          <div className="flex items-center text-blue-600 dark:text-blue-400 mb-2">
            <FiCreditCard className="mr-2" size={18} />
            <h3 className="font-medium">Loan Summary</h3>
          </div>
          <p className="text-2xl font-bold mb-1 text-gray-900 dark:text-gray-100">{formatCurrency(loan.amountRequested)}</p>
          <p className="text-sm text-gray-500 dark:text-gray-300">{loan.loanType} Loan</p>
        </div>
        
        <div className="bg-white dark:bg-gray-900 p-4 rounded-lg shadow">
          <div className="flex items-center text-green-600 dark:text-green-400 mb-2">
            <FiDollarSign className="mr-2" size={18} />
            <h3 className="font-medium">EMI Amount</h3>
          </div>
          <p className="text-2xl font-bold mb-1 text-gray-900 dark:text-gray-100">{formatCurrency(calculateEMI())}</p>
          <p className="text-sm text-gray-500 dark:text-gray-300">Monthly Payment</p>
        </div>
        
        <div className="bg-white dark:bg-gray-900 p-4 rounded-lg shadow">
          <div className="flex items-center text-purple-600 dark:text-purple-400 mb-2">
            <FiCalendar className="mr-2" size={18} />
            <h3 className="font-medium">Tenure</h3>
          </div>
          <p className="text-2xl font-bold mb-1 text-gray-900 dark:text-gray-100">{loan.loanTenure} Years</p>
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
            <p className="text-sm text-gray-500 dark:text-gray-300">Loan Type</p>
            <p className="font-medium text-gray-900 dark:text-gray-100">{loan.loanType}</p>
          </div>
          
          <div className="border-b pb-2 border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-500 dark:text-gray-300">Employment Type</p>
            <p className="font-medium text-gray-900 dark:text-gray-100">{loan.employmentType}</p>
          </div>
          
          <div className="border-b pb-2 border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-500 dark:text-gray-300">Principal Amount</p>
            <p className="font-medium text-gray-900 dark:text-gray-100">{formatCurrency(loan.amountRequested)}</p>
          </div>
          
          <div className="border-b pb-2 border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-500 dark:text-gray-300">Total Interest</p>
            <p className="font-medium text-gray-900 dark:text-gray-100">{formatCurrency(totalInterest)}</p>
          </div>
          
          <div className="border-b pb-2 border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-500 dark:text-gray-300">Total Payable</p>
            <p className="font-medium text-gray-900 dark:text-gray-100">{formatCurrency(totalPayable)}</p>
          </div>
          
          <div className="border-b pb-2 border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-500 dark:text-gray-300">Created On</p>
            <p className="font-medium text-gray-900 dark:text-gray-100">{formatDate(loan.createdAt)}</p>
          </div>
          
          {loan.loanApprovalDate && (
            <div className="border-b pb-2 border-gray-200 dark:border-gray-700">
              <p className="text-sm text-gray-500 dark:text-gray-300">Approved On</p>
              <p className="font-medium text-gray-900 dark:text-gray-100">{formatDate(loan.loanApprovalDate)}</p>
            </div>
          )}
          
          {loan.closureDate && (
            <div className="border-b pb-2 border-gray-200 dark:border-gray-700">
              <p className="text-sm text-gray-500 dark:text-gray-300">Closed On</p>
              <p className="font-medium text-gray-900 dark:text-gray-100">{formatDate(loan.closureDate)}</p>
            </div>
          )}
        </div>
        
        {/* Loan Timeline */}
        <h3 className="text-lg font-semibold mb-4 mt-8 flex items-center text-gray-900 dark:text-gray-100">
          <FiClock className="mr-2" size={18} />
          Loan Timeline
        </h3>
        
        <div className="relative ml-8 pb-4">
          {/* Timeline line */}
          <div className="absolute left-0 top-0 h-full w-0.5 bg-blue-200"></div>
          
          {/* Timeline events */}
          <div className="relative mb-6">
            <div className="absolute left-0 w-4 h-4 -ml-2 rounded-full bg-blue-600"></div>
            <div className="ml-6 pb-4">
              <p className="text-sm text-gray-500">Application Date</p>
              <p className="font-medium">Loan Application Submitted</p>
            </div>
          </div>
          
          {loan.status !== 'PENDING' && (
            <div className="relative mb-6">
              <div className={`absolute left-0 w-4 h-4 -ml-2 rounded-full ${
                loan.status === 'APPROVED' ? 'bg-green-600' : 'bg-red-600'
              }`}></div>
              <div className="ml-6 pb-4">
                <p className="text-sm text-gray-500">{formatDate(loan.loanApprovalDate || loan.closureDate)}</p>
                <p className="font-medium">
                  Loan {loan.status === 'APPROVED' ? 'Approved' : 'Rejected'}
                </p>
              </div>
            </div>
          )}
          
          {loan.closureDate && loan.status === 'CLOSED' && (
            <div className="relative">
              <div className="absolute left-0 w-4 h-4 -ml-2 rounded-full bg-gray-600"></div>
              <div className="ml-6">
                <p className="text-sm text-gray-500">{formatDate(loan.closureDate)}</p>
                <p className="font-medium">Loan Closed</p>
              </div>
            </div>
          )}
        </div>
        
        {/* Transaction History */}
        <h3 className="text-lg font-semibold mb-4 mt-8 flex items-center text-gray-900 dark:text-gray-100">
          <FiDollarSign className="mr-2" size={18} />
          Transaction History
        </h3>
        
        {transactions.length > 0 ? (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                      Date
                    </th>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                      Amount
                    </th>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                      Type
                    </th>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((transaction) => (
                    <tr key={transaction.id} className="hover:bg-gray-50">
                      <td className="py-3 px-4 text-sm text-gray-800 border-b">
                        {formatDate(transaction.date)}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-800 border-b">
                        {formatCurrency(transaction.amount)}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-800 border-b">
                        {transaction.type}
                      </td>
                      <td className="py-3 px-4 text-sm border-b">
                        <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                          transaction.status === 'COMPLETED' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {transaction.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {/* Pagination */}
            <div className="flex items-center justify-between mt-4 px-2">
              <p className="text-sm text-gray-600">
                Showing {transactions.length} of {totalPages * pageSize} transactions
              </p>
              <div className="flex space-x-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
                  disabled={currentPage === 0}
                  className="px-3 py-1 border rounded disabled:opacity-50"
                >
                  Previous
                </button>
                <span className="px-3 py-1">
                  {currentPage + 1} of {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(totalPages - 1, prev + 1))}
                  disabled={currentPage >= totalPages - 1}
                  className="px-3 py-1 border rounded disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="py-8 text-center text-gray-500">
            No transactions found for this loan.
          </div>
        )}
      </div>
    </div>
  );
};

export default LoanDetails;
