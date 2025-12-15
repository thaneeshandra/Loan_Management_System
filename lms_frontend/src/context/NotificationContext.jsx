// src/context/NotificationContext.jsx
import React, { createContext, useContext } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  // Enhanced notification function with default options
  const showNotification = (message, type = 'info', options = {}) => {
    const defaultOptions = {
      position: getPositionByType(type),
      autoClose: getAutoCloseByType(type),
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      className: getTailwindClass(type),
    };
    
    toast(message, { type, ...defaultOptions, ...options });
  };
  
  // Helper function to determine position based on notification type
  const getPositionByType = (type) => {
    switch(type) {
      case 'error':
      case 'warning':
        return "top-center"; // More attention-grabbing for important messages
      case 'success':
      case 'info':
      default:
        return "top-right"; // Less disruptive for informational messages
    }
  };
  
  // Helper function to determine autoClose duration based on notification type
  const getAutoCloseByType = (type) => {
    switch(type) {
      case 'error':
      case 'warning':
        return 5000; // Longer duration for errors/warnings (5 seconds)
      case 'success':
      case 'info':
      default:
        return 3000; // Shorter duration for success/info (3 seconds)
    }
  };
  
  // Helper function for Tailwind classes based on type - WHITE BACKGROUND with COLORED TEXT
  const getTailwindClass = (type) => {
    switch(type) {
      case 'success':
        return 'bg-white text-green-600 border-l-4 border-green-500 shadow-lg';
      case 'error':
        return 'bg-white text-red-600 border-l-4 border-red-500 shadow-lg';
      case 'warning':
        return 'bg-white text-yellow-600 border-l-4 border-yellow-500 shadow-lg';
      case 'info':
      default:
        return 'bg-white text-blue-600 border-l-4 border-blue-500 shadow-lg';
    }
  };
  
  // Convenience methods for different notification types
  const success = (message, options = {}) => showNotification(message, 'success', options);
  const error = (message, options = {}) => showNotification(message, 'error', options);
  const warning = (message, options = {}) => showNotification(message, 'warning', options);
  const info = (message, options = {}) => showNotification(message, 'info', options);

  return (
    <NotificationContext.Provider value={{ showNotification, success, error, warning, info }}>
      {children}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        toastClassName="shadow-md rounded-md overflow-hidden"
        style={{ marginTop: '70px' }} // Provides space below navbar
        limit={4} // Limit maximum simultaneous notifications
      />
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};
