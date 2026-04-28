import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useForm } from '../../hooks';
import { Button, Input, Alert } from '../Common';
import { useLoginMutation } from '../../redux/api';
import {
  loginStart,
  loginSuccess,
  loginFailure,
} from '../../redux/slices/authSlice';
import { isValidEmail } from '../../utils/validators';

/**
 * Email Login Form Component
 * @param {Object} props - Component props
 * @param {Function} props.onSuccess - Success callback
 * @param {Function} props.onToggleMobileAuth - Toggle to mobile auth
 * @returns {JSX.Element}
 */
const EmailLoginForm = ({ onSuccess, onToggleMobileAuth }) => {
  const dispatch = useDispatch();
  const [login] = useLoginMutation();
  const [apiError, setApiError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const { values, errors, handleChange, handleSubmit, isSubmitting } = useForm(
    { email: '', password: '' },
    async (data) => {
      if (!isValidEmail(data.email)) {
        setApiError('Please enter a valid email');
        return;
      }
      if (data.password.length < 6) {
        setApiError('Password must be at least 6 characters');
        return;
      }

      try {
        dispatch(loginStart());
        const response = await login(data).unwrap();
        dispatch(
          loginSuccess({
            user: response.data,
            token: response.data?.token || response.token,
            role: response.data?.role || response.role,
          })
        );
        setApiError('');
        if (onSuccess) onSuccess();
      } catch (error) {
        dispatch(loginFailure(error.message || 'Login failed'));
        setApiError(error.message || 'Login failed');
      }
    }
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {apiError && (
        <Alert type="error" closable onClose={() => setApiError('')}>
          {apiError}
        </Alert>
      )}

      <Input
        type="email"
        name="email"
        label="Email Address"
        placeholder="your@email.com"
        value={values.email}
        onChange={handleChange}
        required
      />

      <div className="relative">
        <Input
          type={showPassword ? 'text' : 'password'}
          name="password"
          label="Password"
          placeholder="Enter your password"
          value={values.password}
          onChange={handleChange}
          required
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-[38px] text-gray-600 hover:text-gray-900"
        >
          {showPassword ? '👁️' : '👁️‍🗨️'}
        </button>
      </div>

      <div className="flex items-center justify-between text-sm">
        <label className="flex items-center gap-2">
          <input type="checkbox" className="rounded" />
          Remember me
        </label>
        <a href="/forgot-password" className="text-blue-600 hover:text-blue-700">
          Forgot password?
        </a>
      </div>

      <Button
        type="submit"
        variant="primary"
        size="md"
        isLoading={isSubmitting}
        className="w-full"
      >
        {isSubmitting ? 'Logging in...' : 'Login with Email'}
      </Button>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-gray-500">Or</span>
        </div>
      </div>

      <Button
        type="button"
        variant="secondary"
        size="md"
        onClick={onToggleMobileAuth}
        className="w-full"
      >
        Login with Mobile
      </Button>

      <p className="text-center text-gray-600 text-sm">
        Don't have an account?{' '}
        <a href="/register" className="text-blue-600 hover:text-blue-700 font-medium">
          Register here
        </a>
      </p>
    </form>
  );
};

export default EmailLoginForm;
