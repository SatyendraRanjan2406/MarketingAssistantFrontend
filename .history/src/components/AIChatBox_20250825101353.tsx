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
