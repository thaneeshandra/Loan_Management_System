import React, { useContext } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import AdminSidebar from '../components/layout/AdminSidebar';
import ThemeToggle from '../components/common/ThemeToggle';
import Breadcrumbs from '../components/common/BreadCrumbs';
import Navbar from '../components/layout/Navbar';
import { FiCalendar, FiUser } from 'react-icons/fi';

const AdminLayout = () => {
  const { logout, auth } = useContext(AuthContext);
  const { theme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const currentDate = new Date().toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300">
      {/* Fixed Navbar */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <Navbar />
      </div>

      {/* Main layout with top padding for fixed navbar */}
      <div className="flex pt-16">
        {/* Render the Self-Managing Sidebar */}
        <AdminSidebar onLogout={handleLogout} />

        {/* Content Area */}
        <div className="flex-1 flex flex-col min-h-screen">
          {/* Enhanced Desktop Header */}
          <header className="hidden md:flex justify-between items-center sticky top-16 z-20 px-6 py-4 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700 shadow-sm">
            <div className="flex items-center space-x-4">
              {/* Enhanced User Icon Container */}
              <div className="p-3 rounded-xl bg-blue-100 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 shadow-sm">
                <FiUser className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                  Welcome back, {auth?.user?.name || auth?.userRole}
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Manage your loan management system efficiently
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {/* Enhanced Theme Toggle */}
              <div className="p-1 rounded-lg bg-gray-100 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-700 shadow-sm">
                <ThemeToggle />
              </div>
              {/* Enhanced Date Container */}
              <div className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 shadow-sm">
                <FiCalendar className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                  {currentDate}
                </span>
              </div>
            </div>
          </header>

          {/* Enhanced Page Content */}
          <main className="flex-1 bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
            <div className="p-6 md:p-8">
              {/* Enhanced Breadcrumbs Container */}
              <div className="mb-6 p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
                <Breadcrumbs />
              </div>
              
              {/* Content with enhanced background */}
              <div className="space-y-6">
                <Outlet />
              </div>
            </div>
          </main>

          {/* Enhanced Footer */}
          <footer className="text-center py-6 text-sm text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 shadow-inner">
            <div className="flex items-center justify-center space-x-3">
              <span className="text-gray-600 dark:text-gray-400">&copy; {new Date().getFullYear()}</span>
              <span className="px-3 py-1.5 rounded-lg text-sm font-semibold bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 shadow-sm">
                LMS Admin Portal
              </span>
              <span className="text-gray-600 dark:text-gray-400">All rights reserved.</span>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
