import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../components/Layout/MainLayout';
import { Card, Button, LoadingSpinner, Alert } from '../components/Common';
import { useGetCurrentUserQuery } from '../redux/api';
import { setUser } from '../redux/slices/authSlice';

/**
 * Admin Dashboard - Manage users and moderate content
 * @returns {JSX.Element}
 */
const AdminDashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, isAuthenticated, isLoading, role } = useSelector(state => state.auth);
  const { data: currentUserData, isLoading: isFetchingUser, error: fetchError } = useGetCurrentUserQuery(undefined, {
    skip: !!user || !isAuthenticated
  });

  useEffect(() => {
    if (!isAuthenticated || role !== 'admin') {
      navigate('/login');
      return;
    }

    if (currentUserData && !user) {
      dispatch(setUser(currentUserData.data));
    }
  }, [isAuthenticated, user, navigate, dispatch, role, currentUserData]);

  if (!isAuthenticated || role !== 'admin') {
    return null;
  }

  if (isLoading || isFetchingUser) {
    return (
      <MainLayout>
        <LoadingSpinner text="Loading admin panel..." />
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">👨‍💼 Admin Dashboard</h1>
            <p className="text-gray-600 mt-2">Welcome {user?.name}! Manage platform users and content.</p>
          </div>
          <Alert type="info">
            <strong>Admin Access</strong> - Content management enabled
          </Alert>
        </div>

        {/* Admin Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card title="Total Users" className="bg-gradient-to-br from-blue-50 to-blue-100">
            <div className="text-4xl font-bold text-blue-600">0</div>
            <p className="text-sm text-gray-600 mt-2">Registered users</p>
          </Card>

          <Card title="Verified Users" className="bg-gradient-to-br from-green-50 to-green-100">
            <div className="text-4xl font-bold text-green-600">0</div>
            <p className="text-sm text-gray-600 mt-2">Email verified</p>
          </Card>

          <Card title="Blocked Accounts" className="bg-gradient-to-br from-red-50 to-red-100">
            <div className="text-4xl font-bold text-red-600">0</div>
            <p className="text-sm text-gray-600 mt-2">Deactivated users</p>
          </Card>

          <Card title="New This Month" className="bg-gradient-to-br from-purple-50 to-purple-100">
            <div className="text-4xl font-bold text-purple-600">0</div>
            <p className="text-sm text-gray-600 mt-2">New registrations</p>
          </Card>
        </div>

        {/* User Management */}
        <Card title="👥 User Management" className="border-l-4 border-l-blue-600">
          <div className="space-y-4">
            <p className="text-gray-600 text-sm font-medium">Manage all users and their permissions</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button variant="primary" className="w-full justify-center">
                View All Users
              </Button>
              <Button variant="secondary" className="w-full justify-center">
                Search Users
              </Button>
              <Button variant="secondary" className="w-full justify-center">
                User Roles
              </Button>
            </div>
          </div>
        </Card>

        {/* Content Moderation */}
        <Card title="🛡️ Content Moderation" className="border-l-4 border-l-purple-600">
          <div className="space-y-4">
            <p className="text-gray-600 text-sm font-medium">Review and moderate user-generated content</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button variant="secondary" className="w-full justify-center">
                Pending Reviews
              </Button>
              <Button variant="secondary" className="w-full justify-center">
                Reported Content
              </Button>
              <Button variant="secondary" className="w-full justify-center">
                Moderation Log
              </Button>
            </div>
          </div>
        </Card>

        {/* Account Actions */}
        <Card title="⚙️ Account Actions" className="border-l-4 border-l-red-600">
          <div className="space-y-4">
            <p className="text-gray-600 text-sm font-medium">Perform administrative actions on user accounts</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button variant="secondary" className="w-full justify-center">
                Suspend Account
              </Button>
              <Button variant="secondary" className="w-full justify-center">
                Reset Password
              </Button>
              <Button variant="secondary" className="w-full justify-center">
                View Activity
              </Button>
            </div>
          </div>
        </Card>

        {/* Analytics */}
        <Card title="📊 Analytics" className="border-l-4 border-l-green-600">
          <div className="space-y-4">
            <p className="text-gray-600 text-sm font-medium">View platform analytics and reports</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button variant="secondary" className="w-full justify-center">
                User Statistics
              </Button>
              <Button variant="secondary" className="w-full justify-center">
                Activity Reports
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
        </Card>

        {/* Super Admin Features */}
        {role === 'superadmin' && (
          <>
            <Card title="System Management">
              <div className="space-y-4">
                <p className="text-gray-600 text-sm">
                  Manage system-wide settings and administrator accounts
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button variant="primary" className="w-full justify-center">
                    System Settings
                  </Button>
                  <Button variant="secondary" className="w-full justify-center">
                    Manage Admins
                  </Button>
                  <Button variant="secondary" className="w-full justify-center">
                    Audit Logs
                  </Button>
                </div>
              </div>
            </Card>

            <Card title="Permissions Management">
              <div className="space-y-4">
                <p className="text-gray-600 text-sm">
                  Configure roles and permissions for all users
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button variant="secondary" className="w-full justify-center">
                    Manage Roles
                  </Button>
                  <Button variant="secondary" className="w-full justify-center">
                    Permissions Matrix
                  </Button>
                </div>
              </div>
            </Card>
          </>
        )}

        {/* Activity & Reports */}
        <Card title="Reports & Analytics">
          <div className="space-y-4">
            <p className="text-gray-600 text-sm">View system reports and analytics</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button variant="secondary" className="w-full justify-center">
                User Analytics
              </Button>
              <Button variant="secondary" className="w-full justify-center">
                Login Reports
              </Button>
              <Button variant="secondary" className="w-full justify-center">
                System Reports
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </MainLayout>
  );
};

export default AdminDashboard;
