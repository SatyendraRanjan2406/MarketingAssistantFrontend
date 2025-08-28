export type Platform = 'google' | 'meta';

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface GoogleAdsAccountSummary {
  connected_accounts: number;
  active_campaigns: number;
  monthly_spend: number;
  message: string;
}

export interface AccountSummaryResponse {
  success: boolean;
  summary: GoogleAdsAccountSummary;
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

// Google Ads Chatbot types
export interface ChatSessionCreateRequest {
  title: string;
}

export interface ChatSessionCreateResponse {
  success: boolean;
  session_id: string;
  message: string;
}

export interface ChatMessageRequest {
  message: string;
  session_id: string;
}

export interface ChatBlock {
  type: 'text' | 'actions';
  content?: string;
  style?: string;
  title?: string | null;
  items?: ChatActionItem[];
}

export interface ChatActionItem {
  id: string;
  label: string;
}

export interface ChatResponse {
  blocks: ChatBlock[];
  session_id: string | null;
  metadata: any | null;
}

export interface ChatIntent {
  action: string;
  confidence: number;
  parameters: Record<string, any>;
  requires_auth: boolean;
}

export interface ChatMessageResponse {
  success: boolean;
  session_id: string;
  response: ChatResponse;
  intent: ChatIntent;
}

export interface ChatMessage {
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  session_id?: string;
  response?: ChatResponse;
  intent?: ChatIntent;
}