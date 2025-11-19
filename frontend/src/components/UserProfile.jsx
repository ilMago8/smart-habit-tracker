import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';

const UserProfile = ({ onGoProfile, onLogout }) => {
  const { currentUser, logout } = useAuth();
  const { addToast } = useToast();
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
    if (onLogout) {
      onLogout();
    } else {
      logout();
      addToast('Logged out', { type: 'success' });
    }
  };
  
  const handleGoProfile = () => {
    if (onGoProfile) {
      onGoProfile();
    }
  };
  
  const toggleDarkMode = (e) => {
    e.stopPropagation();
    const next = !darkMode;
    setDarkMode(next);
    addToast(next ? 'Dark mode enabled' : 'Light mode enabled', { type: 'info' });
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
        onClick={handleGoProfile}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleGoProfile(); } }}
        role="button"
        tabIndex={0}
        title="Open user profile"
        aria-label="Open user profile"
      >
        <div className="user-avatar">
          {getInitial()}
        </div>
        <div className="user-info">
          <span className="user-name">{currentUser.name}</span>
        </div>
      </div>
      <button 
        className="logout-top-btn"
        onClick={handleLogout}
        aria-label="Logout"
        title="Logout"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
          <path d="M16 17l5-5-5-5"/>
          <path d="M21 12H9"/>
        </svg>
        Logout
      </button>
    </div>
  );
};

export default UserProfile;
