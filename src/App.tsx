import React, { useState } from 'react';
import LoginScreen from './components/LoginScreen';
import OnboardingFlow from './components/OnboardingFlow';
import Dashboard from './components/Dashboard';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleOnboardingComplete = () => {
    setHasCompletedOnboarding(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {isAuthenticated && hasCompletedOnboarding ? (
        <Dashboard />
      ) : isAuthenticated ? (
        <OnboardingFlow onComplete={handleOnboardingComplete} />
      ) : (
        <LoginScreen onLogin={handleLogin} />
      )}
    </div>
  );
}

export default App;