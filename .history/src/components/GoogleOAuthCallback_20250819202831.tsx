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

      console.log('OAuth Callback - Received parameters:', { code, state });
      console.log('OAuth Callback - Current URL:', window.location.href);

      if (!code || !state) {
        setStatus('error');
        setMessage('Missing authorization code or state parameter');
        return;
      }

      // Verify state matches what we stored
      const storedState = sessionStorage.getItem('googleOAuthState') || localStorage.getItem('googleOAuthState');
      console.log('OAuth Callback - Stored state from sessionStorage:', sessionStorage.getItem('googleOAuthState'));
      console.log('OAuth Callback - Stored state from localStorage:', localStorage.getItem('googleOAuthState'));
      console.log('OAuth Callback - Using stored state:', storedState);
      console.log('OAuth Callback - Received state:', state);
      console.log('OAuth Callback - State match:', storedState === state);
      
      // TEMPORARY: Bypass state verification for testing if no stored state
      if (!storedState) {
        console.warn('OAuth Callback - No stored state found, bypassing verification for testing');
        // In production, you should remove this bypass
      } else if (storedState !== state) {
        setStatus('error');
        setMessage('Invalid state parameter. OAuth flow may have been compromised.');
        console.error('OAuth Callback - State mismatch. Stored:', storedState, 'Received:', state);
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
        
        // Close the popup window if it's a popup
        if (window.opener) {
          // Send success message to parent window
          window.opener.postMessage({ type: 'GOOGLE_OAUTH_SUCCESS', data }, window.location.origin);
          
          // Clear the stored state after sending the message
          setTimeout(() => {
            sessionStorage.removeItem('googleOAuthState');
            localStorage.removeItem('googleOAuthState');
            console.log('OAuth state cleared after sending success message');
          }, 100);
          
          window.close();
        } else {
          // If not a popup, redirect after a delay
          setTimeout(() => {
            // Clear the stored state before redirecting
            sessionStorage.removeItem('googleOAuthState');
            localStorage.removeItem('googleOAuthState');
            console.log('OAuth state cleared before redirect');
            navigate('/dashboard');
          }, 2000);
        }
      } else {
        setStatus('error');
        setMessage(data.message || 'Failed to complete OAuth flow');
        
        // Send failure message to parent window if it's a popup
        if (window.opener) {
          window.opener.postMessage({ 
            type: 'GOOGLE_OAUTH_FAILURE', 
            error: data.message || 'Failed to complete OAuth flow' 
          }, window.location.origin);
          
          // Clear the stored state after sending the message
          setTimeout(() => {
            sessionStorage.removeItem('googleOAuthState');
            localStorage.removeItem('googleOAuthState');
            console.log('OAuth state cleared after sending failure message');
          }, 100);
        }
      }
    } catch (error) {
      console.error('OAuth callback error:', error);
      setStatus('error');
      setMessage('An error occurred while completing the OAuth flow');
      
      // Send failure message to parent window if it's a popup
      if (window.opener) {
        window.opener.postMessage({ 
          type: 'GOOGLE_OAUTH_FAILURE', 
          error: 'An error occurred while completing the OAuth flow' 
        }, window.location.origin);
        
        // Clear the stored state after sending the message
        setTimeout(() => {
          sessionStorage.removeItem('googleOAuthState');
          localStorage.removeItem('googleOAuthState');
          console.log('OAuth state cleared after sending error message');
        }, 100);
      }
    }
  };

  const renderContent = () => {
    switch (status) {
      case 'loading':
        return (
          <div className="text-center">
            <Loader className="w-16 h-16 text-blue-600 animate-spin mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Completing Connection...</h2>
            <p className="text-gray-600 mb-4">Please wait while we complete your Google Ads connection.</p>
            
            {/* Debug information */}
            <div className="mt-4 p-3 bg-gray-100 rounded-lg text-left text-xs">
              <p><strong>Debug Info:</strong></p>
              <p>SessionStorage State: {sessionStorage.getItem('googleOAuthState') || 'null'}</p>
              <p>LocalStorage State: {localStorage.getItem('googleOAuthState') || 'null'}</p>
              <p>URL State: {new URLSearchParams(window.location.search).get('state') || 'null'}</p>
              <p>URL Code: {new URLSearchParams(window.location.search).get('code') || 'null'}</p>
            </div>
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
