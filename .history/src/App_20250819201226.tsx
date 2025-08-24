import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginScreen from './components/LoginScreen';
import OnboardingFlow from './components/OnboardingFlow';
import Dashboard from './components/Dashboard';
import GoogleOAuthCallback from './components/GoogleOAuthCallback';
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
      
      console.log('Auth check:', { authenticated, user });
      
      if (authenticated && user) {
        setIsAuthenticated(true);
        setCurrentUser(user);
      }
    };
    
    checkAuth();
  }, []);

  const handleLogin = (user: User) => {
    console.log('Login successful:', user);
    setIsAuthenticated(true);
    setCurrentUser(user);
  };

  const handleLogout = () => {
    console.log('Logout called');
    setIsAuthenticated(false);
    setHasCompletedOnboarding(false);
    setCurrentUser(null);
  };

  const handleOnboardingComplete = () => {
    console.log('Onboarding completed');
    setHasCompletedOnboarding(true);
  };

  // Debug: Show current state
  console.log('App state:', { isAuthenticated, hasCompletedOnboarding, currentUser });

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          {/* OAuth Callback Route - accessible without authentication */}
          <Route path="/google-oauth/callback" element={<GoogleOAuthCallback />} />
          
          {/* Main App Routes */}
          <Route path="/" element={
            isAuthenticated && hasCompletedOnboarding ? (
              <Navigate to="/dashboard" replace />
            ) : isAuthenticated ? (
              <OnboardingFlow onComplete={handleOnboardingComplete} />
            ) : (
              <LoginScreen onLogin={handleLogin} />
            )
          } />
          
          <Route path="/dashboard" element={
            isAuthenticated && hasCompletedOnboarding ? (
              <Dashboard onLogout={handleLogout} />
            ) : (
              <Navigate to="/" replace />
            )
          } />
          
          {/* Catch all route - redirect to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;