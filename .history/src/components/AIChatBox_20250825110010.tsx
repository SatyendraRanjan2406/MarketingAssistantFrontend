import React, { useState, useEffect, useRef } from 'react';
import ChatApiService from '../services/chatApi';
import { 
  TextBlock, 
  TableBlock, 
  ListBlock, 
  ActionBlock, 
  ChartBlock, 
  MetricBlock 
} from './ChatBlocks';

interface AIChatBoxProps {
  token: string;
  className?: string;
}

const AIChatBox: React.FC<AIChatBoxProps> = ({ token, className = '' }) => {
  const [messages, setMessages] = useState<any[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [sessions, setSessions] = useState<any[]>([]);
  
  const chatApi = new ChatApiService(token);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadSessions();
    createNewSession();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadSessions = async () => {
    try {
      const response = await chatApi.getSessions();
      if (response.success) {
        setSessions(response.sessions || []);
      }
    } catch (error) {
      console.error('Failed to load sessions:', error);
    }
  };

  const createNewSession = async () => {
    try {
      const response = await chatApi.createSession('New Chat Session');
      if (response.success) {
        setCurrentSessionId(response.session_id);
      }
    } catch (error) {
      console.error('Failed to create session:', error);
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || !currentSessionId) return;

    const userMessage = {
      id: Date.now(),
      role: 'user',
      content: inputMessage,
      timestamp: new Date().toISOString(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await chatApi.sendMessage(inputMessage, currentSessionId);
      
      if (response.success) {
        const aiMessage = {
          id: Date.now() + 1,
          role: 'assistant',
          response: response.response,
          intent: response.intent,
          timestamp: new Date().toISOString(),
        };
        setMessages(prev => [...prev, aiMessage]);
      } else {
        // Handle error
        const errorMessage = {
          id: Date.now() + 1,
          role: 'assistant',
          content: `Error: ${response.error}`,
          timestamp: new Date().toISOString(),
        };
        setMessages(prev => [...prev, errorMessage]);
      }
    } catch (error) {
      console.error('Failed to send message:', error);
      const errorMessage = {
        id: Date.now() + 1,
        role: 'assistant',
        content: 'Failed to send message. Please try again.',
        timestamp: new Date().toISOString(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleActionClick = (actionId: string) => {
    let message = '';
    
    switch (actionId) {
      case 'connect_accounts':
        message = "Connect my Google Ads accounts";
        break;
      case 'create_campaign':
        message = "Help me create a new Google Ads campaign";
        break;
      case 'optimize_campaign':
        message = "Optimize my existing campaigns for better performance";
        break;
      case 'check_campaign_consistency':
        message = "Check keyword-ad consistency and ad group alignment";
        break;
      case 'check_sitelinks':
        message = "Check if 4-6 sitelinks are present and optimized";
        break;
      case 'check_landing_page_url':
        message = "Validate landing page URL functionality and keyword relevance";
        break;
      case 'check_duplicate_keywords':
        message = "Identify duplicate keywords across campaigns and ad groups";
        break;
      case 'analyze_keyword_trends':
        message = "Monitor high-potential keywords with increasing search volume";
        break;
      case 'analyze_auction_insights':
        message = "Analyze competition and competitor ad strategies";
        break;
      case 'analyze_search_terms':
        message = "Review search terms for negative keyword opportunities";
        break;
      case 'analyze_ads_showing_time':
        message = "Analyze hour-of-day performance for bid optimization";
        break;
      case 'analyze_device_performance_detailed':
        message = "Analyze device performance for bid adjustments";
        break;
      case 'analyze_location_performance':
        message = "Analyze city-level performance and optimization";
        break;
      case 'analyze_landing_page_mobile':
        message = "Check mobile speed score and optimization";
        break;
      case 'optimize_tcpa':
        message = "Provide Target CPA optimization recommendations";
        break;
      case 'optimize_budget_allocation':
        message = "Optimize campaign budget allocation";
        break;
      case 'suggest_negative_keywords':
        message = "Suggest negative keyword exclusions";
        break;
      default:
        message = `I want to ${actionId.replace(/_/g, ' ')}`;
    }

    if (message) {
      setInputMessage(message);
      // Small delay to ensure message is set before sending
      setTimeout(() => handleSendMessage(), 100);
    }
  };

  const renderMessage = (message: any) => {
    if (message.role === 'user') {
      return (
        <div className="flex justify-end mb-4">
          <div className="bg-blue-500 text-white rounded-lg px-4 py-2 max-w-xs lg:max-w-md">
            {message.content}
          </div>
        </div>
      );
    }

    if (message.role === 'assistant') {
      return (
        <div className="flex justify-start mb-4">
          <div className="bg-gray-100 rounded-lg px-4 py-2 max-w-xs lg:max-w-md">
            {message.response?.blocks ? (
              <div className="space-y-3">
                {message.response.blocks.map((block: any, index: number) => (
                  <div key={index}>
                    {renderBlock(block)}
                  </div>
                ))}
              </div>
            ) : (
              <div>{message.content}</div>
            )}
          </div>
        </div>
      );
    }

    return null;
  };

  const renderBlock = (block: any) => {
    switch (block.type) {
      case 'text':
        return <TextBlock {...block} />;
      case 'table':
        return <TableBlock {...block} />;
      case 'list':
        return <ListBlock {...block} />;
      case 'actions':
        return <ActionBlock {...block} />;
      case 'chart':
        return <ChartBlock {...block} />;
      case 'metric':
        return <MetricBlock {...block} />;
      
      // Google Ads analysis blocks
      case 'budget_optimizations':
        return (
          <div className="bg-white rounded-lg border p-4">
            <h3 className="font-semibold text-gray-800 mb-3">Budget Optimization Recommendations</h3>
            <div className="text-gray-700">{block.content || 'Budget optimization analysis will appear here.'}</div>
          </div>
        );
      
      case 'campaign_consistency_analysis':
        return (
          <div className="bg-white rounded-lg border p-4">
            <h3 className="font-semibold text-gray-800 mb-3">Campaign Consistency Analysis</h3>
            <div className="text-gray-700">{block.content || 'Campaign consistency analysis will appear here.'}</div>
          </div>
        );
      
      case 'sitelink_analysis':
        return (
          <div className="bg-white rounded-lg border p-4">
            <h3 className="font-semibold text-gray-800 mb-3">Sitelink Analysis</h3>
            <div className="text-gray-700">{block.content || 'Sitelink analysis will appear here.'}</div>
          </div>
        );
      
      case 'landing_page_analysis':
        return (
          <div className="bg-white rounded-lg border p-4">
            <h3 className="font-semibold text-gray-800 mb-3">Landing Page Analysis</h3>
            <div className="text-gray-700">{block.content || 'Landing page analysis will appear here.'}</div>
          </div>
        );
      
      case 'duplicate_keyword_analysis':
        return (
          <div className="bg-white rounded-lg border p-4">
            <h3 className="font-semibold text-gray-800 mb-3">Duplicate Keyword Analysis</h3>
            <div className="text-gray-700">{block.content || 'Duplicate keyword analysis will appear here.'}</div>
          </div>
        );
      
      case 'keyword_trends_analysis':
        return (
          <div className="bg-white rounded-lg border p-4">
            <h3 className="font-semibold text-gray-800 mb-3">Keyword Trends Analysis</h3>
            <div className="text-gray-700">{block.content || 'Keyword trends analysis will appear here.'}</div>
          </div>
        );
      
      case 'auction_insights_analysis':
        return (
          <div className="bg-white rounded-lg border p-4">
            <h3 className="font-semibold text-gray-800 mb-3">Auction Insights Analysis</h3>
            <div className="text-gray-700">{block.content || 'Auction insights analysis will appear here.'}</div>
          </div>
        );
      
      case 'search_term_analysis':
        return (
          <div className="bg-white rounded-lg border p-4">
            <h3 className="font-semibold text-gray-800 mb-3">Search Term Analysis</h3>
            <div className="text-gray-700">{block.content || 'Search term analysis will appear here.'}</div>
          </div>
        );
      
      case 'ads_showing_time_analysis':
        return (
          <div className="bg-white rounded-lg border p-4">
            <h3 className="font-semibold text-gray-800 mb-3">Ads Showing Time Analysis</h3>
            <div className="text-gray-700">{block.content || 'Ads showing time analysis will appear here.'}</div>
          </div>
        );
      
      case 'device_performance_detailed_analysis':
        return (
          <div className="bg-white rounded-lg border p-4">
            <h3 className="font-semibold text-gray-800 mb-3">Device Performance Analysis</h3>
            <div className="text-gray-700">{block.content || 'Device performance analysis will appear here.'}</div>
          </div>
        );
      
      case 'location_performance_analysis':
        return (
          <div className="bg-white rounded-lg border p-4">
            <h3 className="font-semibold text-gray-800 mb-3">Location Performance Analysis</h3>
            <div className="text-gray-700">{block.content || 'Location performance analysis will appear here.'}</div>
          </div>
        );
      
      case 'landing_page_mobile_analysis':
        return (
          <div className="bg-white rounded-lg border p-4">
            <h3 className="font-semibold text-gray-800 mb-3">Mobile Landing Page Analysis</h3>
            <div className="text-gray-700">{block.content || 'Mobile landing page analysis will appear here.'}</div>
          </div>
        );
      
      case 'tcpa_optimizations':
        return (
          <div className="bg-white rounded-lg border p-4">
            <h3 className="font-semibold text-gray-800 mb-3">TCPA Optimization Recommendations</h3>
            <div className="text-gray-700">{block.content || 'TCPA optimization recommendations will appear here.'}</div>
          </div>
        );
      
      case 'budget_allocation_optimizations':
        return (
          <div className="bg-white rounded-lg border p-4">
            <h3 className="font-semibold text-gray-800 mb-3">Budget Allocation Optimization</h3>
            <div className="text-gray-700">{block.content || 'Budget allocation optimization will appear here.'}</div>
          </div>
        );
      
      case 'negative_keyword_suggestions':
        return (
          <div className="bg-white rounded-lg border p-4">
            <h3 className="font-semibold text-gray-800 mb-3">Negative Keyword Suggestions</h3>
            <div className="text-gray-700">{block.content || 'Negative keyword suggestions will appear here.'}</div>
          </div>
        );
      
      default:
        return <div>Unsupported block type: {block.type}</div>;
    }
  };

  return (
    <div className={`flex flex-col h-full ${className}`}>
      {/* Header */}
      <div className="bg-white border-b px-4 py-3">
        <h2 className="text-lg font-semibold">AI Marketing Assistant</h2>
        <p className="text-sm text-gray-600">Ask me about your Google Ads campaigns</p>
      </div>

      {/* Quick Action Buttons */}
      <div className="bg-white border-b px-4 py-3">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => handleActionClick('optimize_campaign')}
            className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors"
          >
            Optimize Campaign
          </button>
          <button
            onClick={() => handleActionClick('check_campaign_consistency')}
            className="bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-600 transition-colors"
          >
            Check Consistency
          </button>
          <button
            onClick={() => handleActionClick('check_sitelinks')}
            className="bg-teal-500 text-white px-4 py-2 rounded-lg hover:bg-teal-600 transition-colors"
          >
            Check Sitelinks
          </button>
          <button
            onClick={() => handleActionClick('analyze_keyword_trends')}
            className="bg-pink-500 text-white px-4 py-2 rounded-lg hover:bg-pink-600 transition-colors"
          >
            Keyword Trends
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map(renderMessage)}
        {isLoading && (
          <div className="flex justify-start mb-4">
            <div className="bg-gray-100 rounded-lg px-4 py-2">
              <div className="flex space-x-2">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="bg-white border-t p-4">
        <div className="flex space-x-2">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Ask about your campaigns, performance, or create new ads..."
            className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isLoading}
          />
          <button
            onClick={handleSendMessage}
            disabled={isLoading || !inputMessage.trim()}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIChatBox;
