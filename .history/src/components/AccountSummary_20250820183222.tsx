import React from 'react';
import { Users, Target, DollarSign, RefreshCw } from 'lucide-react';
import { GoogleAdsAccountSummary } from '../types';

interface AccountSummaryProps {
  summary: GoogleAdsAccountSummary;
  className?: string;
  onRefresh?: () => void;
  isLoading?: boolean;
}

const AccountSummary: React.FC<AccountSummaryProps> = ({ summary, className = '', onRefresh, isLoading = false }) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  return (
    <div className={`bg-white rounded-lg border border-gray-200 p-4 ${className}`}>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-gray-900">Account Overview</h3>
        {onRefresh && (
          <button
            onClick={onRefresh}
            disabled={isLoading}
            className="p-1 text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title="Refresh data"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        )}
      </div>
      
      <div className="grid grid-cols-3 gap-4">
        {/* Connected Accounts */}
        <div className="text-center">
          <div className="flex justify-center mb-2">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <Users className="w-4 h-4 text-blue-600" />
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-900">
            {summary.connected_accounts}
          </div>
          <div className="text-xs text-gray-500">Connected Accounts</div>
        </div>

        {/* Active Campaigns */}
        <div className="text-center">
          <div className="flex justify-center mb-2">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
              <Target className="w-4 h-4 text-green-600" />
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-900">
            {summary.active_campaigns}
          </div>
          <div className="text-xs text-gray-500">Active Campaigns</div>
        </div>

        {/* Monthly Spend */}
        <div className="text-center">
          <div className="flex justify-center mb-2">
            <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
              <DollarSign className="w-4 h-4 text-purple-600" />
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-900">
            {formatCurrency(summary.monthly_spend)}
          </div>
          <div className="text-xs text-gray-500">Monthly Spend</div>
        </div>
      </div>

      {/* Summary Message */}
      <div className="mt-4 pt-3 border-t border-gray-100">
        <p className="text-sm text-gray-600 text-center">
          {summary.message}
        </p>
      </div>
    </div>
  );
};

export default AccountSummary;
