import React, { useEffect, useState } from 'react';
import { CheckCircle, XCircle, Loader } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL, API_ENDPOINTS } from '../constants';

const GoogleOAuthCallback: React.FC = () => {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    handleCallback();
  }, []);

  const handleCallback = async () => {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get('code');
      const state = urlParams.get('state');

      if (!code || !state) {
        setStatus('error');
        setMessage('Missing authorization code or state parameter');
        return;
      }

      // Verify state matches what we stored
      const storedState = localStorage.getItem('googleOAuthState');
      if (storedState !== state) {
        setStatus('error');
        setMessage('Invalid state parameter. OAuth flow may have been compromised.');
        return;
      }

      // Exchange code for tokens
      const accessToken = localStorage.getItem('accessToken');
      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.GOOGLE_OAUTH_CALLBACK}?code=${code}&state=${state}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (data.success) {
        setStatus('success');
        setMessage('Google Ads connected successfully!');
        
        // Clear the stored state
        localStorage.removeItem('googleOAuthState');
        
        // Close the popup window if it's a popup
        if (window.opener) {
          // Send message to parent window
          window.opener.postMessage({ type: 'GOOGLE_OAUTH_SUCCESS', data }, window.location.origin);
          window.close();
        } else {
          // If not a popup, redirect after a delay
          setTimeout(() => {
            navigate('/dashboard');
          }, 2000);
        }
      } else {
        setStatus('error');
        setMessage(data.message || 'Failed to complete OAuth flow');
      }
    } catch (error) {
      console.error('OAuth callback error:', error);
      setStatus('error');
      setMessage('An error occurred while completing the OAuth flow');
    }
  };

  const renderContent = () => {
    switch (status) {
      case 'loading':
        return (
          <div className="text-center">
            <Loader className="w-16 h-16 text-blue-600 animate-spin mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Completing Connection...</h2>
            <p className="text-gray-600">Please wait while we complete your Google Ads connection.</p>
          </div>
        );

      case 'success':
        return (
          <div className="text-center">
            <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Connection Successful!</h2>
            <p className="text-gray-600 mb-4">{message}</p>
            <p className="text-sm text-gray-500">You can close this window and return to the main application.</p>
          </div>
        );

      case 'error':
        return (
          <div className="text-center">
            <XCircle className="w-16 h-16 text-red-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Connection Failed</h2>
            <p className="text-red-600 mb-4">{message}</p>
            <button
              onClick={() => window.close()}
              className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              Close Window
            </button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default GoogleOAuthCallback;
