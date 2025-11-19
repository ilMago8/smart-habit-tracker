import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

const UserProfile = () => {
  const { currentUser, logout } = useAuth();
  const [showTooltip, setShowTooltip] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    // Check localStorage or system preference
    const saved = localStorage.getItem('darkMode');
    if (saved !== null) return saved === 'true';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });
  
  useEffect(() => {
    // Apply theme to document
    if (darkMode) {
      document.documentElement.classList.add('dark-mode');
    } else {
      document.documentElement.classList.remove('dark-mode');
    }
    // Save preference
    localStorage.setItem('darkMode', darkMode);
  }, [darkMode]);
  
  if (!currentUser) return null;
  
  // Generate initial for avatar
  const getInitial = () => {
    return currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'U';
  };
  
  const handleLogout = (e) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to logout?')) {
      logout();
    }
  };
  
  const toggleTooltip = () => {
    setShowTooltip(!showTooltip);
  };
  
  const toggleDarkMode = (e) => {
    e.stopPropagation();
    setDarkMode(!darkMode);
  };
  
  return (
    <div className="user-profile-container">
      <button 
        className="theme-toggle"
        onClick={toggleDarkMode}
        aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
        title={darkMode ? 'Light mode' : 'Dark mode'}
      >
        {darkMode ? (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="5"/>
            <line x1="12" y1="1" x2="12" y2="3"/>
            <line x1="12" y1="21" x2="12" y2="23"/>
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
            <line x1="1" y1="12" x2="3" y2="12"/>
            <line x1="21" y1="12" x2="23" y2="12"/>
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
          </svg>
        ) : (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
          </svg>
        )}
      </button>
      
      <div 
        className="user-profile" 
        onClick={toggleTooltip}
        title="Click to manage your account"
      >
        <div className="user-avatar">
          {getInitial()}
        </div>
        <div className="user-info">
          <span className="user-name">{currentUser.name}</span>
          <button 
            className="user-logout" 
            onClick={handleLogout}
            aria-label="Logout from account"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
