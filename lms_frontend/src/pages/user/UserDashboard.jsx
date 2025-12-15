import React, { useState, useEffect, useContext } from 'react';
import {
  FiCreditCard,
  FiCalendar,
  FiBell,
  FiFileText,
  FiPlusCircle,
  FiList
} from 'react-icons/fi';
import { fetchUserLoanStats, fetchUserLoansPaginated } from '../../services/loanService';
import { fetchUserNotifications } from '../../services/notificationService';
import { AuthContext } from '../../context/AuthContext';
import { ThemeContext } from '../../context/ThemeContext';
import StatCard from '../../components/user/StatCard';
import Pagination from '../../components/common/Pagination';
import RecentActivities from '../../components/common/RecentActivities';
import StatusBadge from '../../components/common/StatusBadge';
import QuickActions from '../../components/user/QuickActions';
import { formatCurrency, formatDate, getLoanTypeLabel } from '../../utils/format';

const UserDashboard = () => {
  const { auth } = useContext(AuthContext);
  const { theme } = useContext(ThemeContext);
  const [loanStats, setLoanStats] = useState({
    activeLoans: 0,
    totalAmount: 0,
    totalLoans: 0,
    notifications: 0
  });
  const [loans, setLoans] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const user = { name: auth?.userName || 'USER' };
  const isDarkMode = theme?.mode === 'dark';

  useEffect(() => {
    const loadData = async () => {
      try {
        // Use the new stats endpoint for better performance
        const stats = await fetchUserLoanStats();
        const data = await fetchUserLoansPaginated(page, 5);
        const notificationPage = await fetchUserNotifications(0, 20);
        const notifications = notificationPage.content || [];

        setLoans(data.content);
        setTotalPages(data.totalPages);
        setLoanStats({
          activeLoans: stats.activeLoans,
          totalAmount: stats.approvedAmount, // Use approved amount instead of total
          totalLoans: stats.totalLoans,
          notifications: notifications.filter(n => !n.isRead).length
        });
        setRecentActivities(notifications.slice(0, 3));
      } catch (error) {
        console.error('Failed to load dashboard data:', error);
        setLoanStats({ activeLoans: 0, totalAmount: 0, totalLoans: 0, notifications: 0 });
        setRecentActivities([]);
      }
    };
    loadData();
  }, [page]);

  return (
    <div className={`p-6 rounded-lg shadow-md ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-800'}`}>
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Welcome back, {user.name} 👋</h1>
        <p className="text-gray-600 dark:text-gray-400">Manage your loans and account information</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard title="Active Loans" value={loanStats.activeLoans} icon={<FiCreditCard />} color="blue" />
        <StatCard title="Approved Amount" value={formatCurrency(loanStats.totalAmount)} icon={<FiFileText />} color="green" />
        <StatCard title="Loans Applied" value={loanStats.totalLoans} icon={<FiCalendar />} color="yellow" />
        <StatCard title="Notifications" value={loanStats.notifications} icon={<FiBell />} color="purple" />
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <QuickActions
            icon={<FiPlusCircle size={24} />}
            title="Apply for a New Loan"
            to="/apply"
            color='green'
          />
          <QuickActions
            icon={<FiList size={24} />}
            title="View Loan History"
            to="/loans/my-loans"
            color='blue'
          />
        </div>
      </div>

      {/* Recent Loans */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-4">Recent Loans</h2>
        <div className="bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-lg overflow-hidden">
          <table className="min-w-full table-auto text-sm text-left">
            <thead className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
              <tr>
                <th className="px-4 py-2">Loan Type</th>
                <th className="px-4 py-2">Amount</th>
                <th className="px-4 py-2">Status</th>
                <th className="px-4 py-2">Date</th>
              </tr>
            </thead>
            <tbody>
              {loans.map(loan => (
                <tr key={loan.id} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-4 py-2">{getLoanTypeLabel(loan.loanType)}</td>
                  <td className="px-4 py-2">{formatCurrency(loan.amountRequested)}</td>
                  <td className="px-4 py-2"><StatusBadge status={loan.status} /></td>
                  <td className="px-4 py-2">{formatDate(loan.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <Pagination
          currentPage={page + 1}
          totalPages={totalPages}
          onPageChange={(newPage) => setPage(newPage - 1)}
        />
      </div>

      {/* Recent Activities */}
      <RecentActivities activities={recentActivities} formatDate={formatDate} />
    </div>
  );
};

export default UserDashboard;
