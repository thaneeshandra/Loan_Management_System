import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiUsers, FiCreditCard, FiSettings, FiCheckCircle, FiRefreshCw } from 'react-icons/fi';
import { ThemeContext } from '../../context/ThemeContext';
import api from '../../services/api';
import { fetchAdminLoans } from '../../services/loanService';
import DashboardStats from '../../components/admin/DashboardStats';
import RecentLoansTable from '../../components/admin/RecentLoansTable';

const AdminDashboard = () => {
  const { theme } = useContext(ThemeContext);
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    totalUsers: 0,
    totalLoans: 0,
    pendingApprovals: 0,
    activeLoans: 0,
  });

  const [loans, setLoans] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch all data in parallel
        const [loansResponse, usersResponse, pendingLoansResponse, approvedLoansResponse] = await Promise.allSettled([
          // Get recent loans for the table
          fetchAdminLoans({ page, size: 5 }),
          // Get all users count
          api.get('/admin/users?page=0&size=1'),
          // Get pending loans count using admin endpoint
          fetchAdminLoans({ status: 'PENDING', page: 0, size: 1 }),
          // Get approved/active loans count using admin endpoint
          fetchAdminLoans({ status: 'APPROVED', page: 0, size: 1 })
        ]);

        // Process loans for table
        let recentLoans = [];
        let totalLoansCount = 0;
        let totalPagesCount = 1;

        if (loansResponse.status === 'fulfilled') {
          const { content, totalElements, totalPages: totalPagesFromResponse } = loansResponse.value;
          recentLoans = content || [];
          totalLoansCount = totalElements || 0;
          totalPagesCount = totalPagesFromResponse || 1;
          console.log('✅ Recent loans loaded successfully:', recentLoans.length);
        } else {
          console.error('❌ Failed to load recent loans:', loansResponse.reason);
        }

        // Process user count
        let totalUsersCount = 0;
        if (usersResponse.status === 'fulfilled') {
          totalUsersCount = usersResponse.value.totalElements || 0;
          console.log('✅ Users count loaded successfully:', totalUsersCount);
        } else {
          console.error('❌ Failed to load users count:', usersResponse.reason);
        }

        // Process pending loans count
        let pendingApprovalsCount = 0;
        if (pendingLoansResponse.status === 'fulfilled') {
          pendingApprovalsCount = pendingLoansResponse.value.totalElements || 0;
          console.log('✅ Pending loans count loaded successfully:', pendingApprovalsCount);
        } else {
          console.error('❌ Failed to load pending loans count:', pendingLoansResponse.reason);
        }

        // Process active loans count
        let activeLoansCount = 0;
        if (approvedLoansResponse.status === 'fulfilled') {
          activeLoansCount = approvedLoansResponse.value.totalElements || 0;
          console.log('✅ Active loans count loaded successfully:', activeLoansCount);
        } else {
          console.error('❌ Failed to load active loans count:', approvedLoansResponse.reason);
        }

        // Update state with real data
        setLoans(recentLoans);
        setTotalPages(totalPagesCount);
        setStats({
          totalUsers: totalUsersCount,
          totalLoans: totalLoansCount,
          pendingApprovals: pendingApprovalsCount,
          activeLoans: activeLoansCount,
        });

        console.log('✅ Dashboard data loaded successfully:', {
          totalUsers: totalUsersCount,
          totalLoans: totalLoansCount,
          pendingApprovals: pendingApprovalsCount,
          activeLoans: activeLoansCount,
          recentLoansCount: recentLoans.length
        });

      } catch (err) {
        console.error('❌ Failed to load admin dashboard:', err);
        setError('Failed to load dashboard data');
        
        if (err.response?.status === 401) {
          // Handle unauthorized access
          navigate('/login');
          return;
        }
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [page, navigate]);

  const handleRefresh = () => {
    setPage(0);
    // Force re-fetch by updating a dependency
    setLoading(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 dark:border-blue-400"></div>
        <span className="ml-4 text-gray-600 dark:text-gray-300">Loading dashboard...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg shadow-sm">
        <p className="font-medium">Error</p>
        <p className="text-sm">{error}</p>
        <button 
          onClick={handleRefresh}
          className="mt-2 bg-red-600 dark:bg-red-700 text-white px-4 py-2 rounded-md hover:bg-red-700 dark:hover:bg-red-600 transition-colors duration-200"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      {/* Header with Refresh */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Admin Dashboard</h1>
        {/* <button
          onClick={handleRefresh}
          className="
            flex items-center gap-2
            bg-blue-100 hover:bg-blue-200 text-blue-900
            dark:bg-blue-600 dark:hover:bg-blue-700 dark:text-white
            px-4 py-2 rounded-lg
            transition-colors duration-200 shadow-sm hover:shadow-md hover:scale-105
          "
        >
          <FiRefreshCw className="w-4 h-4" />
          Refresh
        </button> */}
      </div>

      {/* Stats Component with Real Data */}
      <DashboardStats stats={stats} />

      {/* Quick Actions - Alternative Color Scheme */}
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm">
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Manage Loans - Cyan */}
            <button
              onClick={() => navigate('/admin/loans')}
              className="flex items-center gap-3 
                bg-cyan-100 hover:bg-cyan-200 text-cyan-900
                dark:bg-cyan-600 dark:hover:bg-cyan-700 dark:text-white
                py-3 px-4 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md hover:scale-105"
            >
              <FiCreditCard className="w-5 h-5" />
              <span className="font-medium">Manage Loans</span>
            </button>
            
            {/* Manage Users - Indigo */}
            <button
              onClick={() => navigate('/admin/users')}
              className="flex items-center gap-3 
                bg-indigo-100 hover:bg-indigo-200 text-indigo-900
                dark:bg-indigo-600 dark:hover:bg-indigo-700 dark:text-white
                py-3 px-4 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md hover:scale-105"
            >
              <FiUsers className="w-5 h-5" />
              <span className="font-medium">Manage Users</span>
            </button>
            
            {/* Pending Approvals - Orange */}
            <button
              onClick={() => navigate('/admin/loan-approvals')}
              className="flex items-center gap-3 
                bg-orange-100 hover:bg-orange-200 text-orange-900
                dark:bg-orange-600 dark:hover:bg-orange-700 dark:text-white
                py-3 px-4 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md hover:scale-105"
            >
              <FiCheckCircle className="w-5 h-5" />
              <span className="font-medium">Pending Approvals</span>
            </button>
            
            {/* Settings - Purple */}
            <button
              onClick={() => navigate('/admin/settings')}
              className="flex items-center gap-3 
                bg-purple-100 hover:bg-purple-200 text-purple-900
                dark:bg-purple-600 dark:hover:bg-purple-700 dark:text-white
                py-3 px-4 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md hover:scale-105"
            >
              <FiSettings className="w-5 h-5" />
              <span className="font-medium">Settings</span>
            </button>
          </div>
        </div>
      </div>

      {/* Recent Loans Table Component */}
      <RecentLoansTable 
        loans={loans} 
        page={page} 
        totalPages={totalPages} 
        setPage={setPage} 
      />
    </div>
  );
};

export default AdminDashboard;