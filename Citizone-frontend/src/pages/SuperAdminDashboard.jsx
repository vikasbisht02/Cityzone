import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../components/Layout/MainLayout';
import { Card, Button, LoadingSpinner, Alert } from '../components/Common';
import { useGetCurrentUserQuery } from '../redux/api';
import { setUser } from '../redux/slices/authSlice';

/**
 * Super Admin Dashboard - Full system control
 * @returns {JSX.Element}
 */
const SuperAdminDashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, isAuthenticated, isLoading, role } = useSelector(state => state.auth);
  const { data: currentUserData, isLoading: isFetchingUser, error: fetchError } = useGetCurrentUserQuery(undefined, {
    skip: !!user || !isAuthenticated
  });

  useEffect(() => {
    if (!isAuthenticated || role !== 'superadmin') {
      navigate('/login');
      return;
    }

    if (currentUserData && !user) {
      dispatch(setUser(currentUserData.data));
    }
  }, [isAuthenticated, user, navigate, dispatch, role, currentUserData]);

  if (!isAuthenticated || role !== 'superadmin') {
    return null;
  }

  if (isLoading || isFetchingUser) {
    return (
      <MainLayout>
        <LoadingSpinner text="Loading super admin panel..." />
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">🔐 Super Admin Dashboard</h1>
            <p className="text-gray-600 mt-2">Full system control - Welcome {user?.name}!</p>
          </div>
          <Alert type="warning">
            <strong>Super Admin Access</strong> - All systems unlocked
          </Alert>
        </div>

        {/* System Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card title="Total Users" className="bg-gradient-to-br from-blue-50 to-blue-100">
            <div className="text-4xl font-bold text-blue-600">0</div>
            <p className="text-sm text-gray-600 mt-2">All users in system</p>
          </Card>

          <Card title="Admin Accounts" className="bg-gradient-to-br from-purple-50 to-purple-100">
            <div className="text-4xl font-bold text-purple-600">0</div>
            <p className="text-sm text-gray-600 mt-2">Admin + SuperAdmin</p>
          </Card>

          <Card title="System Health" className="bg-gradient-to-br from-green-50 to-green-100">
            <div className="text-4xl font-bold text-green-600">100%</div>
            <p className="text-sm text-gray-600 mt-2">All services online</p>
          </Card>

          <Card title="Alerts" className="bg-gradient-to-br from-red-50 to-red-100">
            <div className="text-4xl font-bold text-red-600">0</div>
            <p className="text-sm text-gray-600 mt-2">Active issues</p>
          </Card>
        </div>

        {/* System Management */}
        <Card title="🔧 System Management" className="border-l-4 border-l-red-600">
          <div className="space-y-4">
            <p className="text-gray-600 text-sm font-medium">Full system administration and control</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Button variant="primary" className="w-full justify-center">
                👥 All Users
              </Button>
              <Button variant="primary" className="w-full justify-center">
                👨‍💼 Admins
              </Button>
              <Button variant="secondary" className="w-full justify-center">
                🔐 Permissions
              </Button>
              <Button variant="secondary" className="w-full justify-center">
                ⚠️ Reports
              </Button>
            </div>
          </div>
        </Card>

        {/* Admin User Management */}
        <Card title="🛡️ Admin Management" className="border-l-4 border-l-purple-600">
          <div className="space-y-4">
            <p className="text-gray-600 text-sm font-medium">Manage admin and super admin accounts</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button variant="primary" className="w-full justify-center">
                Create Admin
              </Button>
              <Button variant="secondary" className="w-full justify-center">
                View Admins
              </Button>
              <Button variant="secondary" className="w-full justify-center">
                Admin Activity
              </Button>
            </div>
          </div>
        </Card>

        {/* System Settings */}
        <Card title="⚙️ System Settings" className="border-l-4 border-l-blue-600">
          <div className="space-y-4">
            <p className="text-gray-600 text-sm font-medium">Configure system-wide settings and policies</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button variant="secondary" className="w-full justify-center">
                Configuration
              </Button>
              <Button variant="secondary" className="w-full justify-center">
                Email Settings
              </Button>
              <Button variant="secondary" className="w-full justify-center">
                Security
              </Button>
            </div>
          </div>
        </Card>

        {/* System Logs */}
        <Card title="📊 System Logs & Analytics" className="border-l-4 border-l-green-600">
          <div className="space-y-4">
            <p className="text-gray-600 text-sm font-medium">View system activity and analytics</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button variant="secondary" className="w-full justify-center">
                Activity Logs
              </Button>
              <Button variant="secondary" className="w-full justify-center">
                Analytics
              </Button>
              <Button variant="secondary" className="w-full justify-center">
                Export Data
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </MainLayout>
  );
};

export default SuperAdminDashboard;
