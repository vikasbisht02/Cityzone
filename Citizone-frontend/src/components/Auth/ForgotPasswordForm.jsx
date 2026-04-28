import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useForm } from '../../hooks';
import { Button, Input, Alert } from '../Common';
import { useForgotPasswordMutation } from '../../redux/api';
import {
  forgotPasswordStart,
  forgotPasswordSuccess,
  forgotPasswordFailure,
} from '../../redux/slices/authSlice';
import { isValidEmail } from '../../utils/validators';

/**
 * Forgot Password Form - Request Password Reset Email
 * @param {Object} props - Component props
 * @param {Function} props.onSuccess - Called on successful request
 * @returns {JSX.Element}
 */
const ForgotPasswordForm = ({ onSuccess }) => {
  const dispatch = useDispatch();
  const [forgotPasswordMutation] = useForgotPasswordMutation();
  const [apiError, setApiError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const { values, handleChange, handleSubmit, isSubmitting } = useForm(
    { email: '' },
    async (data) => {
      if (!isValidEmail(data.email)) {
        setApiError('Please enter a valid email address');
        return;
      }

      try {
        dispatch(forgotPasswordStart());
        const response = await forgotPasswordMutation(data.email).unwrap();
        dispatch(forgotPasswordSuccess());
        setApiError('');
        setSuccessMsg(
          response.message || 'Password reset email has been sent. Please check your inbox.'
        );
        setTimeout(() => {
          if (onSuccess) onSuccess();
        }, 2000);
      } catch (error) {
        dispatch(forgotPasswordFailure(error.message || 'Failed to send reset email'));
        setApiError(error.message || 'Failed to send reset email');
      }
    }
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Forgot Password?</h2>
        <p className="text-gray-600 text-sm mt-2">
          Enter your email address and we'll send you a link to reset your password.
        </p>
      </div>

      {successMsg && (
        <Alert type="success" closable onClose={() => setSuccessMsg('')}>
          {successMsg}
        </Alert>
      )}

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

      <Button
        type="submit"
        variant="primary"
        size="md"
        isLoading={isSubmitting}
        className="w-full"
      >
        {isSubmitting ? 'Sending...' : 'Send Reset Link'}
      </Button>

      <p className="text-center text-gray-600 text-sm">
        Remember your password?{' '}
        <a href="/login" className="text-blue-600 hover:text-blue-700 font-medium">
          Back to login
        </a>
      </p>
    </form>
  );
};

export default ForgotPasswordForm;
