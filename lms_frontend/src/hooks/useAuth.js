import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export const useAuth = () => {
  const { auth, login, logout } = useContext(AuthContext);

  return {
    token: auth.token,
    userRole: auth.userRole,
    isAuthenticated: auth.isAuthenticated,
    isLoading: auth.isLoading,
    login,
    logout,
  };
};
