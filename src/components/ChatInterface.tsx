import React, { useState } from 'react';
import { Send, BarChart3, TrendingUp, Zap } from 'lucide-react';
import { Platform } from '../types';
import AnalysisResult from './AnalysisResult';

interface ChatInterfaceProps {
  platform: Platform;
  onTakeAction: (action: any) => void;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ platform, onTakeAction }) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const platformConfig = {
    google: {
      placeholder: 'Ask me anything about your Google Ads performance...',
      expert: 'Google Ads Expert Analyst'
    },
    meta: {
      placeholder: 'Ask me anything about your Meta Ads performance...',
      expert: 'Meta Ads Expert Analyst'
    }
  };

  const handleSend = async () => {
    if (!message.trim()) return;

    const userMessage = { type: 'user', content: message, timestamp: new Date() };
    setMessages(prev => [...prev, userMessage]);
    setMessage('');
    setIsLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = {
        type: 'ai',
        content: 'Based on your campaign data analysis...',
        timestamp: new Date(),
        analysis: {
          keyTakeaways: [
            'ROAS has increased by 30% over the last 7 days',
            'CPM trending up 45% - requires immediate attention',
            'Top performing ad sets showing 15% CTR improvement'
          ],
          recommendations: [
            {
              title: 'Budget Reallocation',
              description: 'Shift $2,000 from underperforming campaigns to high-ROAS segments',
              impact: 'Expected 25% ROAS improvement',
              priority: 'high'
            },
            {
              title: 'Audience Optimization',
              description: 'Expand successful lookalike audiences by 2M reach',
              impact: 'Projected 40% conversion increase',
              priority: 'medium'
            }
          ],
          charts: true,
          tables: true
        }
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsLoading(false);
    }, 2000);
  };

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
      </div>

      {/* Chat Messages */}
      <div className="space-y-6 mb-6">
        {messages.map((msg, index) => (
          <div key={index} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
            {msg.type === 'user' ? (
              <div className="bg-blue-600 text-white px-4 py-3 rounded-2xl max-w-md">
                {msg.content}
              </div>
            ) : (
              <AnalysisResult 
                analysis={msg.analysis} 
                platform={platform}
                onTakeAction={onTakeAction}
              />
            )}
          </div>
        ))}
        
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
            disabled={!message.trim() || isLoading}
            className="self-end p-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <button className="p-4 bg-white border border-gray-200 rounded-xl hover:shadow-md transition-shadow text-left">
          <BarChart3 className="w-8 h-8 text-blue-600 mb-3" />
          <h3 className="font-semibold text-gray-900">Performance Report</h3>
          <p className="text-sm text-gray-600">Get comprehensive campaign analysis</p>
        </button>
        
        <button className="p-4 bg-white border border-gray-200 rounded-xl hover:shadow-md transition-shadow text-left">
          <TrendingUp className="w-8 h-8 text-green-600 mb-3" />
          <h3 className="font-semibold text-gray-900">Optimization</h3>
          <p className="text-sm text-gray-600">Find improvement opportunities</p>
        </button>
        
        <button className="p-4 bg-white border border-gray-200 rounded-xl hover:shadow-md transition-shadow text-left">
          <Zap className="w-8 h-8 text-purple-600 mb-3" />
          <h3 className="font-semibold text-gray-900">Quick Fixes</h3>
          <p className="text-sm text-gray-600">Immediate action recommendations</p>
        </button>
      </div>
    </div>
  );
};

export default ChatInterface;