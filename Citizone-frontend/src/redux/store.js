import { configureStore } from '@reduxjs/toolkit';
import authSlice from './slices/authSlice';
import { apiSlice } from './api';

export const store = configureStore({
  reducer: {
    auth: authSlice,
    [apiSlice.reducerPath]: apiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }).concat(apiSlice.middleware),
  devTools: import.meta.env.VITE_ENVIRONMENT !== 'production',
});

export default store;