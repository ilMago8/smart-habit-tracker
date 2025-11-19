import React, { useState, useEffect } from 'react';
import LoginForm from '../components/LoginForm';
import RegisterForm from '../components/RegisterForm';

const AuthPage = () => {
  const [currentForm, setCurrentForm] = useState('login');
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    if (saved !== null) return saved === 'true';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });
  
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark-mode');
    } else {
      document.documentElement.classList.remove('dark-mode');
    }
    localStorage.setItem('darkMode', darkMode);
  }, [darkMode]);
  
  const toggleForm = () => {
    setCurrentForm(currentForm === 'login' ? 'register' : 'login');
  };
  
  return (
    <div className="auth-page">
      <button 
        className="theme-toggle theme-toggle-auth" 
        onClick={() => setDarkMode(!darkMode)}
        aria-label="Toggle dark mode"
      >
        {darkMode ? (
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="5"></circle>
            <line x1="12" y1="1" x2="12" y2="3"></line>
            <line x1="12" y1="21" x2="12" y2="23"></line>
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
            <line x1="1" y1="12" x2="3" y2="12"></line>
            <line x1="21" y1="12" x2="23" y2="12"></line>
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
          </svg>
        )}
      </button>
      <div className="auth-container">
        <div className="auth-branding">
          <h1 className="auth-app-title">Smart Habit Tracker</h1>
          <p className="auth-app-tagline">Transform your habits, transform your life</p>
        </div>
        
        {currentForm === 'login' ? (
          <LoginForm onSwitchToRegister={toggleForm} />
        ) : (
          <RegisterForm onSwitchToLogin={toggleForm} />
        )}
      </div>
    </div>
  );
};

export default AuthPage;
