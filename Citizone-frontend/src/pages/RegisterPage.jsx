/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import AuthLayout from '../components/Layout/AuthLayout';
import { useForm } from '../hooks';
import { Button, Input, Alert, Card } from '../components/Common';
import { useRegisterMutation } from '../redux/api';
import {
  registerStart,
  registerSuccess,
  registerFailure,
} from '../redux/slices/authSlice';
import { isValidEmail, isValidPassword } from '../utils/validators';

/**
 * Register Page
 * @returns {JSX.Element}
 */
const RegisterPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [register] = useRegisterMutation();
  const [showPassword, setShowPassword] = useState(false);
  const [apiError, setApiError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const { isLoading } = useSelector(state => state.auth);

  const { values, errors, handleChange, handleSubmit, isSubmitting } = useForm(
    { email: '', password: '', confirmPassword: '' },
    async (data) => {
      // Validation
      if (!isValidEmail(data.email)) {
        setApiError('Please enter a valid email address');
        return;
      }

      if (!isValidPassword(data.password)) {
        setApiError(
          'Password must be at least 6 characters with uppercase, lowercase, and numbers'
        );
        return;
      }

      if (data.password !== data.confirmPassword) {
        setApiError('Passwords do not match');
        return;
      }

      try {
        dispatch(registerStart());
        const response = await register({
          email: data.email,
          password: data.password,
          confirmPassword: data.confirmPassword,
        }).unwrap();

        dispatch(
          registerSuccess({
            email: data.email,
          })
        );

        setApiError('');
        setSuccessMsg(
          'Registration successful! Please check your email for the verification code.'
        );

        // Redirect to email verification page after 1.5 seconds
        setTimeout(() => {
          navigate('/verify-email', { state: { email: data.email } });
        }, 1500);
      } catch (error) {
        dispatch(registerFailure(error.message));
        setApiError(error.message);
      }
    }
  );

  return (
    <AuthLayout title="Create Your Account">
      <form onSubmit={handleSubmit} className="space-y-4">
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

        <Card className="bg-blue-50 border border-blue-100">
          <p className="text-sm text-blue-800">
            <strong>Note:</strong> You'll receive a verification email after registration.
            Please verify your email to activate your account.
          </p>
        </Card>

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
            helperText="Min 6 chars with uppercase, lowercase, and numbers"
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

        <Input
          type={showPassword ? 'text' : 'password'}
          name="confirmPassword"
          label="Confirm Password"
          placeholder="Confirm your password"
          value={values.confirmPassword}
          onChange={handleChange}
          required
        />

        <div className="flex items-center gap-2 text-sm">
          <input type="checkbox" id="terms" required />
          <label htmlFor="terms">
            I agree to the{' '}
            <a href="#" className="text-blue-600 hover:text-blue-700">
              Terms and Conditions
            </a>
          </label>
        </div>

        <Button
          type="submit"
          variant="primary"
          size="md"
          isLoading={isSubmitting}
          className="w-full"
        >
          {isSubmitting ? 'Registering...' : 'Register'}
        </Button>

        <p className="text-center text-gray-600 text-sm">
          Already have an account?{' '}
          <a href="/login" className="text-blue-600 hover:text-blue-700 font-medium">
            Login here
          </a>
        </p>
      </form>
    </AuthLayout>
  );
};

export default RegisterPage;
