import React, { useEffect, useState } from 'react';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import authService from '../services/authService';

const OAuthCallback: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Processing OAuth callback...');

  useEffect(() => {
    const handleOAuthCallback = async () => {
      try {
        // Extract OAuth parameters from URL
        const code = searchParams.get('code');
        const state = searchParams.get('state');
        const error = searchParams.get('error');

        if (error) {
          setStatus('error');
          setMessage(`OAuth error: ${error}`);
          return;
        }

        if (!code || !state) {
          setStatus('error');
          setMessage('Missing OAuth parameters');
          return;
        }

        // Verify state parameter matches what we stored
        const storedState = localStorage.getItem('googleOAuthState');
        if (state !== storedState) {
          setStatus('error');
          setMessage('Invalid OAuth state parameter');
          return;
        }

        // Process the OAuth callback
        const result = await authService.processGoogleOAuthCallback(code, state);
        
        if (result.success) {
          setStatus('success');
          setMessage('Google Ads connected successfully!');
          
          // Clear the stored state
          localStorage.removeItem('googleOAuthState');
          
          // Redirect back to onboarding after a short delay
          setTimeout(() => {
            navigate('/onboarding');
          }, 2000);
        } else {
          setStatus('error');
          setMessage(result.error || 'Failed to complete OAuth process');
        }
      } catch (error) {
        console.error('OAuth callback error:', error);
        setStatus('error');
        setMessage('An unexpected error occurred');
      }
    };

    handleOAuthCallback();
  }, [searchParams, navigate]);

  const renderContent = () => {
    switch (status) {
      case 'loading':
        return (
          <div className="text-center">
            <Loader2 className="w-16 h-16 text-blue-600 animate-spin mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Processing OAuth Callback</h2>
            <p className="text-gray-600">{message}</p>
          </div>
        );
      
      case 'success':
        return (
          <div className="text-center">
            <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">OAuth Successful!</h2>
            <p className="text-gray-600 mb-4">{message}</p>
            <p className="text-sm text-gray-500">Redirecting back to onboarding...</p>
          </div>
        );
      
      case 'error':
        return (
          <div className="text-center">
            <XCircle className="w-16 h-16 text-red-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">OAuth Failed</h2>
            <p className="text-gray-600 mb-4">{message}</p>
            <button
              onClick={() => navigate('/onboarding')}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Return to Onboarding
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

export default OAuthCallback;
