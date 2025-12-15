import React, { useContext, useEffect } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import Navbar from '../components/layout/Navbar';

const AuthLayout = () => {
  const { auth, loading } = useContext(AuthContext);
  const navigate = useNavigate();
  const { info } = useNotification();

  useEffect(() => {
    if (!loading && auth?.token) {
      const intendedUrl =
        sessionStorage.getItem('intendedUrl') ||
        (auth?.userRole === 'ADMIN' ? '/admin' : '/dashboard');
      sessionStorage.removeItem('intendedUrl');
      navigate(intendedUrl);
    }
  }, [auth, loading, navigate, info]);

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="flex items-center justify-center min-h-[calc(100vh-64px)] text-lg font-semibold bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-200 transition-colors">
          Loading...
        </div>
      </>
    );
  }

  if (auth?.token) {
    return null;
  }

  return (
    <>
      <Navbar />
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-gray-100 dark:bg-gray-900 pt-4 transition-colors">
        <div className="w-1/2 min-w-[320px] max-w-[600px] p-6 bg-white dark:bg-gray-800 shadow-lg rounded-lg border border-gray-200 dark:border-gray-700 transition-colors">
          <main>
            <Outlet />
          </main>
        </div>
      </div>
    </>
  );
};

export default AuthLayout;
