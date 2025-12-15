import React, { createContext, useState, useCallback, useMemo } from 'react';
import { 
  fetchLoans, 
  fetchUserLoans, 
  fetchUserLoansPaginated, 
  updateLoanStatus,
  applyLoan as applyLoanService // Import the correct function
} from '../services/loanService';

export const LoanContext = createContext();

export const LoanProvider = ({ children }) => {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Clear error function
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Get all loans (admin)
  const getAllLoans = useCallback(async (params = {}) => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchLoans(params);
      setLoans(data.content || data);
      return data;
    } catch (error) {
      console.error('Error in getAllLoans:', error);
      setError(error.response?.data?.message || error.message || 'Failed to fetch loans');
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  // Apply for a new loan - Use loanService consistently
  const applyLoan = useCallback(async (loanData) => {
    try {
      setLoading(true);
      setError(null);
      const data = await applyLoanService(loanData);
      return data;
    } catch (error) {
      console.error('Error in applyLoan:', error);
      setError(error.response?.data?.message || error.message || 'Failed to apply for loan');
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  // Get loan history for a user with pagination
  const getLoanHistory = useCallback(async (page = 0, size = 10) => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchUserLoansPaginated(page, size);
      return data;
    } catch (error) {
      console.error('Error in getLoanHistory:', error);
      setError(error.response?.data?.message || error.message || 'Failed to fetch loan history');
      
      // Return empty structure instead of throwing
      return { 
        content: [], 
        totalPages: 0, 
        totalElements: 0, 
        number: page,
        size: size,
        first: true,
        last: true
      };
    } finally {
      setLoading(false);
    }
  }, []);

  // Update loan status (admin)
  const changeLoanStatus = useCallback(async (loanId, status) => {
    try {
      setLoading(true);
      setError(null);
      const data = await updateLoanStatus(loanId, status);
      return data;
    } catch (error) {
      console.error('Error in changeLoanStatus:', error);
      setError(error.response?.data?.message || error.message || 'Failed to update loan status');
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const value = useMemo(() => ({
    loans,
    loading,
    error,
    getAllLoans,
    applyLoan,
    getLoanHistory,
    changeLoanStatus,
    clearError
  }), [loans, loading, error, getAllLoans, applyLoan, getLoanHistory, changeLoanStatus, clearError]);

  return (
    <LoanContext.Provider value={value}>
      {children}
    </LoanContext.Provider>
  );
};
