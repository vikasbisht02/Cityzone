import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Button, Input, Alert, LoadingSpinner } from '../Common';
import { useVerifyOTPMutation } from '../../redux/api';
import {
  verifyOTPStart,
  verifyOTPSuccess,
  verifyOTPFailure,
} from '../../redux/slices/authSlice';

/**
 * OTP Verification Form
 * @param {Object} props - Component props
 * @param {string} props.identifier - Email or mobile number
 * @param {string} props.type - 'email' or 'mobile'
 * @param {Function} props.onSuccess - Called on successful verification
 * @param {Function} props.onResend - Called when resending OTP
 * @returns {JSX.Element}
 */
const OTPVerificationForm = ({ identifier, type = 'email', onSuccess, onResend }) => {
  const dispatch = useDispatch();
  const [verifyOTPMutation] = useVerifyOTPMutation();
  const [otp, setOtp] = useState('');
  const [apiError, setApiError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
  const [canResend, setCanResend] = useState(false);

  // Countdown timer for resend
  useEffect(() => {
    let interval;
    if (timeLeft > 0 && !canResend) {
      interval = setInterval(() => {
        setTimeLeft(t => {
          if (t <= 1) {
            setCanResend(true);
            return 0;
          }
          return t - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timeLeft, canResend]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!otp || otp.length !== 6) {
      setApiError('Please enter a valid 6-digit OTP');
      return;
    }

    try {
      setIsSubmitting(true);
      dispatch(verifyOTPStart());
      const response = await verifyOTPMutation(otp).unwrap();
      dispatch(
        verifyOTPSuccess({
          user: response.data,
          token: response.data?.token,
          role: response.data?.role,
        })
      );
      setApiError('');
      if (onSuccess) onSuccess();
    } catch (error) {
      dispatch(verifyOTPFailure(error.message || 'OTP verification failed'));
      setApiError(error.message || 'OTP verification failed');
      setOtp('');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResend = () => {
    if (onResend) {
      onResend();
    }
    setTimeLeft(300);
    setCanResend(false);
    setOtp('');
    setApiError('');
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const displayIdentifier =
    type === 'email' ? identifier : `+91 ${identifier?.slice(-10)}`;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Verify {capitalize(type)}</h3>
        <p className="text-gray-600 text-sm">
          We've sent a 6-digit OTP to <strong>{displayIdentifier}</strong>
        </p>
      </div>

      {apiError && (
        <Alert type="error" closable onClose={() => setApiError('')}>
          {apiError}
        </Alert>
      )}

      <Input
        type="text"
        name="otp"
        label="OTP Code"
        placeholder="000000"
        value={otp}
        onChange={(e) => {
          const val = e.target.value.replace(/\D/g, '').slice(0, 6);
          setOtp(val);
        }}
        maxLength="6"
        required
        className="text-center tracking-widest text-2xl"
      />

      <div className="text-center">
        {timeLeft > 0 ? (
          <p className="text-sm text-gray-600">
            Expires in <strong className="text-blue-600">{formatTime(timeLeft)}</strong>
          </p>
        ) : (
          <p className="text-sm text-red-600">OTP has expired</p>
        )}
      </div>

      <Button
        type="submit"
        variant="primary"
        size="md"
        isLoading={isSubmitting}
        disabled={!otp || timeLeft === 0}
        className="w-full"
      >
        {isSubmitting ? 'Verifying...' : 'Verify OTP'}
      </Button>

      <div className="text-center">
        {canResend ? (
          <button
            type="button"
            onClick={handleResend}
            className="text-blue-600 hover:text-blue-700 font-medium text-sm"
          >
            Resend OTP
          </button>
        ) : (
          <p className="text-gray-600 text-sm">
            Didn't receive? Resend in {formatTime(timeLeft)}
          </p>
        )}
      </div>
    </form>
  );
};

const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

export default OTPVerificationForm;
