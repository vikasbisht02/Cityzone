import React from 'react';
import { useAuth } from '../../hooks';
import Button from './Button';
import { useLogoutMutation } from '../../redux/api';
import { useDispatch } from 'react-redux';
import { logout } from '../../redux/slices/authSlice';
import { useNavigate } from 'react-router-dom';

/**
 * Header Component with Role-Based Navigation
 * @returns {JSX.Element}
 */
const Header = () => {
  const { user, isAuthenticated, role } = useAuth();
  const [logoutMutation] = useLogoutMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logoutMutation().unwrap();
      dispatch(logout());
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
      // Force logout anyway
      dispatch(logout());
      navigate('/login');
    }
  };

  const getDashboardLink = () => {
    if (role === 'superadmin' || role === 'admin') {
      return '/dashboard/admin';
    }
    return '/dashboard/user';
  };

  return (
    <header className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <a href="/" className="text-2xl font-bold text-blue-600">
              Citizone
            </a>
            {isAuthenticated && (
              <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded-full capitalize">
                {role || 'user'}
              </span>
            )}
          </div>

          <nav className="flex items-center gap-6">
            {isAuthenticated && user ? (
              <>
                <div className="flex items-center gap-4">
                  <span className="text-gray-700 text-sm">
                    {user.name || user.email || 'User'}
                  </span>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => navigate(getDashboardLink())}
                  >
                    Dashboard
                  </Button>
                </div>
                <Button variant="danger" size="sm" onClick={handleLogout}>
                  Logout
                </Button>
              </>
            ) : (
              <>
                <a
                  href="/login"
                  className="text-gray-700 hover:text-blue-600 font-medium"
                >
                  Login
                </a>
                <Button variant="primary" size="sm">
                  <a href="/register">Register</a>
                </Button>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
