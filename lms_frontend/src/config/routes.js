// src/config/routes.js
export const routes = {
  home: '/',
  login: '/login',
  register: '/register',
  forgotPassword: '/forgot-password',

  // User
  userDashboard: '/dashboard',
  loanHistory: '/loans',
  loanApplication: '/apply',
  profile: '/profile',

  // Admin
  adminDashboard: '/admin',
  manageLoans: '/admin/loans',
  manageUsers: '/admin/users',
  systemSettings: '/admin/settings',
  loanApprovals: '/admin/loan-approvals',
  
  // Document Management
  adminDocuments: '/admin/documents',
  documentApprovals: '/admin/document-approvals',
};
