import React, { useState, useEffect } from 'react';
import { CheckCircle, ExternalLink, AlertCircle, ArrowRight, Shield, Zap } from 'lucide-react';
import authService from '../services/authService'; // Added import for authService

interface OnboardingFlowProps {
  onComplete: () => void;
}

const OnboardingFlow: React.FC<OnboardingFlowProps> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [connectedAccounts, setConnectedAccounts] = useState({
    google: false,
    meta: false
  });
  const [isConnectingGoogle, setIsConnectingGoogle] = useState(false);
  const [isConnectingMeta, setIsConnectingMeta] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);

  // Listen for OAuth success messages from popup window
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      console.log('Received message from OAuth window:', event.data);
      
      if (event.origin !== window.location.origin) return;
      
      if (event.data.type === 'GOOGLE_OAUTH_SUCCESS') {
        console.log('Google OAuth successful:', event.data);
        setConnectedAccounts(prev => ({ ...prev, google: true }));
        setIsConnectingGoogle(false);
        setConnectionError(null);
      } else if (event.data.type === 'GOOGLE_OAUTH_FAILURE') {
        console.log('Google OAuth failed:', event.data);
        setIsConnectingGoogle(false);
        setConnectionError(event.data.error || 'Google OAuth failed. Please try again.');
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const steps = [
    { id: 1, title: 'Welcome', description: 'Get started with AI Marketing Assistant' },
    { id: 2, title: 'Connect Accounts', description: 'Link your advertising accounts' },
    { id: 3, title: 'Setup Complete', description: 'Start optimizing your campaigns' }
  ];

  const handleGoogleConnect = async () => {
    setIsConnectingGoogle(true);
    setConnectionError(null);
    
    console.log('Starting Google OAuth connection...');
    
    try {
      const result = await authService.initiateGoogleOAuth();
      console.log('OAuth initiation result:', result);
      
      if (result.success) {
        // OAuth window opened successfully
        console.log('Google OAuth initiated successfully');
        
        // Set a timeout in case the popup doesn't send a message
        setTimeout(() => {
          if (isConnectingGoogle) {
            console.log('OAuth timeout reached, stopping loading state');
            setIsConnectingGoogle(false);
            setConnectionError('Connection timeout. Please check if the OAuth window opened and try again. If the window opened, please complete the authorization process.');
          }
        }, 120000); // Increased to 2 minutes for OAuth flow
        
        // The connection status will be updated via message from the popup window
      } else {
        let errorMessage = result.error || 'Failed to connect Google Ads';
        
        // Provide specific guidance for common issues
        if (errorMessage.includes('popup blocker')) {
          errorMessage = 'Popup blocked! Please allow popups for this site and try again.';
        } else if (errorMessage.includes('Failed to open OAuth window')) {
          errorMessage = 'Unable to open OAuth window. Please check your browser settings and try again.';
        }
        
        console.error('OAuth initiation failed:', errorMessage);
        setConnectionError(errorMessage);
        setIsConnectingGoogle(false);
      }
    } catch (error) {
      console.error('Google OAuth error:', error);
      let errorMessage = 'Failed to connect Google Ads. Please try again.';
      
      if (error instanceof Error) {
        if (error.message.includes('timeout')) {
          errorMessage = 'Connection timeout. The server is taking too long to respond. Please try again.';
        } else if (error.message.includes('network')) {
          errorMessage = 'Network error. Please check your internet connection and try again.';
        } else {
          errorMessage = `Connection error: ${error.message}`;
        }
      }
      
      setConnectionError(errorMessage);
      setIsConnectingGoogle(false);
    }
  };

  const handleMetaConnect = () => {
    // Simulate OAuth flow
    setTimeout(() => {
      setConnectedAccounts(prev => ({ ...prev, meta: true }));
    }, 2000);
  };

  const canProceed = () => {
    if (currentStep === 2) return connectedAccounts.google && connectedAccounts.meta;
    return true;
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 lg:mb-8">
              <Zap className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4 lg:mb-6">Welcome to AI Marketing Assistant</h2>
            <p className="text-lg text-gray-600 mb-8 lg:mb-12 max-w-2xl mx-auto">
              Transform your advertising performance with AI-powered insights and automated optimization. 
              Let's connect your advertising accounts to get started.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-4xl mx-auto">
              <div className="bg-blue-50 p-6 lg:p-8 rounded-xl">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Secure Integration</h3>
                <p className="text-sm text-gray-600">Bank-level security with OAuth 2.0 authentication</p>
              </div>
              <div className="bg-green-50 p-6 lg:p-8 rounded-xl">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Real-time Analysis</h3>
                <p className="text-sm text-gray-600">Live campaign monitoring and optimization</p>
              </div>
              <div className="bg-purple-50 p-6 lg:p-8 rounded-xl">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Automated Actions</h3>
                <p className="text-sm text-gray-600">One-click implementation of AI recommendations</p>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-8 lg:mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4 lg:mb-6">Connect Your Advertising Accounts</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Connect both Google Ads and Meta Ads accounts for comprehensive cross-platform optimization and unified insights.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
              {/* Google Ads Section */}
              <div className="bg-white border border-gray-200 rounded-xl p-6 lg:p-8">
                <div className="text-center mb-6 lg:mb-8">
                  <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Google Ads</h3>
                  <p className="text-gray-600 text-sm">
                    Securely connect your Google Ads account for AI-powered campaign analysis.
                  </p>
                </div>

                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <div className="flex items-start space-x-3">
                    <Shield className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div className="text-sm text-gray-600">
                      <p className="font-medium text-gray-900 mb-2">What we'll access:</p>
                      <ul className="space-y-1">
                        <li>• Campaign performance data (read-only)</li>
                        <li>• Account structure and settings</li>
                        <li>• Optimization capabilities (with approval)</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {connectedAccounts.google ? (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                    <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
                    <h4 className="font-semibold text-green-900">Google Ads Connected!</h4>
                    <p className="text-sm text-green-700 mt-1">3 active accounts with 24 campaigns</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {connectionError && (
                      <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                        <p className="text-sm text-red-800 mb-2">{connectionError}</p>
                        <button
                          onClick={handleGoogleConnect}
                          className="text-xs bg-red-100 text-red-700 px-3 py-1 rounded hover:bg-red-200 transition-colors"
                        >
                          Try Again
                        </button>
                      </div>
                    )}
                    <button
                      onClick={handleGoogleConnect}
                      disabled={isConnectingGoogle}
                      className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isConnectingGoogle ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>Opening OAuth Window...</span>
                        </>
                      ) : (
                        <>
                          <ExternalLink className="w-5 h-5" />
                          <span>Connect Google Ads</span>
                        </>
                      )}
                    </button>
                    
                    {isConnectingGoogle && (
                      <div className="text-center mt-3">
                        <p className="text-sm text-blue-600">
                          A new window should open for Google authorization. 
                          Please complete the process in that window.
                        </p>
                        <div className="mt-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
                          <p className="text-xs text-blue-700">
                            <strong>If no window opened:</strong> Check your popup blocker settings and try again.
                          </p>
                          <p className="text-xs text-blue-700 mt-1">
                            <strong>If the window opened:</strong> Complete the Google authorization and return here.
                          </p>
                          <p className="text-xs text-blue-700 mt-1">
                            <strong>Note:</strong> Google may add additional scopes automatically - this is normal and secure.
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Meta Ads Section */}
              <div className="bg-white border border-gray-200 rounded-xl p-6 lg:p-8">
                <div className="text-center mb-6 lg:mb-8">
                  <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8" viewBox="0 0 24 24" fill="#1877F2">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Meta Ads</h3>
                  <p className="text-gray-600 text-sm">
                    Link your Meta (Facebook/Instagram) advertising account for comprehensive insights.
                  </p>
                </div>

                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <div className="flex items-start space-x-3">
                    <Shield className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div className="text-sm text-gray-600">
                      <p className="font-medium text-gray-900 mb-2">What we'll access:</p>
                      <ul className="space-y-1">
                        <li>• Ad account performance metrics</li>
                        <li>• Campaign and ad set data</li>
                        <li>• Audience insights and demographics</li>
                        <li>• Campaign management capabilities</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {connectedAccounts.meta ? (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                    <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
                    <h4 className="font-semibold text-green-900">Meta Ads Connected!</h4>
                    <p className="text-sm text-green-700 mt-1">2 ad accounts with 18 campaigns</p>
                  </div>
                ) : (
                  <button
                    onClick={handleMetaConnect}
                    className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
                  >
                    <ExternalLink className="w-5 h-5" />
                    <span>Connect Meta Ads</span>
                  </button>
                )}
              </div>
            </div>

            {/* Cross-Platform Benefits */}
            <div className="mt-8 lg:mt-12 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-xl p-6 lg:p-8">
              <div className="text-center">
                <h4 className="text-lg font-semibold text-blue-900 mb-3 lg:mb-4">Cross-Platform Benefits</h4>
                <p className="text-blue-800 mb-4 lg:mb-6">
                  With both platforms connected, you'll get unified insights and cross-platform optimization recommendations.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6 text-sm">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span>Unified dashboard view</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span>Cross-platform insights</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span>Integrated optimization</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="text-center">
            <div className="w-20 h-20 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-6 lg:mb-8">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4 lg:mb-6">Setup Complete!</h2>
            <p className="text-lg text-gray-600 mb-8 lg:mb-12 max-w-2xl mx-auto">
              Your accounts are now connected and we're analyzing your campaign data. 
              You can start getting AI-powered insights and optimizations right away.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 max-w-4xl mx-auto mb-8 lg:mb-12">
              <div className="bg-white border border-gray-200 rounded-xl p-6 lg:p-8">
                <div className="flex items-center space-x-3 mb-4">
                  <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                  <div>
                    <h3 className="font-semibold text-gray-900">Google Ads</h3>
                    <p className="text-sm text-green-600">Connected ✓</p>
                  </div>
                </div>
                <div className="text-left space-y-2 text-sm text-gray-600">
                  <p>• 3 accounts connected</p>
                  <p>• 24 active campaigns</p>
                  <p>• $45,230 monthly spend</p>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-xl p-6 lg:p-8">
                <div className="flex items-center space-x-3 mb-4">
                  <svg className="w-8 h-8" viewBox="0 0 24 24" fill="#1877F2">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                  <div>
                    <h3 className="font-semibold text-gray-900">Meta Ads</h3>
                    <p className="text-sm text-green-600">Connected ✓</p>
                  </div>
                </div>
                <div className="text-left space-y-2 text-sm text-gray-600">
                  <p>• 2 ad accounts connected</p>
                  <p>• 18 active campaigns</p>
                  <p>• $32,180 monthly spend</p>
                </div>
              </div>
            </div>

            <button
              onClick={onComplete}
              className="bg-blue-600 text-white py-3 px-8 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center space-x-2 mx-auto"
            >
              <span>Start Using AI Marketing Assistant</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center px-4 py-8 lg:py-16">
      <div className="max-w-6xl w-full">
        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-12 lg:mb-16">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div className={`flex items-center space-x-3 ${
                currentStep >= step.id ? 'text-blue-600' : 'text-gray-400'
              }`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                  currentStep > step.id 
                    ? 'bg-blue-600 text-white' 
                    : currentStep === step.id
                    ? 'bg-blue-100 text-blue-600 border-2 border-blue-600'
                    : 'bg-gray-200 text-gray-500'
                }`}>
                  {currentStep > step.id ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : (
                    step.id
                  )}
                </div>
                <div className="hidden md:block">
                  <p className="font-medium">{step.title}</p>
                  <p className="text-sm opacity-75">{step.description}</p>
                </div>
              </div>
              {index < steps.length - 1 && (
                <div className={`w-16 h-0.5 mx-4 ${
                  currentStep > step.id ? 'bg-blue-600' : 'bg-gray-300'
                }`} />
              )}
            </div>
          ))}
        </div>

        {/* Step Content */}
        <div className="bg-white rounded-2xl shadow-xl p-6 lg:p-8 border border-gray-100">
          {renderStepContent()}
        </div>

        {/* Navigation */}
        {currentStep < 3 && (
          <div className="flex justify-between mt-8 lg:mt-12">
            <button
              onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
              disabled={currentStep === 1}
              className="px-6 py-2 text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Previous
            </button>
            <button
              onClick={() => setCurrentStep(Math.min(3, currentStep + 1))}
              disabled={!canProceed()}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
            >
              <span>Next</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default OnboardingFlow;