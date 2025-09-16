import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';

const LoginForm = ({ onSwitchToRegister }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { login, error } = useAuth();
  
  // Update error message when context error changes
  useEffect(() => {
    if (error) {
      setErrorMessage(error);
    }
  }, [error]);
  
  // Optimized: unified input handling
  const handleInputChange = useCallback((field) => (e) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value
    }));
    // Removed: if (errorMessage) setErrorMessage(''); - error messages remain visible
  }, []);
  
  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setIsSubmitting(true);
    
    try {
      const result = await login(formData.email, formData.password);
      if (!result.success) {
        setErrorMessage(result.message || 'Login failed. Check your credentials.');
      }
    } catch (error) {
      console.error('Error during login:', error);
      setErrorMessage('An error occurred. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  }, [login, formData.email, formData.password]);
  
  return (
    <div className="auth-form-container">
      <h2 className="auth-title">Sign In</h2>
      <p className="auth-subtitle">Welcome back! Sign in to continue tracking your habits</p>
      
      {errorMessage && (
        <div className="auth-error-message">
          {errorMessage}
        </div>
      )}
      
      <form className="auth-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            value={formData.email}
            onChange={handleInputChange('email')}
            required
            placeholder="Your email"
            className={errorMessage && errorMessage.toLowerCase().includes('email') ? 'error' : ''}
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            value={formData.password}
            onChange={handleInputChange('password')}
            required
            placeholder="Your password"
            className={errorMessage && errorMessage.toLowerCase().includes('password') ? 'error' : ''}
          />
        </div>
        
        <button 
          type="submit" 
          className="auth-submit-button"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Signing in...' : 'Sign In'}
        </button>
      </form>
      
      <div className="auth-switch">
        <p>Don't have an account yet?</p>
        <button 
          className="auth-switch-button" 
          onClick={onSwitchToRegister}
        >
          Sign Up
        </button>
      </div>
    </div>
  );
};

export default LoginForm;
