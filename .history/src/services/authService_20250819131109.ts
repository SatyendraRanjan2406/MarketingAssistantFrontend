import { User } from '../types';

class AuthService {
  private readonly TOKEN_KEY = 'authToken';
  private readonly USER_KEY = 'user';

  // Login user
  async login(email: string, password: string): Promise<{ success: boolean; user?: User; error?: string }> {
    try {
      // Simulate API call - replace with actual API endpoint
      // const response = await api.post('/auth/login', { email, password });
      
      // For demo purposes, simulate successful login
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simulate user data from API response
      const user: User = {
        id: '1',
        name: email.split('@')[0], // Use email prefix as name for demo
        email: email
      };
      
      // Store token and user data
      const token = this.generateToken();
      this.setToken(token);
      this.setUser(user);
      
      return { success: true, user };
    } catch (error) {
      return { success: false, error: 'Login failed. Please try again.' };
    }
  }

  // Signup user
  async signup(userData: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    company: string;
  }): Promise<{ success: boolean; user?: User; error?: string }> {
    try {
      // Simulate API call - replace with actual API endpoint
      // const response = await api.post('/auth/signup', userData);
      
      // For demo purposes, simulate successful signup
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Create user object
      const user: User = {
        id: '1',
        name: `${userData.firstName} ${userData.lastName}`,
        email: userData.email
      };
      
      // Store token and user data
      const token = this.generateToken();
      this.setToken(token);
      this.setUser(user);
      
      return { success: true, user };
    } catch (error) {
      return { success: false, error: 'Signup failed. Please try again.' };
    }
  }

  // Logout user
  logout(): void {
    this.clearToken();
    this.clearUser();
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

  private generateToken(): string {
    // Generate a simple token for demo purposes
    // In production, this should come from the backend
    return 'demo-token-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
  }
}

export default new AuthService();
