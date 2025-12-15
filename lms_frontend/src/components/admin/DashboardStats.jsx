import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiUsers, FiDollarSign, FiCheckCircle, FiAlertCircle, FiRefreshCw } from 'react-icons/fi';
import StatCard from '../user/StatCard';
import api from '../../services/api';

const DashboardStats = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalLoans: 0,
    activeLoans: 0,
    pendingApprovals: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch data in parallel for better performance
      const [usersStatsResponse, loansResponse, pendingLoansResponse, activeLoansResponse] = await Promise.all([
        // Get user statistics from admin endpoint
        api.get('/admin/users/stats'),
        // Get total loans count
        api.get('/admin/loans', { params: { page: 0, size: 1 } }),
        // Get pending loans count
        api.get('/admin/loans', { params: { status: 'PENDING', page: 0, size: 1 } }),
        // Get active loans count
        api.get('/admin/loans', { params: { status: 'APPROVED', page: 0, size: 1 } })
      ]);

      // Update stats with real data
      setStats({
        totalUsers: usersStatsResponse.data.totalUsers || 0,
        totalLoans: loansResponse.data.totalElements || 0,
        pendingApprovals: pendingLoansResponse.data.totalElements || 0,
        activeLoans: activeLoansResponse.data.totalElements || 0
      });

      console.log('✅ Dashboard stats loaded successfully:', stats);
    } catch (err) {
      console.error('❌ Failed to load dashboard stats:', err);
      setError('Failed to load statistics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleRefresh = () => {
    fetchStats();
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md animate-pulse">
            <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/3 mb-2"></div>
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 p-4 rounded-lg mb-6">
        <p>{error}</p>
        <button 
          onClick={handleRefresh}
          className="mt-2 text-sm bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button
          onClick={handleRefresh}
          className="flex items-center gap-2 text-sm bg-blue-50 dark:bg-blue-900/30 hover:bg-blue-100 dark:hover:bg-blue-900/50 text-blue-700 dark:text-blue-300 px-3 py-1.5 rounded-md transition-colors"
        >
          <FiRefreshCw className="w-4 h-4" />
          <span>Refresh Stats</span>
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <button
          type="button"
          onClick={() => navigate('/admin/users')}
          className="cursor-pointer bg-transparent border-none p-0 text-left w-full hover:scale-105 transition-transform duration-200"
        >
          <StatCard 
            title="Total Users" 
            value={stats.totalUsers} 
            icon={<FiUsers className="w-6 h-6" />} 
            color="blue" 
          />
        </button>
        <button
          type="button"
          onClick={() => navigate('/admin/loans')}
          className="cursor-pointer bg-transparent border-none p-0 text-left w-full hover:scale-105 transition-transform duration-200"
        >
          <StatCard 
            title="Total Loans" 
            value={stats.totalLoans} 
            icon={<FiDollarSign className="w-6 h-6" />} 
            color="green" 
          />
        </button>
        <button
          type="button"
          onClick={() => navigate('/admin/loans?status=APPROVED')}
          className="cursor-pointer bg-transparent border-none p-0 text-left w-full hover:scale-105 transition-transform duration-200"
        >
          <StatCard 
            title="Active Loans" 
            value={stats.activeLoans} 
            icon={<FiCheckCircle className="w-6 h-6" />} 
            color="info" 
          />
        </button>
        <button
          type="button"
          onClick={() => navigate('/admin/loan-approvals')}
          className="cursor-pointer bg-transparent border-none p-0 text-left w-full hover:scale-105 transition-transform duration-200"
        >
          <StatCard 
            title="Pending Approvals" 
            value={stats.pendingApprovals} 
            icon={<FiAlertCircle className="w-6 h-6" />} 
            color="warning" 
          />
        </button>
      </div>
    </div>
  );
};

export default DashboardStats;