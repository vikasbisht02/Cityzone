import { createSlice } from '@reduxjs/toolkit';
import Cookies from 'js-cookie';

const initialState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  sessionExpiry: null,
};

const userAuthSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    loginSuccess: (state, action) => {
      state.isLoading = false;
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.sessionExpiry = action.payload.expiresAt;
      state.error = null;
      
      // Set secure cookie with expiry
      Cookies.set('userToken', action.payload.token, {
        expires: new Date(action.payload.expiresAt),
        secure: true,
        sameSite: 'strict'
      });
    },
    loginFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.sessionExpiry = null;
      state.error = null;
      
      // Remove cookie
      Cookies.remove('userToken');
    },
    clearError: (state) => {
      state.error = null;
    },
    updateProfile: (state, action) => {
      state.user = { ...state.user, ...action.payload };
    },
    checkTokenExpiry: (state) => {
      const now = new Date().getTime();
      if (state.sessionExpiry && now > state.sessionExpiry) {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.sessionExpiry = null;
        Cookies.remove('userToken');
      }
    },
    refreshToken: (state, action) => {
      state.token = action.payload.token;
      state.sessionExpiry = action.payload.expiresAt;
      
      Cookies.set('userToken', action.payload.token, {
        expires: new Date(action.payload.expiresAt),
        secure: true,
        sameSite: 'strict'
      });
    }
  },
});

export const {
  loginStart,
  loginSuccess,
  loginFailure,
  logout,
  clearError,
  updateProfile,
  checkTokenExpiry,
  refreshToken
} = userAuthSlice.actions;

export default userAuthSlice.reducer;