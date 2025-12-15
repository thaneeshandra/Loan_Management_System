// src/routes/AppRouter.jsx
import React, { useContext } from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { ROLES } from '../config/roles';
import Loading from '../components/common/Loading';
import ProtectedRoute from './ProtectedRoute';

// Layouts
import UserLayout from '../layouts/UserLayout';
import AdminLayout from '../layouts/AdminLayout';
import AuthLayout from '../layouts/AuthLayout';
import AdminLoanDetails from '../components/admin/AdminLoanDetails';

// Pages
const HomePage = React.lazy(() => import('../pages/HomePage'));
const LoginPage = React.lazy(() => import('../pages/auth/LoginPage'));
const RegisterPage = React.lazy(() => import('../pages/auth/RegisterPage'));
const ForgotPasswordPage = React.lazy(() => import('../pages/auth/ForgotPasswordPage'));

const UserDashboard = React.lazy(() => import('../pages/user/UserDashboard'));
const LoanHistory = React.lazy(() => import('../pages/user/LoanHistory'));
const LoanApplicationForm = React.lazy(() => import('../pages/user/LoanApplicationForm'));
const Profile = React.lazy(() => import('../pages/user/Profile'));
const LoanDetails = React.lazy(() => import('../pages/user/LoanDetails'));
const UploadDocuments = React.lazy(() => import('../pages/user/UploadDocuments'));
const ViewDocuments = React.lazy(() => import('../pages/user/ViewDocuments'));
const UserNotifications = React.lazy(() => import('../pages/user/UserNotifications'));

const AdminDashboard = React.lazy(() => import('../pages/admin/AdminDashboard'));
const ManageLoans = React.lazy(() => import('../pages/admin/ManageLoans'));
const ManageUsers = React.lazy(() => import('../pages/admin/ManageUsers'));
const SystemSettings = React.lazy(() => import('../pages/admin/SystemSettings'));
const LoanApprovals = React.lazy(() => import('../pages/admin/LoanApprovals'));
const ViewAdminDocuments = React.lazy(() => import('../pages/admin/ViewAdminDocuments'));
const DocumentApprovals = React.lazy(() => import('../pages/admin/DocumentApprovals'));

const NotFoundPage = React.lazy(() => import('../pages/NotFoundPage'));

const AppRouter = () => {
  useContext(AuthContext);

  return (
    <React.Suspense fallback={<Loading />}>
      {/* <Navbar /> */}
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        </Route>        {/* User Routes */}
        <Route element={<ProtectedRoute roles={[ROLES.USER, ROLES.ADMIN]} />}>
          <Route element={<UserLayout />}>
            <Route path="/dashboard" element={<UserDashboard />} />
            <Route path="/loans/my-loans" element={<LoanHistory />} />
            <Route path="/apply" element={<LoanApplicationForm />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/loans/:id" element={<LoanDetails />} />
            <Route path="/upload-documents" element={<UploadDocuments />} />
            <Route path="/view-documents" element={<ViewDocuments />} />
            <Route path="/user/notifications" element={<UserNotifications />} />
          </Route>
        </Route>

        {/* Admin Routes */}
        <Route element={<ProtectedRoute roles={[ROLES.ADMIN]} />}>
          <Route element={<AdminLayout />}>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/loans" element={<ManageLoans />} />
            <Route path="/admin/loan-approvals" element={<LoanApprovals />} />
            <Route path='/admin/loans/:id' element={<AdminLoanDetails />} />
            <Route path="/admin/users" element={<ManageUsers />} />
            <Route path="/admin/settings" element={<SystemSettings />} />
            {/* Document Management Routes */}
            <Route path="/admin/documents" element={<ViewAdminDocuments />} />
            <Route path="/admin/document-approvals" element={<DocumentApprovals />} />
          </Route>
        </Route>

        {/* Fallback */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </React.Suspense>
  );
};

export default AppRouter;
