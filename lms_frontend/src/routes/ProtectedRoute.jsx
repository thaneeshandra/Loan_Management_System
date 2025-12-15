// src/routes/ProtectedRoute.jsx
import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import PropTypes from 'prop-types';

const ProtectedRoute = ({ roles }) => {
  const { auth } = useContext(AuthContext);

  const isAuthenticated = !!auth?.token;
  const userRole = auth?.userRole;

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (roles && !roles.includes(userRole)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};
ProtectedRoute.propTypes = {
  roles: PropTypes.arrayOf(PropTypes.string)
};

export default ProtectedRoute;

