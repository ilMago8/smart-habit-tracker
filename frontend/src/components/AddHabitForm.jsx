import React, { useState, useCallback, memo, useEffect, useRef } from 'react';

// Configurazioni statiche ottimizzate
const HABIT_ICONS = [
  { value: '📋', label: 'Generale', category: 'base' },
  { value: '💧', label: 'Acqua', category: 'salute' },
  { value: '📚', label: 'Lettura', category: 'apprendimento' },
  { value: '🤸‍♂️', label: 'Stretching', category: 'fitness' },
  { value: '🧘‍♀️', label: 'Meditazione', category: 'benessere' },
  { value: '🏃‍♂️', label: 'Corsa', category: 'fitness' },
  { value: '🥗', label: 'Alimentazione', category: 'salute' },
  { value: '💤', label: 'Sonno', category: 'salute' },
  { value: '🎯', label: 'Obiettivi', category: 'produttività' },
  { value: '✍️', label: 'Scrittura', category: 'creatività' },
  { value: '🎨', label: 'Arte', category: 'creatività' },
  { value: '🚶‍♂️', label: 'Camminata', category: 'fitness' }
];

const HABIT_COLORS = [
  { value: '#007bff', name: 'Blu', category: 'base' },
  { value: '#00a8ff', name: 'Azzurro', category: 'freddi' },
  { value: '#fbc531', name: 'Giallo', category: 'caldi' },
  { value: '#44bd32', name: 'Verde', category: 'naturali' },
  { value: '#9c88ff', name: 'Viola', category: 'freddi' },
  { value: '#e84393', name: 'Rosa', category: 'caldi' },
  { value: '#fd79a8', name: 'Rosa chiaro', category: 'caldi' },
  { value: '#fdcb6e', name: 'Arancio', category: 'caldi' },
  { value: '#6c5ce7', name: 'Indaco', category: 'freddi' },
  { value: '#00b894', name: 'Verde acqua', category: 'naturali' }
];

const TARGET_OPTIONS = [
  { value: 1, label: '1 volta a settimana', description: 'Obiettivo leggero' },
  { value: 2, label: '2 volte a settimana', description: 'Inizio graduale' },
  { value: 3, label: '3 volte a settimana', description: 'Frequenza moderata' },
  { value: 5, label: '5 volte a settimana', description: 'Routine forte' },
  { value: 7, label: 'Tutti i giorni', description: 'Impegno massimo' }
];

const AddHabitForm = memo(({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    color: '#007bff',
    icon: '📋',
    target_frequency: 7
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Refs per focus management
  const nameInputRef = useRef(null);
  const formRef = useRef(null);

  // Focus sul primo input quando il form si monta
  useEffect(() => {
    if (nameInputRef.current) {
      nameInputRef.current.focus();
    }
  }, []);

  // Gestione ESC per chiudere il modal
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onCancel();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onCancel]);

  // Validazione form
  const validateForm = useCallback(() => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Il nome è obbligatorio';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Il nome deve avere almeno 2 caratteri';
    } else if (formData.name.trim().length > 50) {
      newErrors.name = 'Il nome non può superare i 50 caratteri';
    }

    if (formData.description && formData.description.length > 200) {
      newErrors.description = 'La descrizione non può superare i 200 caratteri';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    
    if (isSubmitting) return;
    
    if (!validateForm()) return;

    setIsSubmitting(true);
    
    try {
      const cleanedData = {
        ...formData,
        name: formData.name.trim(),
        description: formData.description?.trim() || ''
      };
      
      await onSubmit(cleanedData);
    } catch (error) {
      console.error('Errore nella creazione abitudine:', error);
      setErrors({ submit: 'Errore nella creazione dell\'abitudine' });
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, isSubmitting, validateForm, onSubmit]);

  const handleChange = useCallback((field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Rimuovi l'errore quando l'utente inizia a correggere
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  }, [errors]);

  const handleBackdropClick = useCallback((e) => {
    if (e.target === e.currentTarget) {
      onCancel();
    }
  }, [onCancel]);

  return (
    <div 
      className="add-habit-overlay" 
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="form-title"
    >
      <div className="add-habit-form" ref={formRef}>
        <header className="form-header">
          <h3 id="form-title">
            <span aria-hidden="true">➕</span>
            Nuova Abitudine
          </h3>
          <button 
            type="button"
            className="close-btn" 
            onClick={onCancel}
            aria-label="Chiudi modulo"
          >
            ✕
          </button>
        </header>

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label htmlFor="habit-name">
              Nome abitudine *
            </label>
            <input
              id="habit-name"
              ref={nameInputRef}
              type="text"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="es. Bere 8 bicchieri d'acqua"
              required
              maxLength={50}
              aria-describedby={errors.name ? 'name-error' : undefined}
              className={errors.name ? 'error' : ''}
            />
            {errors.name && (
              <span id="name-error" className="error-message" role="alert">
                {errors.name}
              </span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="habit-description">
              Descrizione (opzionale)
            </label>
            <textarea
              id="habit-description"
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="Descrizione dell'abitudine..."
              maxLength={200}
              rows={3}
              aria-describedby={errors.description ? 'description-error' : undefined}
              className={errors.description ? 'error' : ''}
            />
            {errors.description && (
              <span id="description-error" className="error-message" role="alert">
                {errors.description}
              </span>
            )}
          </div>

          <div className="form-row">
            <fieldset className="form-group">
              <legend>Icona</legend>
              <div className="icon-selector" role="radiogroup">
                {HABIT_ICONS.map(({ value, label }) => (
                  <button
                    key={value}
                    type="button"
                    className={`icon-option ${formData.icon === value ? 'selected' : ''}`}
                    onClick={() => handleChange('icon', value)}
                    aria-label={`Seleziona icona ${label}`}
                    role="radio"
                    aria-checked={formData.icon === value}
                    title={label}
                  >
                    {value}
                  </button>
                ))}
              </div>
            </fieldset>

            <fieldset className="form-group">
              <legend>Colore</legend>
              <div className="color-selector" role="radiogroup">
                {HABIT_COLORS.map(({ value, name }) => (
                  <button
                    key={value}
                    type="button"
                    className={`color-option ${formData.color === value ? 'selected' : ''}`}
                    style={{ backgroundColor: value }}
                    onClick={() => handleChange('color', value)}
                    aria-label={`Seleziona colore ${name}`}
                    role="radio"
                    aria-checked={formData.color === value}
                    title={name}
                  />
                ))}
              </div>
            </fieldset>
          </div>

          <div className="form-group">
            <label htmlFor="target-frequency">
              Obiettivo settimanale
            </label>
            <select
              id="target-frequency"
              value={formData.target_frequency}
              onChange={(e) => handleChange('target_frequency', parseInt(e.target.value))}
            >
              {TARGET_OPTIONS.map(({ value, label, description }) => (
                <option key={value} value={value} title={description}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          {errors.submit && (
            <div className="error-message submit-error" role="alert">
              {errors.submit}
            </div>
          )}

          <footer className="form-actions">
            <button 
              type="button" 
              onClick={onCancel} 
              className="cancel-btn"
              disabled={isSubmitting}
            >
              Annulla
            </button>
            <button 
              type="submit" 
              className={`submit-btn ${isSubmitting ? 'loading' : ''}`}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className="spinner" aria-hidden="true"></span>
                  Creazione...
                </>
              ) : (
                'Crea Abitudine'
              )}
            </button>
          </footer>
        </form>
      </div>
    </div>
  );
});

AddHabitForm.displayName = 'AddHabitForm';

export default AddHabitForm;
