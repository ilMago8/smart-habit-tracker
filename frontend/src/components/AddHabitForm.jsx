import React, { useState, useCallback, memo, useEffect, useRef } from 'react';

// Optimized static configurations
const HABIT_COLORS = [
  { value: '#007bff', name: 'Blue', category: 'base' },
  { value: '#00a8ff', name: 'Light Blue', category: 'cool' },
  { value: '#fbc531', name: 'Yellow', category: 'warm' },
  { value: '#44bd32', name: 'Green', category: 'natural' },
  { value: '#9c88ff', name: 'Purple', category: 'cool' },
  { value: '#e84393', name: 'Pink', category: 'warm' },
  { value: '#fd79a8', name: 'Light Pink', category: 'warm' },
  { value: '#fdcb6e', name: 'Orange', category: 'warm' },
  { value: '#6c5ce7', name: 'Indigo', category: 'cool' },
  { value: '#00b894', name: 'Teal', category: 'natural' }
];

const TARGET_OPTIONS = [
  { value: 1, label: '1 time per week', description: 'Light goal' },
  { value: 2, label: '2 times per week', description: 'Gradual start' },
  { value: 3, label: '3 times per week', description: 'Moderate frequency' },
  { value: 4, label: '4 times per week', description: 'Regular routine' },
  { value: 5, label: '5 times per week', description: 'Strong routine' },
  { value: 6, label: '6 times per week', description: 'Almost daily' },
  { value: 7, label: 'Every day', description: 'Maximum commitment' }
];

const AddHabitForm = memo(({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    color: '#007bff',
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

  // Form validation
  const validateForm = useCallback(() => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    } else if (formData.name.trim().length > 50) {
      newErrors.name = 'Name cannot exceed 50 characters';
    }

    if (formData.description && formData.description.length > 200) {
      newErrors.description = 'Description cannot exceed 200 characters';
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
      console.error('Error creating habit:', error);
      setErrors({ submit: 'Error creating habit' });
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, isSubmitting, validateForm, onSubmit]);

  const handleChange = useCallback((field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Remove error when user starts correcting
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
            New Habit
          </h3>
          <button 
            type="button"
            className="close-btn" 
            onClick={onCancel}
            aria-label="Close form"
          >
            ✕
          </button>
        </header>

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label htmlFor="habit-name">
              Habit Name *
            </label>
            <input
              id="habit-name"
              ref={nameInputRef}
              type="text"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="e.g. Drink 8 glasses of water"
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
              Description (optional)
            </label>
            <textarea
              id="habit-description"
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="Habit description..."
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
              <legend>Color</legend>
              <div className="color-selector" role="radiogroup">
                {HABIT_COLORS.map(({ value, name }) => (
                  <button
                    key={value}
                    type="button"
                    className={`color-option ${formData.color === value ? 'selected' : ''}`}
                    style={{ backgroundColor: value }}
                    onClick={() => handleChange('color', value)}
                    aria-label={`Select color ${name}`}
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
              Weekly Goal
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
              Cancel
            </button>
            <button 
              type="submit" 
              className={`submit-btn ${isSubmitting ? 'loading' : ''}`}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className="spinner" aria-hidden="true"></span>
                  Creating...
                </>
              ) : (
                'Create Habit'
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
