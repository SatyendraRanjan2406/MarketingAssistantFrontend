import React, { useState, useEffect } from 'react';
import { TrendingUp, AlertTriangle, Zap, Clock, ArrowUp, ArrowDown } from 'lucide-react';
import { Platform, GoogleAdsAccountSummary } from '../types';
import AccountSummary from './AccountSummary';
import authService from '../services/authService';

interface InsightsSidebarProps {
  platform: Platform;
}

const InsightsSidebar: React.FC<InsightsSidebarProps> = ({ platform }) => {
  const [accountSummary, setAccountSummary] = useState<GoogleAdsAccountSummary | null>(null);
  const [isLoadingSummary, setIsLoadingSummary] = useState(false);

  // Fetch account summary when platform is Google Ads
  useEffect(() => {
    const fetchAccountSummary = async () => {
      if (platform === 'google') {
        setIsLoadingSummary(true);
        try {
          const result = await authService.getGoogleAdsAccountSummary();
          if (result.success && result.data) {
            setAccountSummary(result.data);
          }
        } catch (error) {
          console.error('Failed to fetch account summary:', error);
        } finally {
          setIsLoadingSummary(false);
        }
      } else {
        // Clear account summary when switching away from Google Ads
        setAccountSummary(null);
      }
    };

    fetchAccountSummary();
  }, [platform]);

  const insights = [
    {
      type: 'performance',
      icon: TrendingUp,
      title: 'ROAS Trending Up',
      value: '+30%',
      change: 'positive',
      time: '38m ago',
      description: 'Return on ad spend increased significantly'
    },
    {
      type: 'alert',
      icon: AlertTriangle,
      title: 'High CPM Alert',
      value: '+45%',
      change: 'negative',
      time: '1h ago',
      description: 'Cost per mille requires immediate attention'
    },
    {
      type: 'optimization',
      icon: Zap,
      title: 'Budget Reallocation',
      value: '12%',
      change: 'neutral',
      time: '2h ago',
      description: 'Opportunity to optimize budget distribution'
    },
    {
      type: 'performance',
      icon: TrendingUp,
      title: 'CTR Improvement',
      value: '+15%',
      change: 'positive',
      time: '3h ago',
      description: 'Click-through rate showing steady growth'
    },
    {
      type: 'alert',
      icon: AlertTriangle,
      title: 'Conversion Rate Drop',
      value: '-8%',
      change: 'negative',
      time: '4h ago',
      description: 'Monitor landing page performance'
    }
  ];

  const getInsightStyle = (type: string) => {
    switch (type) {
      case 'alert':
        return 'border-l-red-500 bg-red-50';
      case 'optimization':
        return 'border-l-blue-500 bg-blue-50';
      case 'performance':
        return 'border-l-green-500 bg-green-50';
      default:
        return 'border-l-gray-500 bg-gray-50';
    }
  };

  const getBadgeStyle = (type: string) => {
    switch (type) {
      case 'alert':
        return 'bg-red-100 text-red-800';
      case 'optimization':
        return 'bg-blue-100 text-blue-800';
      case 'performance':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="w-80 bg-white border-l border-gray-200 p-6 overflow-y-auto">
      {/* Header */}
      <div className="flex items-center space-x-2 mb-6">
        <TrendingUp className="w-5 h-5 text-blue-600" />
        <h2 className="text-lg font-semibold text-gray-900">Insights & Suggestions</h2>
      </div>

      {/* Real-time Status */}
      <div className="mb-6 p-3 bg-green-50 border border-green-200 rounded-lg">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-sm font-medium text-green-800">Live Monitoring Active</span>
        </div>
        <p className="text-xs text-green-600 mt-1">Last updated: 2 minutes ago</p>
      </div>

      {/* Insights List */}
      <div className="space-y-4">
        {insights.map((insight, index) => {
          const Icon = insight.icon;
          return (
            <div
              key={index}
              className={`border-l-4 ${getInsightStyle(insight.type)} p-4 rounded-r-lg hover:shadow-sm transition-shadow cursor-pointer`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <Icon className="w-4 h-4 text-gray-600" />
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getBadgeStyle(insight.type)}`}>
                    {insight.type.toUpperCase()}
                  </span>
                </div>
                <div className="flex items-center space-x-1 text-xs text-gray-500">
                  <Clock className="w-3 h-3" />
                  <span>{insight.time}</span>
                </div>
              </div>
              
              <h3 className="font-semibold text-gray-900 mb-1">{insight.title}</h3>
              
              <div className="flex items-center space-x-2 mb-2">
                <span className={`font-bold ${
                  insight.change === 'positive' ? 'text-green-600' : 
                  insight.change === 'negative' ? 'text-red-600' : 'text-gray-600'
                }`}>
                  {insight.value}
                </span>
                {insight.change === 'positive' && <ArrowUp className="w-3 h-3 text-green-600" />}
                {insight.change === 'negative' && <ArrowDown className="w-3 h-3 text-red-600" />}
              </div>
              
              <p className="text-sm text-gray-600">{insight.description}</p>
            </div>
          );
        })}
      </div>

      {/* Quick Stats */}
      <div className="mt-8 p-4 bg-gray-50 rounded-lg">
        <h3 className="font-semibold text-gray-900 mb-3">Quick Stats</h3>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Active Campaigns</span>
            <span className="text-sm font-semibold text-gray-900">24</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Total Spend (24h)</span>
            <span className="text-sm font-semibold text-gray-900">$12,450</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Avg. ROAS</span>
            <span className="text-sm font-semibold text-green-600">3.8x</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Conversions</span>
            <span className="text-sm font-semibold text-gray-900">1,247</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InsightsSidebar;