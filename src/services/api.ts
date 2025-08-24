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

// Response interceptor with automatic token refresh
api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as any;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // Try to refresh the access token
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) {
          // No refresh token, redirect to login
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('user');
          window.location.href = '/';
          return Promise.reject(error);
        }
        
        console.log('Attempting to refresh access token...');
        
        const refreshResponse = await fetch(`${API_BASE_URL}/accounts/api/token/refresh/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            refresh: refreshToken
          })
        });
        
        if (refreshResponse.ok) {
          const refreshData = await refreshResponse.json();
          
          if (refreshData.access) {
            // Store the new access token
            localStorage.setItem('accessToken', refreshData.access);
            
            // Update the original request with new token
            originalRequest.headers.Authorization = `Bearer ${refreshData.access}`;
            
            // Retry the original request
            console.log('Token refreshed, retrying original request...');
            return axios(originalRequest);
          }
        }
        
        // Refresh failed, redirect to login
        console.log('Token refresh failed, redirecting to login...');
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        window.location.href = '/';
        return Promise.reject(error);
        
      } catch (refreshError) {
        console.error('Error during token refresh:', refreshError);
        // Refresh failed, redirect to login
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        window.location.href = '/';
        return Promise.reject(error);
      }
    }
    
    return Promise.reject(error);
  }
);

export default api;
