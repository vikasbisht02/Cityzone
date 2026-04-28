/* eslint-disable no-unused-vars */
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  HomePage,
  LoginPage,
  RegisterPage,
  VerifyEmailPage,
  ForgotPasswordPage,
  ResetPasswordPage,
  UserDashboard,
  AdminDashboard,
  SuperAdminDashboard,
} from '../pages';
import { ProtectedRoute, PublicRoute, UnrestrictedRoute, RoleBasedRoute } from './ProtectedRoute';
import { initAuthStart, initAuthSuccess, initAuthFailure } from '../redux/slices/authSlice';
import { useGetCurrentUserQuery } from '../redux/api';
import { LoadingSpinner } from '../components/Common';

/**
 * Initialize Auth Component - Checks if user is still authenticated via cookie
 */
const AuthInitializer = ({ children }) => {
  const dispatch = useDispatch();
  const authInitialized = useSelector(state => state.auth.authInitialized);
  const { data: currentUserData, isLoading: isFetching, error: fetchError } = useGetCurrentUserQuery(undefined, {
    skip: authInitialized
  });

  // Handle auth initialization based on query state
  useEffect(() => {
    if (authInitialized) {
      return; // Already initialized
    }

    if (isFetching) {
      dispatch(initAuthStart());
    } else if (currentUserData) {
      dispatch(initAuthSuccess({ user: currentUserData.data }));
    } else if (fetchError) {
      dispatch(initAuthFailure());
    }
  }, [isFetching, currentUserData, fetchError, authInitialized, dispatch]);

  // Wait until auth initialization is complete before rendering routes
  if (!authInitialized) {
    return <LoadingSpinner text="Loading..." />;
  }

  return children;
};

/**
 * Dashboard Redirect - Route users to correct dashboard based on their role
 */
const DashboardRedirect = () => {
  const { role } = useSelector(state => state.auth);
  
  if (role === 'superadmin') {
    return <Navigate to="/dashboard/superadmin" replace />;
  } else if (role === 'admin') {
    return <Navigate to="/dashboard/admin" replace />;
  }
  return <Navigate to="/dashboard/user" replace />;
};

/**
 * App Routes Configuration with Role-Based Access
 * @returns {JSX.Element}
 */
const AppRoutes = () => {
  return (
    <Router>
      <AuthInitializer>
        <Routes>
        {/* ==================== PUBLIC ROUTES ==================== */}
        <Route path="/" element={<HomePage />} />

        <Route
          path="/login"
          element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          }
        />

        <Route
          path="/register"
          element={
            <PublicRoute>
              <RegisterPage />
            </PublicRoute>
          }
        />

        <Route
          path="/verify-email"
          element={
            <UnrestrictedRoute>
              <VerifyEmailPage />
            </UnrestrictedRoute>
          }
        />

        <Route
          path="/forgot-password"
          element={
            <PublicRoute>
              <ForgotPasswordPage />
            </PublicRoute>
          }
        />

        <Route
          path="/reset-password"
          element={
            <UnrestrictedRoute>
              <ResetPasswordPage />
            </UnrestrictedRoute>
          }
        />

        {/* ==================== PROTECTED USER ROUTES ==================== */}
        <Route
          path="/dashboard/user"
          element={
            <ProtectedRoute>
              <RoleBasedRoute allowedRoles={['user']}>
                <UserDashboard />
              </RoleBasedRoute>
            </ProtectedRoute>
          }
        />

        {/* ==================== PROTECTED ADMIN ROUTES ==================== */}
        <Route
          path="/dashboard/admin"
          element={
            <ProtectedRoute>
              <RoleBasedRoute allowedRoles={['admin']}>
                <AdminDashboard />
              </RoleBasedRoute>
            </ProtectedRoute>
          }
        />

        {/* ==================== PROTECTED SUPER ADMIN ROUTES ==================== */}
        <Route
          path="/dashboard/superadmin"
          element={
            <ProtectedRoute>
              <RoleBasedRoute allowedRoles={['superadmin']}>
                <SuperAdminDashboard />
              </RoleBasedRoute>
            </ProtectedRoute>
          }
        />

        {/* ==================== LEGACY ROUTE REDIRECTS ==================== */}
        <Route path="/dashboard" element={<DashboardRedirect />} />

        {/* ==================== 404 CATCH ALL ==================== */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
      </AuthInitializer>
    </Router>
  );
};

export default AppRoutes;
