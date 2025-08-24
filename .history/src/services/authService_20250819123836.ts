import api from './api';
import { SignupRequest, LoginRequest, AuthResponse, User } from '../types';

class AuthService {
  // Signup user
  async signup(userData: SignupRequest): Promise<AuthResponse> {
    try {
      // Convert to form data format as expected by the backend
      const formData = new URLSearchParams();
      Object.entries(userData).forEach(([key, value]) => {
        if (value !== undefined) {
          formData.append(key, value);
        }
      });

      const response = await api.post('/accounts/signup/', formData, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });

      if (response.data.success) {
        // Store user info in localStorage
        const user: User = {
          id: 'temp-id', // Backend doesn't return user ID in response
          name: `${userData.first_name} ${userData.last_name}`,
          email: userData.email,
        };
        localStorage.setItem('user', JSON.stringify(user));
      }

      return response.data;
    } catch (error: any) {
      if (error.response?.data) {
        return error.response.data;
      }
      throw new Error('Signup failed');
    }
  }

  // Login user
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    try {
      const formData = new URLSearchParams();
      formData.append('username', credentials.username);
      formData.append('password', credentials.password);

      const response = await api.post('/accounts/signin/', formData, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });

      if (response.data.success) {
        // Store user info in localStorage
        // Note: Backend doesn't return user details in login response
        // We'll need to fetch user details separately or store them during signup
        const user: User = {
          id: 'temp-id',
          name: credentials.username, // Use username as fallback
          email: '', // Will be updated when we get user details
        };
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('authToken', 'session-token'); // Placeholder for session
      }

      return response.data;
    } catch (error: any) {
      if (error.response?.data) {
        return error.response.data;
      }
      throw new Error('Login failed');
    }
  }

  // Logout user
  async logout(): Promise<void> {
    try {
      await api.get('/accounts/signout/');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear local storage regardless of API call success
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
    }
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    const token = localStorage.getItem('authToken');
    const user = localStorage.getItem('user');
    return !!(token && user);
  }

  // Get current user
  getCurrentUser(): User | null {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch {
        return null;
      }
    }
    return null;
  }

  // Clear auth data
  clearAuth(): void {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
  }
}

export default new AuthService();
