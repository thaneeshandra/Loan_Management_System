import React from 'react';
import { Link } from 'react-router-dom';
import { FiEye } from 'react-icons/fi';

/**
 * Component for navigating to loan details
 * @param {Object} props
 * @param {number|string} props.loanId - The ID of the loan to view
 * @param {string} props.className - Optional additional CSS classes
 */
const LoanDetailsNavigation = ({ loanId, className = '' }) => {
  if (!loanId) return null;
  
  return (
    <Link 
      to={`/loans/${loanId}`}
      className={`inline-flex items-center px-3 py-1 bg-blue-50 text-blue-600 
                 hover:bg-blue-100 rounded-md transition-colors ${className}`}
    >
      <FiEye className="mr-1" size={14} />
      <span>View Details</span>
    </Link>
  );
};

export default LoanDetailsNavigation;