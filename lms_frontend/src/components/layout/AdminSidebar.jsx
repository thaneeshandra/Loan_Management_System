import React, { useState, useContext } from 'react';
import { NavLink } from 'react-router-dom';
import {
  FiHome, FiUsers, FiSettings, FiCreditCard, FiFileText,
  FiBarChart2, FiCheckCircle, FiAlertCircle, FiDollarSign, FiBell,
  FiShield, FiDownload, FiHelpCircle, FiMenu, FiX, FiChevronLeft, FiChevronRight,
  FiEye
} from 'react-icons/fi';
import { ThemeContext } from '../../context/ThemeContext';

const AdminSidebar = () => {
  const { theme } = useContext(ThemeContext);
  const [isOpen, setIsOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const isDarkMode = theme?.mode === 'dark';

  const navItemClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 whitespace-nowrap ${
      isActive 
        ? 'bg-indigo-100 text-indigo-700 font-semibold dark:bg-indigo-900/50 dark:text-indigo-300 shadow-sm' 
        : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 hover:shadow-sm'
    } ${isCollapsed ? 'justify-center px-3' : ''}`;

  const navItems = [
    { to: '/admin', label: 'Dashboard', icon: <FiHome /> },
    { section: 'Loan Management' },
    { to: '/admin/loans', label: 'All Loans', icon: <FiCreditCard /> },
    { to: '/admin/loan-approvals', label: 'Loan Approvals', icon: <FiCheckCircle /> },
    { section: 'Document Management' },
    { to: '/admin/documents', label: 'All Documents', icon: <FiFileText /> },
    { to: '/admin/document-approvals', label: 'Document Approvals', icon: <FiCheckCircle /> },
    { section: 'User Management' },
    { to: '/admin/users', label: 'Manage Users', icon: <FiUsers /> },
    { to: '/admin/user-verification', label: 'User Verification', icon: <FiShield /> },
    // { section: 'Reports & Analytics' },
    // { to: '/admin/analytics', label: 'Analytics', icon: <FiBarChart2 /> },
    // { to: '/admin/reports', label: 'Reports', icon: <FiFileText /> },
    // { to: '/admin/export-data', label: 'Export Data', icon: <FiDownload /> },
    { section: 'System' },
    // { to: '/admin/notifications', label: 'Notifications', icon: <FiBell /> },
    { to: '/admin/settings', label: 'System Settings', icon: <FiSettings /> },
    { to: '/admin/help', label: 'Help & Support', icon: <FiHelpCircle /> },
  ];

  return (
    <>
      {/* Mobile Toggle Button - Improved dark mode styling */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`md:hidden fixed top-20 left-4 z-50 p-3 rounded-lg shadow-lg transition-all duration-200 ${
          isDarkMode 
            ? 'bg-gray-800 text-gray-100 hover:bg-gray-700 border border-gray-600' 
            : 'bg-indigo-600 text-white hover:bg-indigo-700'
        }`}
        aria-label={isOpen ? 'Close menu' : 'Open menu'}
      >
        {isOpen ? <FiX className="w-5 h-5" /> : <FiMenu className="w-5 h-5" />}
      </button>

      {/* Mobile Overlay - Enhanced for dark mode */}
      {isOpen && (
        <div 
          className={`fixed inset-0 z-40 md:hidden transition-opacity duration-300 ${
            isDarkMode ? 'bg-black bg-opacity-75' : 'bg-black bg-opacity-50'
          }`}
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside className={`h-[calc(100vh-4rem)] shadow-lg fixed top-16 left-0 z-30 flex flex-col transform transition-all duration-300 ease-in-out ${
        isDarkMode 
          ? 'bg-gray-900 border-r border-gray-700 text-gray-100' 
          : 'bg-white border-r border-gray-200 text-gray-800'
      } ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } ${isCollapsed ? 'w-20' : 'w-64'} md:translate-x-0`}>
        
        {/* Header - Improved dark mode */}
        <div className={`border-b flex-shrink-0 relative ${
          isDarkMode ? 'border-gray-700' : 'border-gray-200'
        } ${isCollapsed ? 'p-4' : 'p-6'}`}>
          {!isCollapsed ? (
            <>
              <h1 className={`text-xl font-bold ${
                isDarkMode ? 'text-indigo-400' : 'text-indigo-600'
              }`}>
                Admin Panel
              </h1>
              <p className={`text-sm mt-1 ${
                isDarkMode ? 'text-gray-400' : 'text-gray-500'
              }`}>
                Loan Management System
              </p>
            </>
          ) : (
            <div className="flex justify-center">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                isDarkMode ? 'bg-indigo-500' : 'bg-indigo-600'
              }`}>
                <span className="text-white font-bold text-sm">A</span>
              </div>
            </div>
          )}
          
          {/* Desktop Collapse Toggle - Better dark mode */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className={`hidden md:block absolute -right-3 top-1/2 transform -translate-y-1/2 border-2 rounded-full p-1 transition-colors ${
              isDarkMode 
                ? 'bg-gray-800 border-gray-600 hover:bg-gray-700 text-gray-400' 
                : 'bg-white border-gray-200 hover:bg-gray-50 text-gray-600'
            }`}
            title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
            aria-label={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            {isCollapsed ? 
              <FiChevronRight className="w-3 h-3" /> : 
              <FiChevronLeft className="w-3 h-3" />
            }
          </button>
        </div>

        {/* Navigation - Enhanced scrollbar for dark mode */}
        <nav className={`flex-1 p-3 space-y-1 overflow-y-auto ${
          isDarkMode ? 'scrollbar-dark' : 'scrollbar-light'
        }`}>
          {navItems.map((item, index) => {
            if (item.section) {
              return !isCollapsed && (
                <div 
                  key={index} 
                  className={`text-xs font-semibold uppercase tracking-wider px-3 py-3 mt-4 first:mt-0 ${
                    isDarkMode ? 'text-gray-500' : 'text-gray-400'
                  }`}
                >
                  {item.section}
                </div>
              );
            }

            return (
              <NavLink 
                key={index} 
                to={item.to} 
                className={navItemClass}
                title={isCollapsed ? item.label : undefined}
                onClick={() => window.innerWidth < 768 && setIsOpen(false)}
              >
                <span className="flex-shrink-0">{item.icon}</span>
                {!isCollapsed && <span className="truncate">{item.label}</span>}
              </NavLink>
            );
          })}
        </nav>

        {/* Footer - Improved dark mode styling */}
        <div className={`p-3 border-t flex-shrink-0 ${
          isDarkMode ? 'border-gray-700' : 'border-gray-200'
        }`}>
          <div className={`flex items-center gap-3 ${
            isDarkMode ? 'text-gray-400' : 'text-gray-500'
          } ${isCollapsed ? 'justify-center px-3' : 'px-3'}`}>
            {!isCollapsed ? (
              <span className="text-xs">LMS Admin v1.0</span>
            ) : (
              <span className="text-xs">v1.0</span>
            )}
          </div>
        </div>
      </aside>

      {/* Spacer for layout */}
      <div className={`hidden md:block transition-all duration-300 ${isCollapsed ? 'w-20' : 'w-64'}`} />
    </>
  );
};

export default AdminSidebar;
