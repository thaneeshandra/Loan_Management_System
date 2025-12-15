// New file: src/components/admin/ReportingDashboard.jsx
import React, { useState, useEffect } from 'react';
import { Line, Bar, Pie, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { useLoan } from '../../hooks/useLoans';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const ReportingDashboard = () => {
  const { getDashboardAnalytics, getLoanStatistics, loading } = useLoan();
  const [dashboardData, setDashboardData] = useState(null);
  const [timeRange, setTimeRange] = useState('30d');

  useEffect(() => {
    loadDashboardData();
  }, [timeRange]);

  const loadDashboardData = async () => {
    try {
      const analytics = await getDashboardAnalytics({ range: timeRange });
      const statistics = await getLoanStatistics({ range: timeRange });
      
      setDashboardData({
        ...analytics,
        statistics
      });
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    }
  };

  // Sample chart configurations
  const loanTrendsData = {
    labels: dashboardData?.monthlyData?.labels || [],
    datasets: [
      {
        label: 'Loan Applications',
        data: dashboardData?.monthlyData?.applications || [],
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.1,
      },
      {
        label: 'Approved Loans',
        data: dashboardData?.monthlyData?.approved || [],
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        tension: 0.1,
      }
    ],
  };

  const statusDistributionData = {
    labels: ['Approved', 'Pending', 'Rejected'],
    datasets: [
      {
        data: [
          dashboardData?.statusCounts?.approved || 0,
          dashboardData?.statusCounts?.pending || 0,
          dashboardData?.statusCounts?.rejected || 0,
        ],
        backgroundColor: [
          'rgba(34, 197, 94, 0.8)',
          'rgba(251, 191, 36, 0.8)',
          'rgba(239, 68, 68, 0.8)',
        ],
      },
    ],
  };

  if (loading) {
    return <div className="flex justify-center p-8">Loading dashboard...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Time Range Selector */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Reporting Dashboard</h1>
        <select 
          value={timeRange} 
          onChange={(e) => setTimeRange(e.target.value)}
          className="px-4 py-2 border rounded-lg"
        >
          <option value="7d">Last 7 Days</option>
          <option value="30d">Last 30 Days</option>
          <option value="90d">Last 90 Days</option>
          <option value="1y">Last Year</option>
        </select>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Total Loans</h3>
          <p className="text-2xl font-bold text-gray-900">
            {dashboardData?.kpis?.totalLoans || 0}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Approval Rate</h3>
          <p className="text-2xl font-bold text-green-600">
            {dashboardData?.kpis?.approvalRate || 0}%
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Total Disbursed</h3>
          <p className="text-2xl font-bold text-blue-600">
            ${dashboardData?.kpis?.totalDisbursed?.toLocaleString() || 0}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Avg Loan Amount</h3>
          <p className="text-2xl font-bold text-purple-600">
            ${dashboardData?.kpis?.avgLoanAmount?.toLocaleString() || 0}
          </p>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Loan Trends Chart */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Loan Trends</h3>
          <Line data={loanTrendsData} options={{ responsive: true }} />
        </div>

        {/* Status Distribution Chart */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Status Distribution</h3>
          <Doughnut data={statusDistributionData} options={{ responsive: true }} />
        </div>
      </div>
    </div>
  );
};

export default ReportingDashboard;