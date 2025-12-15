import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import UserSidebar from '../components/layout/UserSidebar';
import { useTheme } from '../context/ThemeContext';
import ThemeToggle from '../components/common/ThemeToggle';

const UserLayout = () => {
  const { theme } = useTheme();

  const bgClass = theme.mode === 'dark' ? 'bg-gray-900' : 'bg-gray-100';
  const contentBgClass = theme.mode === 'dark' ? 'bg-gray-800' : 'bg-white';
  const textClass = theme.mode === 'dark' ? 'text-gray-200' : 'text-gray-800';

  return (
    <div className={`min-h-screen ${bgClass} ${textClass} transition-colors duration-300`}>
      <Navbar />
      <div className="container mx-auto py-6 px-4">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar */}
          <div className="w-full md:w-64 flex-shrink-0">
            <UserSidebar />
          </div>

          {/* Main Content */}
          <div className={`flex-grow rounded-lg shadow-md ${contentBgClass} p-4 transition-colors duration-300`}>
            <header className="flex justify-end mb-4">
              <ThemeToggle />
            </header>
            <main>
              <Outlet />
            </main>
            <footer className="mt-6 text-sm text-center text-gray-500">
              &copy; {new Date().getFullYear()} LMS. All rights reserved.
            </footer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserLayout;
