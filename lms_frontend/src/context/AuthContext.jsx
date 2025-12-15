import React, { createContext, useState, useEffect } from "react";
import PropTypes from "prop-types";
import { login as loginAPI, logout as logoutAPI } from "../services/authService";

export const AuthContext = createContext();

/**
 * Authentication Context Provider
 * @param {object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 * @returns {JSX.Element} Provider component
 */
export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing authentication
    const token = localStorage.getItem("jwtToken");    const userRole = localStorage.getItem("userRole");
    const userName = localStorage.getItem("userName");
    const userId = localStorage.getItem("userId");
    
    if (token && userRole) {
      const authData = {
        token,
        userRole,
        userName,
        userId: userId ? parseInt(userId, 10) : null,
      };
      setAuth(authData);
      console.log("✅ User authenticated from localStorage:", { userRole, userName, userId });
    } else {
      console.log("ℹ️ No authentication data found - user needs to login");
    }

    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const response = await loginAPI(email, password);

      // Extract values from the response
      const token = response.token;
      const userRole = response.role;
      const userName = response.name;
      const userId = response.userId;

      if (!token) {
        throw new Error("No authentication token received");
      }      // Save auth data to state and localStorage
      const authData = { token, userRole, userName, userId };
      setAuth(authData);

      // Save to localStorage
      localStorage.setItem("jwtToken", token);
      localStorage.setItem("userRole", userRole);
      localStorage.setItem("userName", userName);
      localStorage.setItem("userId", userId.toString());

      console.log("✅ Login successful:", { userRole, userName, userId });
      return authData;    } catch (error) {
      console.error("❌ Login failed:", error.response?.data?.message || error.message);
      throw error;
    }
  };
  const logout = () => {
    console.log("🚪 User logging out");
    // Clear auth state
    setAuth(null);

    // Call the logout function
    logoutAPI();
  };
  // Auth context value
  const value = {
    auth,
    loading,
    login,
    logout,
    isAuthenticated: !!auth?.token,
    user: auth
      ? {
          role: auth.userRole,
          name: auth.userName,
          id: auth.userId,
        }
      : null,  };

  // Log auth state changes (only when auth changes, not on every render)
  React.useEffect(() => {
    if (!loading) {
      console.log("🔐 Auth state:", { 
        isAuthenticated: !!auth?.token, 
        userRole: auth?.userRole, 
        userName: auth?.userName 
      });
    }
  }, [auth, loading]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
