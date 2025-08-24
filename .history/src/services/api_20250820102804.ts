import axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios';
import { API_BASE_URL } from '../constants';

// Create axios instance with longer timeout for OAuth operations
const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // Increased from 10000ms to 30000ms for OAuth operations
  withCredentials: true, // Important for cookies/sessions
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Add access token to Authorization header
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    
    // Set longer timeout for OAuth endpoints
    if (config.url?.includes('google-oauth') || config.url?.includes('oauth')) {
      config.timeout = 60000; // 60 seconds for OAuth operations
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Unauthorized - clear auth state and redirect to login
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

export default api;
