import React, { useState } from 'react';
import { Settings, ExternalLink, AlertTriangle, CheckCircle, Trash2, RefreshCw } from 'lucide-react';

interface AccountSettingsProps {
  onClose: () => void;
}

const AccountSettings: React.FC<AccountSettingsProps> = ({ onClose }) => {
  const [connectedAccounts, setConnectedAccounts] = useState({
    google: {
      connected: true,
      accounts: [
        { id: '123-456-7890', name: 'Main Google Ads Account', spend: '$45,230' },
        { id: '098-765-4321', name: 'Brand Campaign Account', spend: '$12,450' },
        { id: '555-444-3333', name: 'Product Launch Account', spend: '$8,920' }
      ]
    },
    meta: {
      connected: true,
      accounts: [
        { id: 'act_1234567890', name: 'Primary Meta Account', spend: '$32,180' },
        { id: 'act_0987654321', name: 'Retargeting Account', spend: '$15,670' }
      ]
    }
  });

  const handleDisconnect = (platform: 'google' | 'meta') => {
    setConnectedAccounts(prev => ({
      ...prev,
      [platform]: { ...prev[platform], connected: false }
    }));
  };

  const handleReconnect = (platform: 'google' | 'meta') => {
    // Simulate reconnection
    setTimeout(() => {
      setConnectedAccounts(prev => ({
        ...prev,
        [platform]: { ...prev[platform], connected: true }
      }));
    }, 2000);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <Settings className="w-6 h-6 text-gray-600" />
            <h2 className="text-xl font-semibold text-gray-900">Account Settings</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Google Ads Section */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                <h3 className="text-lg font-semibold text-gray-900">Google Ads Integration</h3>
                {connectedAccounts.google.connected ? (
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                    Connected
                  </span>
                ) : (
                  <span className="px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded-full">
                    Disconnected
                  </span>
                )}
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleReconnect('google')}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                  title="Refresh connection"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
                {connectedAccounts.google.connected && (
                  <button
                    onClick={() => handleDisconnect('google')}
                    className="p-2 text-red-400 hover:text-red-600 transition-colors"
                    title="Disconnect"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {connectedAccounts.google.connected ? (
              <div className="space-y-3">
                {connectedAccounts.google.accounts.map((account) => (
                  <div key={account.id} className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900">{account.name}</h4>
                        <p className="text-sm text-gray-600">Account ID: {account.id}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">{account.spend}</p>
                        <p className="text-sm text-gray-600">Monthly spend</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-red-900">Google Ads Disconnected</h4>
                    <p className="text-sm text-red-800 mt-1">
                      Reconnect your Google Ads account to continue receiving insights and optimizations.
                    </p>
                    <button
                      onClick={() => handleReconnect('google')}
                      className="mt-3 bg-red-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-red-700 transition-colors flex items-center space-x-2"
                    >
                      <ExternalLink className="w-4 h-4" />
                      <span>Reconnect Google Ads</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Meta Ads Section */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <svg className="w-8 h-8" viewBox="0 0 24 24" fill="#1877F2">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                <h3 className="text-lg font-semibold text-gray-900">Meta Ads Integration</h3>
                {connectedAccounts.meta.connected ? (
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                    Connected
                  </span>
                ) : (
                  <span className="px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded-full">
                    Disconnected
                  </span>
                )}
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleReconnect('meta')}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                  title="Refresh connection"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
                {connectedAccounts.meta.connected && (
                  <button
                    onClick={() => handleDisconnect('meta')}
                    className="p-2 text-red-400 hover:text-red-600 transition-colors"
                    title="Disconnect"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {connectedAccounts.meta.connected ? (
              <div className="space-y-3">
                {connectedAccounts.meta.accounts.map((account) => (
                  <div key={account.id} className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900">{account.name}</h4>
                        <p className="text-sm text-gray-600">Account ID: {account.id}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">{account.spend}</p>
                        <p className="text-sm text-gray-600">Monthly spend</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-red-900">Meta Ads Disconnected</h4>
                    <p className="text-sm text-red-800 mt-1">
                      Reconnect your Meta Ads account to continue receiving insights and optimizations.
                    </p>
                    <button
                      onClick={() => handleReconnect('meta')}
                      className="mt-3 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition-colors flex items-center space-x-2"
                    >
                      <ExternalLink className="w-4 h-4" />
                      <span>Reconnect Meta Ads</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Permissions & Security */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Permissions & Security</h3>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-blue-900">Secure OAuth Integration</h4>
                  <p className="text-sm text-blue-800 mt-1">
                    All connections use industry-standard OAuth 2.0 authentication. We never store your login credentials.
                  </p>
                  <ul className="mt-3 space-y-1 text-sm text-blue-800">
                    <li>• Read access to campaign performance data</li>
                    <li>• Write access for optimization changes (with your approval)</li>
                    <li>• No access to billing information or payment methods</li>
                    <li>• Connections can be revoked at any time</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Data Sync Status */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Data Sync Status</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="font-medium text-green-900">Google Ads</span>
                </div>
                <p className="text-sm text-green-800">Last sync: 2 minutes ago</p>
                <p className="text-sm text-green-800">Status: Active</p>
              </div>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="font-medium text-green-900">Meta Ads</span>
                </div>
                <p className="text-sm text-green-800">Last sync: 5 minutes ago</p>
                <p className="text-sm text-green-800">Status: Active</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default AccountSettings;