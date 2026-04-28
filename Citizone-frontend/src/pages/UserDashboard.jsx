import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../components/Layout/MainLayout';
import { Card, Button, LoadingSpinner } from '../components/Common';
import { useGetCurrentUserQuery } from '../redux/api';
import { setUser } from '../redux/slices/authSlice';

/**
 * Regular User Dashboard
 * @returns {JSX.Element}
 */
const UserDashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, isAuthenticated, isLoading } = useSelector(state => state.auth);
  const { data: currentUserData, isLoading: isFetchingUser, error: fetchError } = useGetCurrentUserQuery(undefined, {
    skip: !!user || !isAuthenticated
  });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (currentUserData && !user) {
      dispatch(setUser(currentUserData.data));
    }
  }, [isAuthenticated, user, navigate, dispatch, currentUserData]);

  if (!isAuthenticated) {
    return null;
  }

  if (isLoading) {
    return (
      <MainLayout>
        <LoadingSpinner text="Loading dashboard..." />
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="space-y-8">
        {/* Welcome Section */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome, {user?.name || 'User'}!
          </h1>
          <p className="text-gray-600">Manage your profile and account settings</p>
        </div>

        {/* Profile Information Card */}
        <Card title="Profile Information">
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {user?.name && (
                <div>
                  <p className="text-sm text-gray-600">Full Name</p>
                  <p className="text-lg font-semibold text-gray-900">{user.name}</p>
                </div>
              )}

              {user?.email && (
                <div>
                  <p className="text-sm text-gray-600">Email Address</p>
                  <p className="text-lg font-semibold text-gray-900">{user.email}</p>
                </div>
              )}

              {user?.mobileNumber && (
                <div>
                  <p className="text-sm text-gray-600">Mobile Number</p>
                  <p className="text-lg font-semibold text-gray-900">
                    +91 {user.mobileNumber}
                  </p>
                </div>
              )}

              {user?.age && (
                <div>
                  <p className="text-sm text-gray-600">Age</p>
                  <p className="text-lg font-semibold text-gray-900">{user.age} years</p>
                </div>
              )}

              {user?.gender && (
                <div>
                  <p className="text-sm text-gray-600">Gender</p>
                  <p className="text-lg font-semibold text-gray-900 capitalize">
                    {user.gender}
                  </p>
                </div>
              )}

              <div>
                <p className="text-sm text-gray-600">Verification Status</p>
                <div className="flex items-center gap-2 mt-1">
                  {user?.isUserVerified ? (
                    <>
                      <span className="w-3 h-3 bg-green-500 rounded-full"></span>
                      <p className="text-lg font-semibold text-green-600">Verified</p>
                    </>
                  ) : (
                    <>
                      <span className="w-3 h-3 bg-yellow-500 rounded-full"></span>
                      <p className="text-lg font-semibold text-yellow-600">Pending</p>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Account Stats */}
        <Card title="Account Statistics">
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <p className="text-3xl font-bold text-blue-600">
                {user?.registeredAt
                  ? new Date(user.registeredAt).toLocaleDateString()
                  : 'N/A'}
              </p>
              <p className="text-sm text-gray-600 mt-2">Joined</p>
            </div>

            <div className="text-center p-4 bg-green-50 rounded-lg">
              <p className="text-3xl font-bold text-green-600">
                {user?.lastLogin ? '✓' : '—'}
              </p>
              <p className="text-sm text-gray-600 mt-2">Last Active</p>
            </div>

            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <p className="text-3xl font-bold text-purple-600">
                {user?.isBlocked ? '🔒' : '✓'}
              </p>
              <p className="text-sm text-gray-600 mt-2">Account Status</p>
            </div>
          </div>
        </Card>

        {/* Quick Actions */}
        <Card title="Quick Actions">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button variant="primary" className="w-full justify-center">
              Edit Profile
            </Button>
            <Button variant="secondary" className="w-full justify-center">
              Change Password
            </Button>
            <Button variant="secondary" className="w-full justify-center">
              Privacy Settings
            </Button>
            <Button variant="secondary" className="w-full justify-center">
              Account Settings
            </Button>
          </div>
        </Card>
      </div>
    </MainLayout>
  );
};

export default UserDashboard;
