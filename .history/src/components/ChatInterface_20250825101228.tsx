import React, { useState, useEffect } from 'react';
import { Send, BarChart3, TrendingUp, Zap, AlertCircle } from 'lucide-react';
import { Platform, ChatMessage, ChatSessionCreateRequest, ChatMessageRequest, ChatMessageResponse, ChatSessionCreateResponse } from '../types';
import { API_ENDPOINTS } from '../constants';
import api from '../services/api';
import AnalysisResult from './AnalysisResult';
import AIChatBox from './AIChatBox';

interface ChatInterfaceProps {
  platform: Platform;
  onTakeAction: (action: any) => void;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ platform, onTakeAction }) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const platformConfig = {
    google: {
      placeholder: 'Ask me anything about your Google Ads performance...',
      expert: 'Google Ads Expert Analyst'
    },
    'google-new': {
      placeholder: 'Ask me anything about your Google Ads performance...',
      expert: 'Google AI Marketing Assistant'
    },
    meta: {
      placeholder: 'Ask me anything about your Meta Ads performance...',
      expert: 'Meta Ads Expert Analyst'
    }
  };

  // Create a new chat session when component mounts (only for Google platforms)
  useEffect(() => {
    if ((platform === 'google' || platform === 'google-new') && !sessionId) {
      createChatSession();
    }
  }, [platform]);

  const createChatSession = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const requestData: ChatSessionCreateRequest = {
        title: `Google Ads Analysis Session ${new Date().toLocaleDateString()}`
      };

      const response = await api.post(API_ENDPOINTS.GOOGLE_ADS_CHAT_SESSION_CREATE, requestData);
      const data: ChatSessionCreateResponse = response.data;
      
      if (data.success) {
        setSessionId(data.session_id);
        console.log('Chat session created:', data.session_id);
      } else {
        throw new Error('Failed to create chat session');
      }
    } catch (err: any) {
      console.error('Error creating chat session:', err);
      setError('Failed to create chat session. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSend = async () => {
    if (!message.trim() || !sessionId) return;

    const userMessage: ChatMessage = { 
      type: 'user', 
      content: message, 
      timestamp: new Date(),
      session_id: sessionId
    };
    
    setMessages(prev => [...prev, userMessage]);
    setMessage('');
    setIsLoading(true);
    setError(null);

    try {
      const requestData: ChatMessageRequest = {
        message: message,
        session_id: sessionId
      };

      const response = await api.post(API_ENDPOINTS.GOOGLE_ADS_CHAT_MESSAGE, requestData);
      const data: ChatMessageResponse = response.data;
      
      if (data.success) {
        const aiMessage: ChatMessage = {
          type: 'ai',
          content: extractTextFromBlocks(data.response.blocks),
          timestamp: new Date(),
          session_id: data.session_id,
          response: data.response,
          intent: data.intent
        };
        
        setMessages(prev => [...prev, aiMessage]);
      } else {
        throw new Error('Failed to get response from chatbot');
      }
    } catch (err: any) {
      console.error('Error sending message:', err);
      setError('Failed to send message. Please try again.');
      
      // Add error message to chat
      const errorMessage: ChatMessage = {
        type: 'ai',
        content: 'Sorry, I encountered an error while processing your request. Please try again.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const extractTextFromBlocks = (blocks: any[]): string => {
    return blocks
      .filter(block => block.type === 'text' && block.content)
      .map(block => block.content)
      .join('\n\n');
  };

  const renderChatMessage = (msg: ChatMessage, index: number) => {
    if (msg.type === 'user') {
      return (
        <div key={index} className="flex justify-end">
          <div className="bg-blue-600 text-white px-4 py-3 rounded-2xl max-w-md">
            {msg.content}
          </div>
        </div>
      );
    }

    // AI message with response blocks
    if (msg.response?.blocks) {
      return (
        <div key={index} className="flex justify-start">
          <div className="bg-white border border-gray-200 rounded-2xl p-6 max-w-2xl">
            {msg.response.blocks.map((block, blockIndex) => (
              <div key={blockIndex} className="mb-4 last:mb-0">
                {block.type === 'text' && (
                  <div className={`${block.style === 'paragraph' ? 'text-gray-700 leading-relaxed' : 'font-semibold text-gray-900'}`}>
                    {block.content}
                  </div>
                )}
                
                {block.type === 'actions' && block.items && (
                  <div className="mt-4">
                    <div className="flex flex-wrap gap-2">
                      {block.items.map((item) => (
                        <button
                          key={item.id}
                          onClick={() => onTakeAction({ id: item.id, label: item.label })}
                          className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm font-medium"
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
            
            {msg.intent && (
              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="text-xs text-gray-500">
                  Intent: {msg.intent.action} (Confidence: {Math.round(msg.intent.confidence * 100)}%)
                  {msg.intent.requires_auth && (
                    <span className="ml-2 text-orange-600">Requires authentication</span>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      );
    }

    // Fallback for simple AI messages
    return (
      <div key={index} className="flex justify-start">
        <div className="bg-white border border-gray-200 rounded-2xl p-6 max-w-md">
          <div className="text-gray-700">{msg.content}</div>
        </div>
      </div>
    );
  };

  const handleQuickAction = async (action: string) => {
    const quickActions = {
      'performance_report': 'Show me a comprehensive performance report for my campaigns',
      'optimization': 'What optimization opportunities do you see in my campaigns?',
      'quick_fixes': 'What immediate issues need attention in my campaigns?'
    };

    const actionMessage = quickActions[action as keyof typeof quickActions];
    if (actionMessage) {
      setMessage(actionMessage);
      // Small delay to ensure message is set before sending
      setTimeout(() => handleSend(), 100);
    }
  };

  // Render the new Google AI Chat interface
  if (platform === 'google-new') {
    const token = localStorage.getItem('accessToken') || '';
    return (
      <div className="max-w-6xl mx-auto h-[calc(100vh-200px)]">
        <div className="bg-white rounded-lg shadow-lg h-full">
          <AIChatBox token={token} />
        </div>
      </div>
    );
  }

  if (platform === 'google' && !sessionId && !isLoading) {
    return (
      <div className="max-w-4xl mx-auto text-center">
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-8">
          <AlertCircle className="w-16 h-16 text-yellow-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-yellow-800 mb-2">Setting up your chat session</h3>
          <p className="text-yellow-700 mb-4">We're preparing your Google Ads analysis environment...</p>
          <button
            onClick={createChatSession}
            className="px-6 py-3 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
          >
            Retry Setup
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Hero Section */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          {platformConfig[platform].expert}
        </h2>
        <p className="text-gray-600 text-lg">
          Transform your advertising performance with AI-powered insights and optimization
        </p>
        {sessionId && (
          <div className="mt-2 text-sm text-gray-500">
            Session ID: {sessionId.substring(0, 8)}...
          </div>
        )}
      </div>

      {/* Error Display */}
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4">
          <div className="flex items-center space-x-3">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <span className="text-red-700">{error}</span>
          </div>
        </div>
      )}

      {/* Chat Messages */}
      <div className="space-y-6 mb-6">
        {messages.map((msg, index) => renderChatMessage(msg, index))}
        
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white border border-gray-200 rounded-2xl p-6 max-w-md">
              <div className="flex items-center space-x-3">
                <div className="animate-spin w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full"></div>
                <span className="text-gray-600">Analyzing your data...</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm">
        <div className="flex space-x-4">
          <div className="flex-1">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={platformConfig[platform].placeholder}
              className="w-full resize-none border-0 focus:ring-0 text-gray-900 placeholder-gray-500"
              rows={3}
              disabled={!sessionId || isLoading}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
            />
          </div>
          <button
            onClick={handleSend}
            disabled={!message.trim() || isLoading || !sessionId}
            className="self-end p-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <button 
          onClick={() => handleQuickAction('performance_report')}
          disabled={!sessionId || isLoading}
          className="p-4 bg-white border border-gray-200 rounded-xl hover:shadow-md transition-shadow text-left disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <BarChart3 className="w-8 h-8 text-blue-600 mb-3" />
          <h3 className="font-semibold text-gray-900">Performance Report</h3>
          <p className="text-sm text-gray-600">Get comprehensive campaign analysis</p>
        </button>
        
        <button 
          onClick={() => handleQuickAction('optimization')}
          disabled={!sessionId || isLoading}
          className="p-4 bg-white border border-gray-200 rounded-xl hover:shadow-md transition-shadow text-left disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <TrendingUp className="w-8 h-8 text-green-600 mb-3" />
          <h3 className="font-semibold text-gray-900">Optimization</h3>
          <p className="text-sm text-gray-600">Find improvement opportunities</p>
        </button>
        
        <button 
          onClick={() => handleQuickAction('quick_fixes')}
          disabled={!sessionId || isLoading}
          className="p-4 bg-white border border-gray-200 rounded-xl hover:shadow-md transition-shadow text-left disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Zap className="w-8 h-8 text-purple-600 mb-3" />
          <h3 className="font-semibold text-gray-900">Quick Fixes</h3>
          <p className="text-sm text-gray-600">Immediate action recommendations</p>
        </button>
      </div>
    </div>
  );
};

export default ChatInterface;