import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useIsAuthenticated } from '../hooks';
import { useSelector } from 'react-redux';
import { LoadingSpinner } from '../components/Common';

/**
 * Protected Route Component - Only authenticated users can access
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Route component
 * @returns {JSX.Element}
 */
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = useIsAuthenticated();
  const location = useLocation();

  if (isAuthenticated === undefined) {
    return <LoadingSpinner text="Loading..." />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

/**
 * Public Route Component - Redirect to dashboard if already authenticated
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Route component
 * @returns {JSX.Element}
 */
const PublicRoute = ({ children }) => {
  const isAuthenticated = useIsAuthenticated();
  const { role } = useSelector(state => state.auth);
  const location = useLocation();

  if (isAuthenticated === undefined) {
    return <LoadingSpinner text="Loading..." />;
  }

  if (isAuthenticated) {
    // Redirect to appropriate dashboard based on role
    if (role === 'superadmin') {
      return <Navigate to="/dashboard/superadmin" state={{ from: location }} replace />;
    } else if (role === 'admin') {
      return <Navigate to="/dashboard/admin" state={{ from: location }} replace />;
    }
    return <Navigate to="/dashboard/user" state={{ from: location }} replace />;
  }

  return children;
};

/**
 * Unrestricted Route Component - Accessible to all users without auto-redirect
 * Use for pages like verify email, reset password that should work for both authenticated and unauthenticated users
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Route component
 * @returns {JSX.Element}
 */
const UnrestrictedRoute = ({ children }) => {
  const isAuthenticated = useIsAuthenticated();

  if (isAuthenticated === undefined) {
    return <LoadingSpinner text="Loading..." />;
  }

  // Allow access to everyone without redirects
  return children;
};

/**
 * Role-Based Route Component - Check user role before accessing route
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Route component
 * @param {Array<string>} props.allowedRoles - Array of allowed roles
 * @returns {JSX.Element}
 */
const RoleBasedRoute = ({ children, allowedRoles = [] }) => {
  const { role } = useSelector(state => state.auth);
  const location = useLocation();

  // If no specific roles are required, allow access
  if (allowedRoles.length === 0) {
    return children;
  }

  // Check if user's role is in allowed roles
  if (allowedRoles.includes(role)) {
    return children;
  }

  // Role not allowed - redirect to appropriate dashboard
  if (role === 'admin' || role === 'superadmin') {
    return <Navigate to="/dashboard/admin" state={{ from: location }} replace />;
  }

  return <Navigate to="/dashboard/user" state={{ from: location }} replace />;
};

export { ProtectedRoute, PublicRoute, UnrestrictedRoute, RoleBasedRoute };
