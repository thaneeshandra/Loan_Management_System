import { useState, useContext, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import api from '../../services/api';
import { ThemeContext } from '../../context/ThemeContext';

import { 
  FiHome, FiCreditCard, FiUser, 
  FiFileText, FiDollarSign, FiChevronRight,
  FiHelpCircle, FiBell
} from 'react-icons/fi';


const UserSidebar = () => {
  const location = useLocation();
  const { theme } = useContext(ThemeContext);
  const [expandedSection, setExpandedSection] = useState('');

  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? '' : section);
  };
  
  // Helper to check if the current route matches
  const isActive = (path) => location.pathname === path;
  const isSubActive = (path) => {
    // Special case for loan paths
    if (path === '/loans/my-loans' && location.pathname.match(/^\/loans\/\d+$/)) {
      // This will match paths like /loans/1, /loans/42, etc.
      return true;
    }
    return location.pathname.includes(path);
  };

  const [user, setUser] = useState({ name: '' });

  useEffect(() => {
  const fetchUser = async () => {
    try {
      const response = await api.get('/users/me');
      setUser(response.data);
    } catch (error) {
      console.error('Failed to fetch user:', error);
    }
  };

  fetchUser();
}, []);

// Add this useEffect to auto-expand sections with active subitems
useEffect(() => {
  menuItems.forEach(item => {
    if (item.subItems && item.subItems.length > 0) {
      const hasActiveSubItem = item.subItems.some(
        subItem => location.pathname.includes(subItem.path.split('/')[1])
      );
      if (hasActiveSubItem) {
        setExpandedSection(item.id);
      }
    }
  });
}, [location.pathname]);



  // Menu items structure
  const menuItems =  [
    {
      id: 'dashboard',
      title: 'Dashboard',
      icon: <FiHome size={18} />,
      path: '/dashboard',
      subItems: []
    },
    {
      id: 'loans',
      title: 'Loan Management',
      icon: <FiCreditCard size={18} />,
      subItems: [
        { title: 'Apply for Loan', path: '/apply' },
        { title: 'Loan History', path: '/loans/my-loans' }
      ]
    },
    {
      id: 'documents',
      title: 'Documents',
      icon: <FiFileText size={18} />,
      subItems: [
        { title: 'Upload Documents', path: '/upload-documents' },
        { title: 'View Documents', path: '/view-documents' }
      ]
    },
    // {
    //   id: 'payments',
    //   title: 'Payments',
    //   icon: <FiDollarSign size={18} />,
    //   subItems: [
    //     { title: 'Make Payment', path: '/make-payment' },
    //     { title: 'Payment History', path: '/payment-history' }
    //   ]
    // },
    {
      id: 'notifications',
      title: 'Notifications',
      icon: <FiBell size={18} />,
      path: '/user/notifications', // <-- updated path
      subItems: []
    },
    {
      id: 'profile',
      title: 'My Profile',
      icon: <FiUser size={18} />,
      path: '/profile',
      subItems: []
    },
    {
      id: 'help',
      title: 'Help & Support',
      icon: <FiHelpCircle size={18} />,
      path: '/support',
      subItems: []
    }
  ];

  // Dark mode classes
  const bgClass = theme?.mode === 'dark' ? 'bg-gray-900' : 'bg-white';
  const textClass = theme?.mode === 'dark' ? 'text-gray-100' : 'text-gray-700';
  const headerBgClass = theme?.mode === 'dark' ? 'bg-blue-800' : 'bg-blue-600';
  const borderClass = theme?.mode === 'dark' ? 'border-gray-700' : 'border-gray-200';

  return (
    <div className={`h-full ${bgClass} shadow-lg rounded-lg overflow-hidden transition-colors duration-300`}>
      {/* User Profile Summary */}
      <div className={`${headerBgClass} text-white p-6`}>
        <div className="w-16 h-16 rounded-full bg-white text-blue-600 flex items-center justify-center text-xl font-bold mx-auto mb-2">
          {user.name ? user.name.split(' ').map(n => n[0]).join('') : 'U'}
        </div>
        <h3 className="text-center font-medium">{user.name || 'User'}</h3>
        <p className="text-center text-blue-200 text-sm">Premium Member</p>
      </div>

      {/* Navigation Menu */}
      <div className="p-4">
        <nav>
          <ul className="space-y-1">
            {menuItems.map((item) => (
              <li key={item.id} className="mb-1">
                {item.subItems.length === 0 ? (
                  // Menu item without sub-items
                  <Link
                    to={item.path}
                    className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
                      isActive(item.path)
                        ? 'bg-blue-50 dark:bg-blue-900 text-blue-700 dark:text-blue-200'
                        : `${textClass} hover:bg-gray-100 dark:hover:bg-gray-800`
                    }`}
                  >
                    <span className="mr-3">{item.icon}</span>
                    <span>{item.title}</span>
                  </Link>
                ) : (
                  // Menu item with sub-items
                  <>
                    <button
                      onClick={() => toggleSection(item.id)}
                      className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-colors ${
                        expandedSection === item.id || item.subItems.some(sub => isSubActive(sub.path))
                          ? 'bg-blue-50 dark:bg-blue-900 text-blue-700 dark:text-blue-200'
                          : `${textClass} hover:bg-gray-100 dark:hover:bg-gray-800`
                      }`}
                    >
                      <div className="flex items-center">
                        <span className="mr-3">{item.icon}</span>
                        <span>{item.title}</span>
                      </div>
                      <FiChevronRight
                        className={`transform transition-transform ${
                          expandedSection === item.id ? 'rotate-90' : ''
                        }`}
                      />
                    </button>
                    {expandedSection === item.id && (
                      <ul className="pl-12 mt-1 space-y-1">
                        {item.subItems.map((subItem, index) => (
                          <li key={index}>
                            <Link
                              to={subItem.path}
                              className={`block py-2 px-3 rounded-md text-sm ${
                                isActive(subItem.path)
                                  ? 'bg-blue-100 dark:bg-blue-800 text-blue-700 dark:text-blue-200'
                                  : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                              }`}
                            >
                              {subItem.title}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </>
                )}
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div className={`p-4 mt-4 border-t ${borderClass}`}>
        <div className="bg-blue-50 dark:bg-blue-900 rounded-lg p-4">
          <p className="text-sm text-blue-800 dark:text-blue-200">Need help with your loan?</p>
          <button className="mt-2 w-full py-2 px-4 bg-blue-600 dark:bg-blue-700 text-white rounded-md text-sm hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors">
            Contact Support
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserSidebar;