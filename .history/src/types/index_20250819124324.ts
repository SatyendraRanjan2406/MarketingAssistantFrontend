export type Platform = 'google' | 'meta';

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface Campaign {
  id: string;
  name: string;
  platform: Platform;
  status: 'active' | 'paused' | 'ended';
  spend: number;
  roas: number;
  ctr: number;
}

export interface Insight {
  id: string;
  type: 'performance' | 'alert' | 'optimization';
  title: string;
  description: string;
  value: string;
  change: 'positive' | 'negative' | 'neutral';
  timestamp: Date;
}

export interface ActionItem {
  id: string;
  title: string;
  description: string;
  impact: string;
  priority: 'high' | 'medium' | 'low';
  type: string;
}

// Authentication types
export interface SignupRequest {
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  password1: string;
  password2: string;
  company_name: string;
  phone_number?: string;
  address?: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  redirect_url: string;
  errors?: Record<string, string[]>;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token?: string;
}