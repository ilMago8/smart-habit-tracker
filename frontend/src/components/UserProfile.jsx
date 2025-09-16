import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

const UserProfile = () => {
  const { currentUser, logout } = useAuth();
  const [showTooltip, setShowTooltip] = useState(false);
  
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
  
  return (
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
  );
};

export default UserProfile;
