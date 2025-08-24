import axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios';
import { API_BASE_URL, API_ENDPOINTS } from '../constants';

// CSRF token cache
let csrfTokenCache: string | null = null;
let csrfTokenExpiry: number = 0;

// Create axios instance
const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  withCredentials: true, // Important for cookies/sessions
});

// Function to get CSRF token from Django
const getCSRFToken = async (): Promise<string | null> => {
  // Check if we have a cached token that's still valid
  if (csrfTokenCache && Date.now() < csrfTokenExpiry) {
    return csrfTokenCache;
  }

  try {
    // Get CSRF token from cookie or make a request to get it
    const response = await axios.get(`${API_BASE_URL}${API_ENDPOINTS.CSRF}`, {
      withCredentials: true,
    });
    
    if (response.data.csrfToken) {
      csrfTokenCache = response.data.csrfToken;
      csrfTokenExpiry = Date.now() + (60 * 60 * 1000); // Cache for 1 hour
      return csrfTokenCache;
    }
    
    // Fallback: try to get from cookie
    const cookies = document.cookie.split(';');
    const csrfCookie = cookies.find(cookie => cookie.trim().startsWith('csrftoken='));
    if (csrfCookie) {
      csrfTokenCache = csrfCookie.split('=')[1];
      csrfTokenExpiry = Date.now() + (60 * 60 * 1000); // Cache for 1 hour
      return csrfTokenCache;
    }
    
    return null;
  } catch (error) {
    console.error('Failed to get CSRF token:', error);
    return null;
  }
};

// Function to clear CSRF token cache
export const clearCSRFTokenCache = () => {
  csrfTokenCache = null;
  csrfTokenExpiry = 0;
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
  async (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Unauthorized - clear auth state and redirect to login
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      clearCSRFTokenCache();
      window.location.href = '/';
    } else if (error.response?.status === 403 && error.response?.data?.detail?.includes('CSRF')) {
      // CSRF token error - clear cache and retry
      console.warn('CSRF token error, clearing cache and retrying...');
      clearCSRFTokenCache();
      
      // Retry the request once
      if (error.config) {
        try {
          const csrfToken = await getCSRFToken();
          if (csrfToken && error.config.headers) {
            error.config.headers['X-CSRFToken'] = csrfToken;
            return api.request(error.config);
          }
        } catch (retryError) {
          console.error('Failed to retry request with new CSRF token:', retryError);
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;
