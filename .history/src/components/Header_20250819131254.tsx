import React from 'react';
import { TrendingUp, Search, Bell, Settings, User, LogOut } from 'lucide-react';
import AccountSettings from './AccountSettings';
import { Platform } from '../types';
import authService from '../services/authService';

interface HeaderProps {
  currentPlatform: Platform;
  onPlatformSwitch: (platform: Platform) => void;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ currentPlatform, onPlatformSwitch, onLogout }) => {
  const [showSettings, setShowSettings] = React.useState(false);
  const currentUser = authService.getCurrentUser();

  const platformConfig = {
    google: {
      title: 'Google Ads Intelligence',
      color: 'bg-blue-600',
      hoverColor: 'hover:bg-blue-700'
    },
    meta: {
      title: 'Meta Ads Intelligence', 
      color: 'bg-blue-600',
      hoverColor: 'hover:bg-blue-700'
    }
  };

  const handleLogout = () => {
    authService.logout();
    onLogout();
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Left side - Logo and Platform */}
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-3">
              <div className={`w-10 h-10 ${platformConfig[currentPlatform].color} rounded-lg flex items-center justify-center`}>
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  {platformConfig[currentPlatform].title}
                </h1>
                <p className="text-sm text-gray-500">AI-Powered Campaign Analysis</p>
              </div>
            </div>

            {/* Platform Switcher */}
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => onPlatformSwitch('google')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  currentPlatform === 'google'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Google Ads
              </button>
              <button
                onClick={() => onPlatformSwitch('meta')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  currentPlatform === 'meta'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Meta Ads
              </button>
            </div>
          </div>

          {/* Right side - Search and User */}
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search campaigns..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
              />
            </div>
            
            <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
              <Bell className="w-5 h-5" />
            </button>
            
            <button 
              onClick={() => setShowSettings(true)}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <Settings className="w-5 h-5" />
            </button>
            
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-gray-600" />
              </div>
              <span className="text-sm font-medium text-gray-900">
                {currentUser?.name || 'User'}
              </span>
              <button
                onClick={handleLogout}
                className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                title="Logout"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {showSettings && (
        <AccountSettings onClose={() => setShowSettings(false)} />
      )}
    </header>
  );
};

export default Header;