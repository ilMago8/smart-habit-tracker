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
  
  // Aggiorna il messaggio di errore quando cambia l'errore del contesto
  useEffect(() => {
    if (error) {
      setErrorMessage(error);
    }
  }, [error]);
  
  // Ottimizzato: gestione input unificata
  const handleInputChange = useCallback((field) => (e) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value
    }));
    if (errorMessage) setErrorMessage('');
  }, [errorMessage]);
  
  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setIsSubmitting(true);
    
    try {
      const result = await login(formData.email, formData.password);
      if (!result.success) {
        setErrorMessage(result.message || 'Login fallito. Controlla le tue credenziali.');
      }
    } catch (error) {
      console.error('Errore durante il login:', error);
      setErrorMessage('Si è verificato un errore. Riprova più tardi.');
    } finally {
      setIsSubmitting(false);
    }
  }, [login, formData.email, formData.password]);
  
  return (
    <div className="auth-form-container">
      <h2 className="auth-title">Accedi</h2>
      <p className="auth-subtitle">Bentornato! Accedi per continuare a tracciare le tue abitudini</p>
      
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
            placeholder="La tua email"
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
            placeholder="La tua password"
            className={errorMessage && errorMessage.toLowerCase().includes('password') ? 'error' : ''}
          />
        </div>
        
        <button 
          type="submit" 
          className="auth-submit-button"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Accesso in corso...' : 'Accedi'}
        </button>
      </form>
      
      <div className="auth-switch">
        <p>Non hai ancora un account?</p>
        <button 
          className="auth-switch-button" 
          onClick={onSwitchToRegister}
        >
          Registrati
        </button>
      </div>
    </div>
  );
};

export default LoginForm;
