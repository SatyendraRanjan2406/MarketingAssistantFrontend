import React, { useState, useEffect } from 'react';
import LoginScreen from './components/LoginScreen';
import OnboardingFlow from './components/OnboardingFlow';
import Dashboard from './components/Dashboard';
import authService from './services/authService';
import { User } from './types';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // Check authentication status on component mount
  useEffect(() => {
    const checkAuth = () => {
      const authenticated = authService.isAuthenticated();
      const user = authService.getCurrentUser();
      
      if (authenticated && user) {
        setIsAuthenticated(true);
        setCurrentUser(user);
      }
    };
    
    checkAuth();
  }, []);

  const handleLogin = (user: User) => {
    setIsAuthenticated(true);
    setCurrentUser(user);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setHasCompletedOnboarding(false);
    setCurrentUser(null);
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