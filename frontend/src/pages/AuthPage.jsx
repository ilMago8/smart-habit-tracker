import React, { useState } from 'react';
import LoginForm from '../components/LoginForm';
import RegisterForm from '../components/RegisterForm';

const AuthPage = () => {
  const [currentForm, setCurrentForm] = useState('login');
  
  const toggleForm = () => {
    setCurrentForm(currentForm === 'login' ? 'register' : 'login');
  };
  
  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-branding">
          <h1 className="auth-app-title">Smart Habit Tracker</h1>
          <p className="auth-app-tagline">Trasforma le tue abitudini, trasforma la tua vita</p>
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
