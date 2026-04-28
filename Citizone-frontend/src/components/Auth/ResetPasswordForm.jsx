import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useForm } from '../../hooks';
import { Button, Input, Alert } from '../Common';
import { useResetPasswordMutation } from '../../redux/api';
import {
  resetPasswordStart,
  resetPasswordSuccess,
  resetPasswordFailure,
} from '../../redux/slices/authSlice';

/**
 * Reset Password Form - Set New Password
 * @param {Object} props - Component props
 * @param {string} props.token - Reset token from email link
 * @param {Function} props.onSuccess - Called on successful reset
 * @returns {JSX.Element}
 */
const ResetPasswordForm = ({ token, onSuccess }) => {
  const dispatch = useDispatch();
  const [resetPasswordMutation] = useResetPasswordMutation();
  const [apiError, setApiError] = useState('');
  const [showPasswords, setShowPasswords] = useState(false);

  const { values, errors, handleChange, handleSubmit, isSubmitting } = useForm(
    { password: '', confirmPassword: '' },
    async (data) => {
      if (data.password.length < 6) {
        setApiError('Password must be at least 6 characters');
        return;
      }

      if (data.password !== data.confirmPassword) {
        setApiError('Passwords do not match');
        return;
      }

      try {
        dispatch(resetPasswordStart());
        const response = await resetPasswordMutation({
          token,
          password: data.password,
        }).unwrap();
        dispatch(resetPasswordSuccess());
        setApiError('');
        if (onSuccess) onSuccess();
      } catch (error) {
        dispatch(resetPasswordFailure(error.message || 'Password reset failed'));
        setApiError(error.message || 'Password reset failed');
      }
    }
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Reset Password</h2>
        <p className="text-gray-600 text-sm mt-2">
          Enter your new password below.
        </p>
      </div>

      {apiError && (
        <Alert type="error" closable onClose={() => setApiError('')}>
          {apiError}
        </Alert>
      )}

      <div className="relative">
        <Input
          type={showPasswords ? 'text' : 'password'}
          name="password"
          label="New Password"
          placeholder="Enter new password"
          value={values.password}
          onChange={handleChange}
          required
        />
        <button
          type="button"
          onClick={() => setShowPasswords(!showPasswords)}
          className="absolute right-3 top-[38px] text-gray-600"
        >
          {showPasswords ? '👁️' : '👁️‍🗨️'}
        </button>
      </div>

      <div className="relative">
        <Input
          type={showPasswords ? 'text' : 'password'}
          name="confirmPassword"
          label="Confirm Password"
          placeholder="Confirm your password"
          value={values.confirmPassword}
          onChange={handleChange}
          required
        />
        <button
          type="button"
          onClick={() => setShowPasswords(!showPasswords)}
          className="absolute right-3 top-[38px] text-gray-600"
        >
          {showPasswords ? '👁️' : '👁️‍🗨️'}
        </button>
      </div>

      <Button
        type="submit"
        variant="primary"
        size="md"
        isLoading={isSubmitting}
        className="w-full"
      >
        {isSubmitting ? 'Resetting...' : 'Reset Password'}
      </Button>

      <p className="text-center text-gray-600 text-sm">
        <a href="/login" className="text-blue-600 hover:text-blue-700 font-medium">
          Back to login
        </a>
      </p>
    </form>
  );
};

export default ResetPasswordForm;
