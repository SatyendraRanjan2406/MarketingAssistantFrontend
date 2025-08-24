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