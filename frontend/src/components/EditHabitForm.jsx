import React, { useState } from 'react';
import habitIcons, { iconCategories } from './HabitIcons';

const EditHabitForm = ({ habit, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: habit.name,
    color: habit.color,
    target_frequency: habit.target_frequency || 7,
    icon: habit.icon || 'target'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const colors = [
    '#6366f1', '#8b5cf6', '#ec4899', '#ef4444',
    '#f59e0b', '#10b981', '#14b8a6', '#3b82f6',
    '#6366f1', '#64748b'
  ];

  const frequencies = [
    { value: 1, label: '1 time per week', description: 'Light goal' },
    { value: 2, label: '2 times per week', description: 'Gradual start' },
    { value: 3, label: '3 times per week', description: 'Moderate frequency' },
    { value: 4, label: '4 times per week', description: 'Regular routine' },
    { value: 5, label: '5 times per week', description: 'Strong routine' },
    { value: 6, label: '6 times per week', description: 'Almost daily' },
    { value: 7, label: 'Every day', description: 'Maximum commitment' }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      setError('Habit name is required');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      await onSubmit(formData);
    } catch (err) {
      setError(err.message || 'Failed to update habit');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="edit-habit-overlay" onClick={onCancel}>
      <div className="edit-habit-modal" onClick={(e) => e.stopPropagation()}>
        <div className="edit-habit-header">
          <h2>Edit Habit</h2>
          <button 
            className="close-button" 
            onClick={onCancel}
            disabled={isSubmitting}
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="edit-habit-name">Habit Name</label>
            <input
              id="edit-habit-name"
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., Morning meditation"
              maxLength={100}
              disabled={isSubmitting}
              required
            />
          </div>

          <div className="form-group">
            <label>Color</label>
            <div className="color-picker">
              {colors.map(color => (
                <button
                  key={color}
                  type="button"
                  className={`color-option ${formData.color === color ? 'selected' : ''}`}
                  style={{ backgroundColor: color }}
                  onClick={() => setFormData({ ...formData, color })}
                  disabled={isSubmitting}
                />
              ))}
            </div>
          </div>

          <div className="form-group">
            <label>Icon</label>
            <div className="icon-selector">
              {Object.entries(iconCategories).map(([category, icons]) => (
                <div key={category} className="icon-category">
                  <div className="icon-category-label">{category}</div>
                  <div className="icon-grid">
                    {icons.map((iconKey) => (
                      <button
                        key={iconKey}
                        type="button"
                        className={`icon-option ${formData.icon === iconKey ? 'selected' : ''}`}
                        onClick={() => setFormData({ ...formData, icon: iconKey })}
                        title={iconKey}
                        disabled={isSubmitting}
                        dangerouslySetInnerHTML={{ __html: habitIcons[iconKey] }}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label>Weekly Goal</label>
            <div className="frequency-options">
              {frequencies.map(freq => (
                <button
                  key={freq.value}
                  type="button"
                  className={`frequency-option ${formData.target_frequency === freq.value ? 'selected' : ''}`}
                  onClick={() => setFormData({ ...formData, target_frequency: freq.value })}
                  disabled={isSubmitting}
                >
                  <div className="frequency-label">{freq.label}</div>
                  <div className="frequency-description">{freq.description}</div>
                </button>
              ))}
            </div>
          </div>

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <div className="form-actions">
            <button 
              type="button" 
              className="cancel-button"
              onClick={onCancel}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="submit-button"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditHabitForm;
