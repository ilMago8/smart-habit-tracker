import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

const RegisterForm = ({ onSwitchToLogin }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { register } = useAuth();
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    
    // Controllo password
    if (password !== confirmPassword) {
      setErrorMessage('Le password non corrispondono');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const result = await register(name, email, password);
      if (!result.success) {
        setErrorMessage(result.message || 'Registrazione fallita. Riprova più tardi.');
      }
    } catch (error) {
      console.error('Errore durante la registrazione:', error);
      setErrorMessage('Si è verificato un errore. Riprova più tardi.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="auth-form-container">
      <h2 className="auth-title">Crea un account</h2>
      <p className="auth-subtitle">Inizia a tracciare le tue abitudini e a migliorare la tua vita</p>
      
      {errorMessage && (
        <div className="auth-error-message">
          {errorMessage}
        </div>
      )}
      
      <form className="auth-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Nome</label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder="Il tuo nome"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="La tua email"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="Crea una password"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="confirm-password">Conferma Password</label>
          <input
            id="confirm-password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            placeholder="Conferma la tua password"
          />
        </div>
        
        <button 
          type="submit" 
          className="auth-submit-button"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Registrazione in corso...' : 'Registrati'}
        </button>
      </form>
      
      <div className="auth-switch">
        <p>Hai già un account?</p>
        <button 
          className="auth-switch-button" 
          onClick={onSwitchToLogin}
        >
          Accedi
        </button>
      </div>
    </div>
  );
};

export default RegisterForm;
