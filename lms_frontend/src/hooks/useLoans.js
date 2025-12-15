import { useState, useEffect } from 'react';
import api from '../services/api';

export const useLoans = () => {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchLoans = async () => {
    setLoading(true);
    try {
      const response = await api.get('/loans');
      setLoans(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch loans');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLoans();
  }, []);

  return { loans, loading, error, refreshLoans: fetchLoans };
};
