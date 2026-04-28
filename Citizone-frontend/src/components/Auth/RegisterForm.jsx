import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { registerStart, registerSuccess, registerFailure } from '../../redux/slices/authSlice';
import { useRegisterMutation } from '../../redux/api';
import { useForm } from '../../hooks';
import { validateRegisterForm } from '../../utils/validators';
import { Button, Input, Alert } from '../Common';
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from '../../constants';

/**
 * Register Form Component
 * @param {Object} props - Component props
 * @param {Function} props.onSuccess - Success callback
 * @returns {JSX.Element}
 */
const RegisterForm = ({ onSuccess }) => {
  const dispatch = useDispatch();
  const [register] = useRegisterMutation();
  const [showPassword, setShowPassword] = useState(false);
  const [apiError, setApiError] = useState('');

  const { values, errors, handleChange, handleSubmit, isSubmitting } = useForm(
    { fullName: '', email: '', phoneNumber: '', password: '', confirmPassword: '' },
    async (data) => {
      try {
        const validation = validateRegisterForm(data);
        if (!Object.values(validation).every(v => v)) {
          setApiError('Please fill all required fields correctly');
          return;
        }

        dispatch(registerStart());
        const response = await register({
          fullName: data.fullName,
          email: data.email,
          phoneNumber: data.phoneNumber,
          password: data.password,
        }).unwrap();

        dispatch(registerSuccess({
          user: response.user,
          token: response.token,
        }));
        setApiError('');
        if (onSuccess) onSuccess();
      } catch (error) {
        dispatch(registerFailure(error.message || 'Registration failed'));
        setApiError(error.message || 'Registration failed');
      }
    }
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {apiError && <Alert type="error" closable onClose={() => setApiError('')}>{apiError}</Alert>}

      <Input
        type="text"
        name="fullName"
        label="Full Name"
        placeholder="John Doe"
        value={values.fullName}
        onChange={handleChange}
        required
      />

      <Input
        type="email"
        name="email"
        label="Email Address"
        placeholder="your@email.com"
        value={values.email}
        onChange={handleChange}
        required
      />

      <Input
        type="tel"
        name="phoneNumber"
        label="Phone Number"
        placeholder="10-digit number"
        value={values.phoneNumber}
        onChange={handleChange}
        helperText="Format: 10-digit number"
      />

      <div className="relative">
        <Input
          type={showPassword ? 'text' : 'password'}
          name="password"
          label="Password"
          placeholder="Enter your password"
          value={values.password}
          onChange={handleChange}
          helperText="Min 8 chars with uppercase, lowercase, and numbers"
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
  );
};

export default RegisterForm;
