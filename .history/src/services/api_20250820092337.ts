import axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios';
import { API_BASE_URL, API_ENDPOINTS } from '../constants';

// Create axios instance
const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  withCredentials: true, // Important for cookies/sessions
});

// Function to get CSRF token from Django
const getCSRFToken = async (): Promise<string | null> => {
  try {
    // Get CSRF token from cookie or make a request to get it
    const response = await axios.get(`${API_BASE_URL}${API_ENDPOINTS.CSRF}`, {
      withCredentials: true,
    });
    
    if (response.data.csrfToken) {
      return response.data.csrfToken;
    }
    
    // Fallback: try to get from cookie
    const cookies = document.cookie.split(';');
    const csrfCookie = cookies.find(cookie => cookie.trim().startsWith('csrftoken='));
    if (csrfCookie) {
      return csrfCookie.split('=')[1];
    }
    
    return null;
  } catch (error) {
    console.error('Failed to get CSRF token:', error);
    return null;
  }
};

// Request interceptor
api.interceptors.request.use(
  async (config) => {
    // Add access token to Authorization header
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    
    // Add CSRF token for non-GET requests
    if (config.method && config.method !== 'get' && config.method !== 'GET') {
      const csrfToken = await getCSRFToken();
      if (csrfToken) {
        config.headers['X-CSRFToken'] = csrfToken;
      }
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
