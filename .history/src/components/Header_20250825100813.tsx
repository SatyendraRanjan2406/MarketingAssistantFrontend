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
  const [isLoggingOut, setIsLoggingOut] = React.useState(false);
  const currentUser = authService.getCurrentUser();

  // Debug: Log current user to console
  React.useEffect(() => {
    console.log('Current user in Header:', currentUser);
  }, [currentUser]);

  const platformConfig = {
    google: {
      title: 'Google Ads Intelligence',
      color: 'bg-blue-600',
      hoverColor: 'hover:bg-blue-700'
    },
    'google-new': {
      title: 'Google AI Chat',
      color: 'bg-green-600',
      hoverColor: 'hover:bg-green-700'
    },
    meta: {
      title: 'Meta Ads Intelligence', 
      color: 'bg-blue-600',
      hoverColor: 'hover:bg-blue-700'
    }
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await authService.logout();
      onLogout();
    } catch (error) {
      console.error('Logout error:', error);
      // Still logout locally even if API call fails
      onLogout();
    } finally {
      setIsLoggingOut(false);
    }
  };

  // Get display name - fallback to email if name is not available
  const getDisplayName = () => {
    if (currentUser?.name && currentUser.name.trim()) {
      return currentUser.name;
    }
    if (currentUser?.email) {
      return currentUser.email.split('@')[0]; // Use email prefix
    }
    return 'User';
  };



  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
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
            
            {/* User Profile Section */}
            <div className="flex items-center space-x-3 bg-gray-50 rounded-lg px-3 py-2">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-blue-600" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-medium text-gray-900">
                  {getDisplayName()}
                </span>
                <span className="text-xs text-gray-500">
                  {currentUser?.email || 'user@example.com'}
                </span>
              </div>
              <button
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="ml-2 p-2 text-gray-400 hover:text-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed rounded-lg hover:bg-red-50"
                title="Logout"
              >
                {isLoggingOut ? (
                  <div className="w-5 h-5 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <LogOut className="w-5 h-5" />
                )}
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