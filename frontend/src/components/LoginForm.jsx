import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

const LoginForm = ({ onSwitchToRegister }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { login, error } = useAuth();
  
  // Aggiorna il messaggio di errore quando cambia l'errore del contesto
  useEffect(() => {
    if (error) {
      setErrorMessage(error);
    }
  }, [error]);
  
  // Pulisci gli errori quando l'utente inizia a digitare
  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    if (errorMessage) setErrorMessage('');
  };
  
  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    if (errorMessage) setErrorMessage('');
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setIsSubmitting(true);
    
    try {
      const result = await login(email, password);
      if (!result.success) {
        setErrorMessage(result.message || 'Login fallito. Controlla le tue credenziali.');
      }
    } catch (error) {
      console.error('Errore durante il login:', error);
      setErrorMessage('Si è verificato un errore. Riprova più tardi.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
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
            value={email}
            onChange={handleEmailChange}
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
            value={password}
            onChange={handlePasswordChange}
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
