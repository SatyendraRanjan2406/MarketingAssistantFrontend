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
  user?: User;
  token?: string;
  errors?: Record<string, string[]>;
}

class AuthService {
  private readonly TOKEN_KEY = 'authToken';
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
        // Create user object from response or form data
        const user: User = {
          id: response.data.user?.id || 'temp-id',
          name: `${userData.firstName} ${userData.lastName}`,
          email: userData.email
        };
        
        // Store user info in localStorage
        this.setUser(user);
        
        // If token is returned, store it
        if (response.data.token) {
          this.setToken(response.data.token);
        }
        
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
        // Create user object from response or use email
        const user: User = {
          id: response.data.user?.id || 'temp-id',
          name: response.data.user?.name || username,
          email: email
        };
        
        // Store user info in localStorage
        this.setUser(user);
        
        // If token is returned, store it
        if (response.data.token) {
          this.setToken(response.data.token);
        }
        
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
      this.clearToken();
      this.clearUser();
    }
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    const token = this.getToken();
    const user = this.getUser();
    return !!(token && user);
  }

  // Get current user
  getCurrentUser(): User | null {
    return this.getUser();
  }

  // Get token
  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  // Private methods
  private setToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  private setUser(user: User): void {
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
  }

  private clearToken(): void {
    localStorage.removeItem(this.TOKEN_KEY);
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
