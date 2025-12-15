import React from 'react';
import { 
  FiHome, 
  FiCreditCard, 
  FiFileText, 
  FiDollarSign, 
  FiUser, 
  FiSettings,
  FiHelpCircle
} from 'react-icons/fi';

/**
 * User sidebar navigation configuration
 */
export const userNavigationItems = [
  {
    id: 'dashboard',
    title: 'Dashboard',
    icon: <FiHome size={18} />,
    path: '/dashboard',
    subItems: []
  },  {
    id: 'loans',
    title: 'Loan Management',
    icon: <FiCreditCard size={18} />,
    subItems: [
      { title: 'Apply for Loan', path: '/apply' },
      { title: 'Loan History', path: '/loans/my-loans' },
      { title: 'Make Payment', path: '/payment' }
    ]
  },{
    id: 'documents',
    title: 'Documents',
    icon: <FiFileText size={18} />,
    subItems: [
      { title: 'Upload Documents', path: '/upload-documents' },
      { title: 'View Documents', path: '/view-documents' }
    ]
  },
  {
    id: 'transactions',
    title: 'Transactions',
    icon: <FiDollarSign size={18} />,
    path: '/transactions',
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
    id: 'settings',
    title: 'Settings',
    icon: <FiSettings size={18} />,
    path: '/settings',
    subItems: []
  },
  {
    id: 'help',
    title: 'Help & Support',
    icon: <FiHelpCircle size={18} />,
    path: '/help',
    subItems: []
  }
];

/**
 * Admin sidebar navigation configuration
 */
export const adminNavigationItems = [
  {
    id: 'dashboard',
    title: 'Dashboard',
    icon: <FiHome size={18} />,
    path: '/admin',
    subItems: []
  },
  {
    id: 'loanManagement',
    title: 'Loan Management',
    icon: <FiCreditCard size={18} />,
    subItems: [
      { title: 'All Loans', path: '/admin/loans' },
      { title: 'Loan Applications', path: '/admin/loans/applications' },
      { title: 'Loan Approvals', path: '/admin/loans/approvals' }
    ]
  },
  {
    id: 'userManagement',
    title: 'User Management',
    icon: <FiUser size={18} />,
    path: '/admin/users',
    subItems: []
  },
  {
    id: 'settings',
    title: 'System Settings',
    icon: <FiSettings size={18} />,
    path: '/admin/settings',
    subItems: []
  }
];