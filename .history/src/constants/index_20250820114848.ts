export const API_BASE_URL = 'http://localhost:8000';
export const API_ENDPOINTS = {
  SIGNUP: '/accounts/api/signup/',
  SIGNIN: '/accounts/api/signin/',
  SIGNOUT: '/accounts/api/signout/',
  GOOGLE_OAUTH_INITIATE: '/accounts/api/google-oauth/initiate/',
  GOOGLE_OAUTH_CALLBACK: '/accounts/api/google-oauth/callback/',
  GOOGLE_OAUTH_EXCHANGE_TOKENS: '/accounts/api/google-oauth/exchange-tokens/',
  GOOGLE_OAUTH_STATUS: '/accounts/api/google-oauth/status/',
  GOOGLE_ADS_ACCOUNT_SUMMARY: '/google-ads-new/api/account-summary/',
  TOKEN_REFRESH: '/accounts/api/token/refresh/',
} as const;
