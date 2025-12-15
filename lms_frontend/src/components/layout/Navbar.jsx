import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { ThemeContext } from '../../context/ThemeContext';

const Navbar = () => {
  const { auth, logout } = useContext(AuthContext);
  const { theme, toggleTheme } = useContext(ThemeContext);
  const isAuthenticated = !!auth?.token;
  const userRole = auth?.userRole;

  const isDarkMode = theme?.mode === 'dark' || theme?.theme === 'dark' || theme?.isDark === true;

  return (
    <nav className="bg-white dark:bg-gray-900 shadow-md dark:shadow-gray-900/50 w-full sticky top-0 z-50 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        
        {/* Left: Logo & Navigation Links */}
        <div className="flex items-center space-x-6">
          {/* Logo */}
          <Link 
            to="/" 
            className="text-xl font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
          >
            LoanManager
          </Link>

          {/* Navigation Links - All with consistent padding for alignment */}
          <Link 
            to="/" 
            className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            Home
          </Link>

          {!isAuthenticated ? (
            <>
              <Link 
                to="/login" 
                className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                Login
              </Link>
              <Link 
                to="/register" 
                className="bg-blue-600 dark:bg-blue-700 text-white px-4 py-2 rounded-md hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors font-medium shadow-sm"
              >
                Register
              </Link>
            </>
          ) : (
            <>
              {userRole === 'ADMIN' && (
                <Link 
                  to="/admin" 
                  className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  Admin
                </Link>
              )}
              {userRole === 'USER' && (
                <Link 
                  to="/dashboard" 
                  className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  Dashboard
                </Link>
              )}
              
              <div className="flex items-center space-x-3 ml-6 pl-6 border-l border-gray-200 dark:border-gray-700">
                <button
                  onClick={logout}
                  className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 font-medium transition-colors px-3 py-2 rounded-md hover:bg-red-50 dark:hover:bg-red-900/20"
                >
                  Logout
                </button>
              </div>
            </>
          )}
        </div>

        {/* Right: Theme Toggle */}
        <div className="flex items-center">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            <span className="text-xl">
              {isDarkMode ? '🌙' : '☀️'}
            </span>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
