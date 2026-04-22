import axios from 'axios';
import { API_BASE_URL } from '../constants/apiEndpoints';

/**
 * Create API client with default configuration
 */
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

/**
 * Add request interceptor
 */
apiClient.interceptors.request.use(
  (config) => {
    // Cookies are sent automatically with withCredentials: true
    // No need to manually add token to headers
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Add response interceptor
 */
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or unauthorized
      // Let the error propagate so auth handlers can manage the redirect
      // Avoid window.location.href to prevent infinite reload loops
      localStorage.removeItem('citizoneCookie');
    }
    
    // Handle CORS errors
    if (error.code === 'ERR_NETWORK' || error.message === 'Network Error') {
      console.error('CORS or Network Error:', {
        message: error.message,
        baseURL: apiClient.defaults.baseURL,
        url: error.config?.url,
      });
      
      // Provide helpful error info
      const corsError = new Error(
        'Unable to connect to the server. Please ensure the backend API is running and CORS is properly configured.'
      );
      corsError.isCorsError = true;
      return Promise.reject(corsError);
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;
