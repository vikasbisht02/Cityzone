import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import Cookies from 'js-cookie';
import { logout, refreshToken } from './slices/authSlice';
import { AUTH_ENDPOINTS } from '../constants/apiEndpoints';

const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_BASE_URL,
  credentials: 'include',
  prepareHeaders: (headers, { getState }) => {
    const token = getState().auth.token || Cookies.get('citizoneCookie');
    
    // Check token expiry before adding to headers
    const sessionExpiry = getState().auth.sessionExpiry;
    const now = new Date().getTime();
    
    if (sessionExpiry && now > sessionExpiry) {
      Cookies.remove('citizoneCookie');
      return headers;
    }
    
    if (token) {
      headers.set('authorization', `Bearer ${token}`);
    }
    
    headers.set('Content-Type', 'application/json');
    return headers;
  },
});

const baseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);
  
  // Handle token expiry and refresh
  if (result?.error?.status === 401) {
    // Try to refresh token
    const refreshResult = await baseQuery({
      url: '/auth/refresh-token',
      method: 'POST',
    }, api, extraOptions);
    
    if (refreshResult?.data) {
      // Store new token
      api.dispatch(refreshToken({
        token: refreshResult.data.token,
        expiresAt: refreshResult.data.expiresAt
      }));
      
      // Retry original query with new token
      result = await baseQuery(args, api, extraOptions);
    } else {
      // Refresh failed, logout user
      api.dispatch(logout());
    }
  }
  
  return result;
};

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['User', 'Profile'],
  endpoints: (builder) => ({
    // Auth endpoints
    login: builder.mutation({
      query: (credentials) => ({
        url: AUTH_ENDPOINTS.LOGIN_EMAIL,
        method: 'POST',
        body: credentials,
      }),
    }),
    
    loginWithPhone: builder.mutation({
      query: (credentials) => ({
        url: AUTH_ENDPOINTS.MOBILE_AUTH,
        method: 'POST',
        body: credentials,
      }),
    }),
    
    register: builder.mutation({
      query: (userData) => ({
        url: AUTH_ENDPOINTS.REGISTER_EMAIL,
        method: 'POST',
        body: userData,
      }),
    }),
    
    forgotPassword: builder.mutation({
      query: (email) => ({
        url: AUTH_ENDPOINTS.FORGOT_PASSWORD,
        method: 'POST',
        body: { email },
      }),
    }),
    
    resetPassword: builder.mutation({
      query: ({ token, password }) => ({
        url: AUTH_ENDPOINTS.RESET_PASSWORD,
        method: 'POST',
        body: { token, password },
      }),
    }),
    
    verifyEmail: builder.mutation({
      query: (token) => ({
        url: AUTH_ENDPOINTS.VERIFY_OTP,
        method: 'POST',
        body: { token },
      }),
    }),
    
    resendVerification: builder.mutation({
      query: (email) => ({
        url: AUTH_ENDPOINTS.FORGOT_PASSWORD,
        method: 'POST',
        body: { email },
      }),
    }),
    
    mobileAuth: builder.mutation({
      query: (number) => ({
        url: AUTH_ENDPOINTS.MOBILE_AUTH,
        method: 'POST',
        body: { number },
      }),
    }),
    
    verifyOTP: builder.mutation({
      query: (verificationCode) => ({
        url: AUTH_ENDPOINTS.VERIFY_OTP,
        method: 'POST',
        body: { verificationCode },
      }),
    }),
    
    getCurrentUser: builder.query({
      query: () => ({
        url: AUTH_ENDPOINTS.GET_CURRENT_USER,
        method: 'POST',
      }),
      providesTags: ['User'],
    }),
    
    verifyFirebaseToken: builder.mutation({
      query: (idToken) => ({
        url: AUTH_ENDPOINTS.FIREBASE_VERIFY,
        method: 'POST',
        body: { idToken },
      }),
    }),
    
    logout: builder.mutation({
      query: () => ({
        url: AUTH_ENDPOINTS.LOGOUT,
        method: 'POST',
      }),
      invalidatesTags: ['User', 'Profile'],
    }),
    
    // User endpoints
    getProfile: builder.query({
      query: () => '/user/profile',
      providesTags: ['Profile'],
    }),
    
    updateProfile: builder.mutation({
      query: (userData) => ({
        url: '/user/profile',
        method: 'PUT',
        body: userData,
      }),
      invalidatesTags: ['Profile'],
    }),
    
    changePassword: builder.mutation({
      query: (passwordData) => ({
        url: '/user/change-password',
        method: 'PUT',
        body: passwordData,
      }),
    }),
    
    uploadAvatar: builder.mutation({
      query: (formData) => ({
        url: '/user/upload-avatar',
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: ['Profile'],
    }),
    
    deleteAccount: builder.mutation({
      query: (password) => ({
        url: '/user/delete-account',
        method: 'DELETE',
        body: { password },
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useLoginWithPhoneMutation,
  useRegisterMutation,
  useMobileAuthMutation,
  useVerifyOTPMutation,
  useGetCurrentUserQuery,
  useVerifyFirebaseTokenMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useVerifyEmailMutation,
  useResendVerificationMutation,
  useLogoutMutation,
  useGetProfileQuery,
  useUpdateProfileMutation,
  useChangePasswordMutation,
  useUploadAvatarMutation,
  useDeleteAccountMutation,
} = apiSlice;