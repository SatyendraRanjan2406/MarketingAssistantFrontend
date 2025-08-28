export type Platform = 'google' | 'google-new' | 'meta';

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
  type: 'text' | 'table' | 'list' | 'actions' | 'chart' | 'metric' | 'image' | 
         // Google Ads analysis blocks
         'budget_optimizations' | 'campaign_consistency_analysis' | 'sitelink_analysis' |
         'landing_page_analysis' | 'duplicate_keyword_analysis' | 'keyword_trends_analysis' |
         'auction_insights_analysis' | 'search_term_analysis' | 'ads_showing_time_analysis' |
         'device_performance_detailed_analysis' | 'location_performance_analysis' |
         'landing_page_mobile_analysis' | 'tcpa_optimizations' | 'budget_allocation_optimizations' |
         'negative_keyword_suggestions' |
         // RAG enhanced responses
         'rag_enhanced_response';
  content?: string;
  style?: string;
  title?: string | null;
  items?: ChatActionItem[];
  // Table specific
  columns?: string[];
  rows?: any[][];
  sortable?: boolean;
  // List specific
  listStyle?: 'dotted' | 'numbered' | 'bulleted';
  // Chart specific
  chart_type?: 'pie' | 'bar' | 'line';
  labels?: string[];
  datasets?: Array<{ label: string; data: number[]; backgroundColor?: string[] }>;
  options?: any;
  // Metric specific
  value?: string;
  change?: string;
  trend?: 'up' | 'down' | 'neutral';
  // Analysis specific
  account?: any;
  timestamp?: string;
  // RAG specific
  response_type?: 'rag' | 'direct';
  rag_metadata?: RAGMetadata;
  blocks?: ChatBlock[];
}

// RAG-specific types
export interface RAGMetadata {
  context_used: boolean;
  context_sources?: string[];
  selection_reason: string;
}

export interface RAGEnhancedResponse {
  response_type: 'rag' | 'direct';
  blocks: ChatBlock[];
  rag_metadata: RAGMetadata;
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
  response: ChatResponse | RAGEnhancedResponse;
  intent: ChatIntent;
  rag_enhanced_response?: RAGEnhancedResponse;
}

export interface ChatMessage {
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  session_id?: string;
  response?: ChatResponse;
  intent?: ChatIntent;
}

// Enhanced chat types for the new AI chat box
export interface ChatSession {
  id: string;
  title: string;
  created_at: string;
  updated_at: string;
}

export interface ChatSessionsResponse {
  success: boolean;
  sessions: ChatSession[];
}

export interface ChatHistoryResponse {
  success: boolean;
  messages: ChatMessage[];
}