import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useForm } from '../../hooks';
import { Button, Input, Alert } from '../Common';
import { useMobileAuthMutation } from '../../redux/api';
import {
  mobileAuthStart,
  mobileAuthSent,
  mobileAuthFailure,
} from '../../redux/slices/authSlice';

/**
 * Mobile Number Authentication Form
 * @param {Object} props - Component props
 * @param {Function} props.onOTPSent - Called when OTP is sent
 * @param {Function} props.onToggleEmailAuth - Toggle to email auth
 * @returns {JSX.Element}
 */
const MobileAuthForm = ({ onOTPSent, onToggleEmailAuth }) => {
  const dispatch = useDispatch();
  const [mobileAuthMutation] = useMobileAuthMutation();
  const [apiError, setApiError] = useState('');

  const { values, errors, handleChange, handleSubmit, isSubmitting } = useForm(
    { mobileNumber: '' },
    async (data) => {
      const number = data.mobileNumber.replace(/\D/g, '');
      
      if (number.length !== 10) {
        setApiError('Please enter a valid 10-digit phone number');
        return;
      }

      try {
        dispatch(mobileAuthStart());
        const response = await mobileAuthMutation(number).unwrap();
        dispatch(
          mobileAuthSent({
            mobileNumber: number,
          })
        );
        setApiError('');
        if (onOTPSent) onOTPSent(number);
      } catch (error) {
        dispatch(mobileAuthFailure(error.message || 'Mobile auth failed'));
        setApiError(error.message || 'Mobile auth failed');
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

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Phone Number<span className="text-red-500 ml-1">*</span>
        </label>
        <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
          <span className="px-4 py-2 bg-gray-100 text-gray-700 font-medium">+91</span>
          <input
            type="tel"
            name="mobileNumber"
            placeholder="10-digit number"
            value={values.mobileNumber}
            onChange={handleChange}
            className="flex-1 px-4 py-2 outline-none"
            maxLength="10"
            pattern="[0-9]*"
            required
          />
        </div>
        <p className="text-gray-500 text-sm mt-2">
          Enter your 10-digit mobile number. We'll send you an OTP.
        </p>
      </div>

      <Button
        type="submit"
        variant="primary"
        size="md"
        isLoading={isSubmitting}
        className="w-full"
      >
        {isSubmitting ? 'Sending OTP...' : 'Send OTP'}
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
        onClick={onToggleEmailAuth}
        className="w-full"
      >
        Login with Email
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

export default MobileAuthForm;
