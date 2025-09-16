import React, { useState, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';

const RegisterForm = ({ onSwitchToLogin }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { register } = useAuth();
  
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
    
    // Controllo password
    if (formData.password !== formData.confirmPassword) {
      setErrorMessage('Le password non corrispondono');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const result = await register(formData.name, formData.email, formData.password);
      if (!result.success) {
        setErrorMessage(result.message || 'Registrazione fallita. Riprova più tardi.');
      }
    } catch (error) {
      console.error('Errore durante la registrazione:', error);
      setErrorMessage('Si è verificato un errore. Riprova più tardi.');
    } finally {
      setIsSubmitting(false);
    }
  }, [register, formData]);
  
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
            value={formData.name}
            onChange={handleInputChange('name')}
            required
            placeholder="Il tuo nome"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            value={formData.email}
            onChange={handleInputChange('email')}
            required
            placeholder="La tua email"
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
            placeholder="Crea una password"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="confirm-password">Conferma Password</label>
          <input
            id="confirm-password"
            type="password"
            value={formData.confirmPassword}
            onChange={handleInputChange('confirmPassword')}
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
