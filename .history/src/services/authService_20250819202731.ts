import api from './api';
import { API_ENDPOINTS } from '../constants';
import { User } from '../types';

interface SignupRequest {
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  password1: string;
  password2: string;
  company_name: string;
}

interface LoginRequest {
  username: string;
  password: string;
}

interface AuthResponse {
  success: boolean;
  message: string;
  access_token?: string;
  refresh_token?: string;
  user?: {
    id: number;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
    company_name: string;
  };
  errors?: Record<string, string[]>;
}

class AuthService {
  private readonly ACCESS_TOKEN_KEY = 'accessToken';
  private readonly REFRESH_TOKEN_KEY = 'refreshToken';
  private readonly USER_KEY = 'user';

  // Signup user
  async signup(userData: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    company: string;
  }): Promise<{ success: boolean; user?: User; error?: string }> {
    try {
      // Convert to form data format as expected by the backend
      const formData = new URLSearchParams();
      const username = userData.email.split('@')[0]; // Generate username from email
      
      formData.append('username', username);
      formData.append('first_name', userData.firstName);
      formData.append('last_name', userData.lastName);
      formData.append('email', userData.email);
      formData.append('password1', userData.password);
      formData.append('password2', userData.password);
      formData.append('company_name', userData.company);

      const response = await api.post(API_ENDPOINTS.SIGNUP, formData, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });

      if (response.data.success) {
        const authData: AuthResponse = response.data;
        
        // Create user object from API response
        const user: User = {
          id: authData.user?.id?.toString() || 'temp-id',
          name: `${authData.user?.first_name || userData.firstName} ${authData.user?.last_name || userData.lastName}`,
          email: authData.user?.email || userData.email
        };
        
        // Store tokens and user info in localStorage
        if (authData.access_token) {
          this.setAccessToken(authData.access_token);
        }
        if (authData.refresh_token) {
          this.setRefreshToken(authData.refresh_token);
        }
        this.setUser(user);
        
        return { success: true, user };
      } else {
        // Handle validation errors
        if (response.data.errors) {
          const errorMessages = Object.values(response.data.errors).flat();
          return { success: false, error: errorMessages.join(', ') };
        }
        return { success: false, error: response.data.message || 'Signup failed' };
      }
    } catch (error: any) {
      console.error('Signup error:', error);
      if (error.response?.data) {
        if (error.response.data.errors) {
          const errorMessages = Object.values(error.response.data.errors).flat();
          return { success: false, error: errorMessages.join(', ') };
        }
        return { success: false, error: error.response.data.message || 'Signup failed' };
      }
      return { success: false, error: 'Signup failed. Please try again.' };
    }
  }

  // Login user
  async login(email: string, password: string): Promise<{ success: boolean; user?: User; error?: string }> {
    try {
      const formData = new URLSearchParams();
      const username = email.split('@')[0]; // Use email prefix as username
      
      formData.append('username', username);
      formData.append('password', password);

      const response = await api.post(API_ENDPOINTS.SIGNIN, formData, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });

      if (response.data.success) {
        const authData: AuthResponse = response.data;
        
        // Create user object from response or use email
        const user: User = {
          id: authData.user?.id?.toString() || 'temp-id',
          name: `${authData.user?.first_name || ''} ${authData.user?.last_name || ''}`.trim() || username,
          email: authData.user?.email || email
        };
        
        // Store tokens and user info in localStorage
        if (authData.access_token) {
          this.setAccessToken(authData.access_token);
        }
        if (authData.refresh_token) {
          this.setRefreshToken(authData.refresh_token);
        }
        this.setUser(user);
        
        return { success: true, user };
      } else {
        return { success: false, error: response.data.message || 'Login failed' };
      }
    } catch (error: any) {
      console.error('Login error:', error);
      if (error.response?.data) {
        if (error.response.data.errors) {
          const errorMessages = Object.values(error.response.data.errors).flat();
          return { success: false, error: errorMessages.join(', ') };
        }
        return { success: false, error: error.response.data.message || 'Login failed' };
      }
      return { success: false, error: 'Login failed. Please try again.' };
    }
  }

  // Logout user
  async logout(): Promise<void> {
    try {
      await api.get(API_ENDPOINTS.SIGNOUT);
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear local storage regardless of API call success
      this.clearTokens();
      this.clearUser();
    }
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    const accessToken = this.getAccessToken();
    const user = this.getUser();
    return !!(accessToken && user);
  }

  // Get current user
  getCurrentUser(): User | null {
    return this.getUser();
  }

  // Get access token
  getAccessToken(): string | null {
    return localStorage.getItem(this.ACCESS_TOKEN_KEY);
  }

  // Get refresh token
  getRefreshToken(): string | null {
    return localStorage.getItem(this.REFRESH_TOKEN_KEY);
  }

  // Initiate Google OAuth flow
  async initiateGoogleOAuth(): Promise<{ success: boolean; error?: string }> {
    try {
      const accessToken = this.getAccessToken();
      if (!accessToken) {
        return { success: false, error: 'No access token found. Please login again.' };
      }

      // Check if OAuth is already in progress
      const existingState = sessionStorage.getItem('googleOAuthState') || localStorage.getItem('googleOAuthState');
      if (existingState) {
        console.warn('OAuth already in progress with state:', existingState);
        return { success: false, error: 'OAuth flow already in progress. Please wait for completion.' };
      }

      console.log('Initiating Google OAuth with access token:', accessToken);
      console.log('API endpoint:', API_ENDPOINTS.GOOGLE_OAUTH_INITIATE);

      const response = await api.get(API_ENDPOINTS.GOOGLE_OAUTH_INITIATE, {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });

      console.log('Google OAuth API response:', response.data);

      if (response.data.success && response.data.authorization_url) {
        // Clear any existing OAuth state first
        sessionStorage.removeItem('googleOAuthState');
        localStorage.removeItem('googleOAuthState');
        
        // Store the new state for verification later
        // Use sessionStorage to ensure it's available in the same session
        sessionStorage.setItem('googleOAuthState', response.data.state);
        console.log('Stored OAuth state in sessionStorage:', response.data.state);
        console.log('Current sessionStorage googleOAuthState:', sessionStorage.getItem('googleOAuthState'));
        
        // Also store in localStorage as backup
        localStorage.setItem('googleOAuthState', response.data.state);
        console.log('Also stored OAuth state in localStorage as backup:', response.data.state);
        
        // Open Google OAuth consent screen in a new window
        const authWindow = window.open(
          response.data.authorization_url,
          'google-oauth',
          'width=500,height=600,scrollbars=yes,resizable=yes'
        );

        if (authWindow) {
          // Set up message listener for OAuth completion
          const messageListener = (event: MessageEvent) => {
            if (event.data.type === 'GOOGLE_OAUTH_SUCCESS' || event.data.type === 'GOOGLE_OAUTH_FAILURE') {
              console.log('Received OAuth completion message:', event.data.type);
              window.removeEventListener('message', messageListener);
            }
          };
          
          window.addEventListener('message', messageListener);

          return { success: true };
        } else {
          // Clean up state if window failed to open
          sessionStorage.removeItem('googleOAuthState');
          localStorage.removeItem('googleOAuthState');
          return { success: false, error: 'Failed to open OAuth window. Please check your popup blocker.' };
        }
      } else {
        console.error('Google OAuth API response missing required data:', response.data);
        return { success: false, error: 'Failed to get authorization URL from server.' };
      }
    } catch (error: any) {
      console.error('Google OAuth initiation error:', error);
      // Clean up any partial state
      sessionStorage.removeItem('googleOAuthState');
      localStorage.removeItem('googleOAuthState');
      if (error.response?.data) {
        return { success: false, error: error.response.data.message || 'Failed to initiate Google OAuth' };
      }
      return { success: false, error: 'Failed to initiate Google OAuth. Please try again.' };
    }
  }

  // Check Google OAuth connection status
  async checkGoogleOAuthStatus(): Promise<{ success: boolean; connected: boolean; error?: string }> {
    try {
      const accessToken = this.getAccessToken();
      if (!accessToken) {
        return { success: false, connected: false, error: 'No access token found' };
      }

      // You would implement an API call here to check the connection status
      // For now, we'll return a mock response
      return { success: true, connected: false };
    } catch (error) {
      console.error('Check Google OAuth status error:', error);
      return { success: false, connected: false, error: 'Failed to check connection status' };
    }
  }

  // Private methods
  private setAccessToken(token: string): void {
    localStorage.setItem(this.ACCESS_TOKEN_KEY, token);
  }

  private setRefreshToken(token: string): void {
    localStorage.setItem(this.REFRESH_TOKEN_KEY, token);
  }

  private setUser(user: User): void {
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
  }

  private clearTokens(): void {
    localStorage.removeItem(this.ACCESS_TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
  }

  private clearUser(): void {
    localStorage.removeItem(this.USER_KEY);
  }

  private getUser(): User | null {
    const userStr = localStorage.getItem(this.USER_KEY);
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch {
        return null;
      }
    }
    return null;
  }
}

export default new AuthService();
