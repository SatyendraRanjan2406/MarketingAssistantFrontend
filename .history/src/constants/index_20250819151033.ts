export const API_BASE_URL = 'http://localhost:8000';
export const API_ENDPOINTS = {
  SIGNUP: '/accounts/api/signup/',
  SIGNIN: '/accounts/api/signin/',
  SIGNOUT: '/accounts/api/signout/',
  GOOGLE_OAUTH_INITIATE: '/accounts/api/google-oauth/initiate/',
} as const;
