import { API_BASE_URL, API_ENDPOINTS } from '../constants';
import api from './api';
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
  async logout(): Promise<{ success: boolean; error?: string }> {
    try {
      const accessToken = this.getAccessToken();
      if (accessToken) {
        const response = await api.post(API_ENDPOINTS.SIGNOUT, {}, {
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        });
        
        if (!response.data.success) {
          console.warn('Logout API call failed, but clearing local data anyway');
        }
      }
      
      // Clear all local data
      this.clearTokens();
      this.clearUser();
      this.clearGoogleOAuthStatus(); // Clear Google OAuth connection status
      
      return { success: true };
    } catch (error: any) {
      console.error('Logout error:', error);
      
      // Even if API call fails, clear local data
      this.clearTokens();
      this.clearUser();
      this.clearGoogleOAuthStatus(); // Clear Google OAuth connection status
      
      return { success: true };
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

      console.log('Initiating Google OAuth with access token...');
      
      const response = await api.get(API_ENDPOINTS.GOOGLE_OAUTH_INITIATE, {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });

      console.log('OAuth initiation response:', response.data);

      if (response.data.success && response.data.authorization_url) {
        console.log('Opening OAuth popup window...');
        console.log('Authorization URL:', response.data.authorization_url);
        
        // Try multiple popup opening strategies
        const authWindow = this.tryOpenPopup(response.data.authorization_url);
        
        if (authWindow) {
          // Store the state for verification later
          localStorage.setItem('googleOAuthState', response.data.state);
          console.log('OAuth state stored:', response.data.state);
          
          // Focus the popup window
          authWindow.focus();
          console.log('Popup window focused successfully');
          
          return { success: true };
        } else {
          console.error('All popup opening strategies failed');
          return { success: false, error: 'Failed to open OAuth window. Please check your popup blocker and try again.' };
        }
      } else {
        console.error('OAuth initiation failed - invalid response:', response.data);
        return { success: false, error: 'Failed to get authorization URL from server.' };
      }
    } catch (error: any) {
      console.error('Google OAuth initiation error:', error);
      if (error.response?.data) {
        return { success: false, error: error.response.data.message || 'Failed to initiate Google OAuth' };
      }
      return { success: false, error: 'Failed to initiate Google OAuth. Please try again.' };
    }
  }

  // Try multiple strategies to open popup window
  private tryOpenPopup(url: string): Window | null {
    const popupFeatures = [
      'width=500,height=600,scrollbars=yes,resizable=yes,menubar=no,toolbar=no,location=no,status=no',
      'width=600,height=700,scrollbars=yes,resizable=yes',
      'width=800,height=600,scrollbars=yes,resizable=yes'
    ];

    for (let i = 0; i < popupFeatures.length; i++) {
      try {
        console.log(`Trying popup strategy ${i + 1} with features:`, popupFeatures[i]);
        
        const authWindow = window.open(url, 'google-oauth', popupFeatures[i]);
        
        if (authWindow) {
          console.log(`Popup strategy ${i + 1} successful`);
          
          // Test if the window is actually accessible
          try {
            // This will throw an error if the popup is blocked
            authWindow.document;
            console.log('Popup window is accessible');
            return authWindow;
          } catch (popupError) {
            console.error(`Popup strategy ${i + 1} failed - window blocked:`, popupError);
            authWindow.close();
            continue; // Try next strategy
          }
        } else {
          console.log(`Popup strategy ${i + 1} failed - window.open returned null`);
        }
      } catch (error) {
        console.error(`Popup strategy ${i + 1} error:`, error);
        continue; // Try next strategy
      }
    }

    // If all strategies fail, try opening in same window as last resort
    console.log('All popup strategies failed, trying to open in same window...');
    try {
      window.location.href = url;
      return null; // Return null since we're redirecting
    } catch (error) {
      console.error('Failed to open in same window:', error);
      return null;
    }
  }

  // Check Google OAuth connection status
  async checkGoogleOAuthStatus(): Promise<{ success: boolean; connected: boolean; error?: string }> {
    try {
      const accessToken = this.getAccessToken();
      if (!accessToken) {
        return { success: false, connected: false, error: 'No access token found' };
      }

      const response = await api.get(API_ENDPOINTS.GOOGLE_OAUTH_STATUS, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        }
      });

      if (response.data.success) {
        return { 
          success: true, 
          connected: response.data.connected || false,
          error: response.data.message
        };
      } else {
        return { 
          success: false, 
          connected: false, 
          error: response.data.message || 'Failed to check connection status' 
        };
      }
    } catch (error: any) {
      console.error('Check Google OAuth status error:', error);
      if (error.response?.data) {
        return { 
          success: false, 
          connected: false, 
          error: error.response.data.message || 'Failed to check connection status' 
        };
      }
      return { success: false, connected: false, error: 'Failed to check connection status' };
    }
  }

  // Get Google Ads account summary
  async getGoogleAdsAccountSummary(): Promise<{ success: boolean; data?: GoogleAdsAccountSummary; error?: string }> {
    try {
      const accessToken = this.getAccessToken();
      if (!accessToken) {
        return { success: false, error: 'No access token found' };
      }

      const response = await api.get(API_ENDPOINTS.GOOGLE_ADS_ACCOUNT_SUMMARY, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        }
      });

      if (response.data.success) {
        return { 
          success: true, 
          data: response.data.summary
        };
      } else {
        return { 
          success: false, 
          error: response.data.message || 'Failed to get account summary' 
        };
      }
    } catch (error: any) {
      console.error('Get Google Ads account summary error:', error);
      if (error.response?.data) {
        return { 
          success: false, 
          error: error.response.data.message || 'Failed to get account summary' 
        };
      }
      return { success: false, error: 'Failed to get account summary' };
    }
  }

  // Sync Google Ads data
  async syncGoogleAdsData(syncType: string = 'weekly', weeksBack: number = 1): Promise<{ success: boolean; data?: any; error?: string }> {
    try {
      const accessToken = this.getAccessToken();
      if (!accessToken) {
        return { success: false, error: 'No access token found' };
      }

      console.log(`Starting Google Ads data sync: ${syncType}, ${weeksBack} weeks back`);

      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.GOOGLE_ADS_SYNC_DATA}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sync_type: "google_ads_api",
          weeks_back: weeksBack
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Google Ads sync failed:', response.status, errorText);
        return { 
          success: false, 
          error: `Sync failed (${response.status}): ${errorText || 'Unknown error'}` 
        };
      }

      const data = await response.json();
      
      if (data.success) {
        console.log('Google Ads data sync completed successfully');
        return { 
          success: true, 
          data: data.data || data
        };
      } else {
        return { 
          success: false, 
          error: data.message || 'Failed to sync Google Ads data' 
        };
      }
    } catch (error: any) {
      console.error('Google Ads sync error:', error);
      return { success: false, error: 'Failed to sync Google Ads data' };
    }
  }

  // Refresh access token using refresh token
  async refreshAccessToken(): Promise<{ success: boolean; accessToken?: string; error?: string }> {
    try {
      const refreshToken = this.getRefreshToken();
      if (!refreshToken) {
        return { success: false, error: 'No refresh token found' };
      }

      console.log('Refreshing access token...');
      
      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.TOKEN_REFRESH}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          refresh: refreshToken
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Token refresh failed:', response.status, errorText);
        return { success: false, error: `Token refresh failed: ${errorText}` };
      }

      const data = await response.json();
      
      if (data.access) {
        // Store the new access token
        this.setAccessToken(data.access);
        console.log('Access token refreshed successfully');
        return { success: true, accessToken: data.access };
      } else {
        return { success: false, error: 'No access token in refresh response' };
      }
    } catch (error: any) {
      console.error('Token refresh error:', error);
      return { success: false, error: 'Failed to refresh access token' };
    }
  }

  // Check if token refresh is needed and handle it proactively
  async ensureValidToken(): Promise<{ success: boolean; accessToken?: string; error?: string }> {
    const accessToken = this.getAccessToken();
    if (!accessToken) {
      return { success: false, error: 'No access token found' };
    }

    // For now, we'll let the API interceptor handle token refresh
    // This method can be used for proactive token refresh if needed
    return { success: true, accessToken };
  }

  // Global error handler for authentication issues
  async handleAuthError(error: any): Promise<{ shouldRetry: boolean; error?: string }> {
    if (error?.response?.status === 401) {
      console.log('Handling 401 authentication error...');
      
      try {
        const refreshResult = await this.refreshAccessToken();
        if (refreshResult.success) {
          console.log('Token refreshed successfully, request can be retried');
          return { shouldRetry: true };
        } else {
          console.log('Token refresh failed, user needs to login again');
          this.logout();
          return { shouldRetry: false, error: 'Authentication expired. Please login again.' };
        }
      } catch (refreshError) {
        console.error('Error during token refresh:', refreshError);
        this.logout();
        return { shouldRetry: false, error: 'Authentication failed. Please login again.' };
      }
    }
    
    return { shouldRetry: false, error: error?.message || 'An error occurred' };
  }

  // Store Google OAuth connection status
  setGoogleOAuthConnected(connected: boolean): void {
    sessionStorage.setItem('googleOAuthConnected', connected.toString());
  }

  // Check if Google OAuth is already connected
  isGoogleOAuthConnected(): boolean {
    const connected = sessionStorage.getItem('googleOAuthConnected');
    return connected === 'true';
  }

  // Clear Google OAuth connection status
  clearGoogleOAuthStatus(): void {
    sessionStorage.removeItem('googleOAuthConnected');
  }

  // Disconnect Google Ads (clear connection status)
  disconnectGoogleAds(): void {
    this.clearGoogleOAuthStatus();
    console.log('Google Ads disconnected');
  }

  // Validate Google OAuth connection with backend (always fresh check)
  async validateGoogleOAuthConnection(): Promise<{ connected: boolean; error?: string }> {
    try {
      const accessToken = this.getAccessToken();
      if (!accessToken) {
        return { connected: false, error: 'No access token found' };
      }

      console.log('Validating Google OAuth connection with backend...');
      
      const response = await api.get(API_ENDPOINTS.GOOGLE_OAUTH_STATUS, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        }
      });

      if (response.data.success) {
        const isConnected = response.data.connected || false;
        console.log('Google OAuth connection validation result:', isConnected);
        
        // Update session storage based on backend response
        this.setGoogleOAuthConnected(isConnected);
        
        return { 
          connected: isConnected,
          error: response.data.message
        };
      } else {
        console.log('Google OAuth connection validation failed:', response.data.message);
        this.setGoogleOAuthConnected(false);
        return { 
          connected: false, 
          error: response.data.message || 'Failed to validate connection' 
        };
      }
    } catch (error: any) {
      console.error('Google OAuth connection validation error:', error);
      
      // On any error, assume not connected
      this.setGoogleOAuthConnected(false);
      
      if (error.response?.status === 401) {
        return { connected: false, error: 'Authentication expired' };
      }
      
      return { connected: false, error: 'Failed to validate connection' };
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
