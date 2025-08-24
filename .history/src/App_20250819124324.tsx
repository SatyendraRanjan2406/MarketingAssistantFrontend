import React, { useState, useEffect } from 'react';
import LoginScreen from './components/LoginScreen';
import OnboardingFlow from './components/OnboardingFlow';
import Dashboard from './components/Dashboard';
import authService from './services/authService';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);

  // Check authentication status on component mount
  useEffect(() => {
    const checkAuth = () => {
      const authenticated = authService.isAuthenticated();
      setIsAuthenticated(authenticated);
    };
    
    checkAuth();
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setHasCompletedOnboarding(false);
  };

  const handleOnboardingComplete = () => {
    setHasCompletedOnboarding(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {isAuthenticated && hasCompletedOnboarding ? (
        <Dashboard onLogout={handleLogout} />
      ) : isAuthenticated ? (
        <OnboardingFlow onComplete={handleOnboardingComplete} />
      ) : (
        <LoginScreen onLogin={handleLogin} />
      )}
    </div>
  );
}

export default App;