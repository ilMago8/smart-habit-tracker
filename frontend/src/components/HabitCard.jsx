import React, { memo, useCallback } from 'react';

const HabitCard = memo(({ habit, onToggle, onDelete, onEdit }) => {
  const { 
    id, 
    name, 
    description, 
    color, 
    week_completion, 
    today_completed, 
    week_checks, 
    target_frequency 
  } = habit;

  const handleToggle = useCallback((e) => {
    e.preventDefault();
    onToggle(id);
  }, [id, onToggle]);

  const handleDelete = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onDelete && window.confirm(`Are you sure you want to delete the habit "${name}"?`)) {
      onDelete();
    }
  }, [onDelete, name]);

  const handleEdit = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onEdit) {
      onEdit(habit);
    }
  }, [onEdit, habit]);

  // Function to handle key press (accessibility)
  const handleKeyPress = useCallback((e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleToggle(e);
    }
  }, [handleToggle]);

  // Visual status calculation
  const completionStatus = week_completion >= 80 ? 'excellent' : 
                          week_completion >= 60 ? 'good' : 
                          week_completion >= 30 ? 'average' : 'needs-attention';

  const buttonText = today_completed ? 
    { label: 'Completed ✓', action: 'Click to undo' } : 
    { label: 'Mark as done', action: 'Click to complete' };

  return (
    <article 
      className={`habit-card ${completionStatus}`}
      style={{ '--habit-color': color }}
      role="article"
      aria-label={`Habit: ${name}`}
    >
      <header className="habit-header">
        <div className="habit-color-indicator" style={{ backgroundColor: color }}></div>
        <div className="habit-info">
          <h3 className="habit-name">{name}</h3>
          {description && (
            <p className="habit-description" title={description}>
              {description}
            </p>
          )}
        </div>
        <div className="habit-actions-header">
          {onEdit && (
            <button
              type="button"
              className="edit-btn"
              onClick={handleEdit}
              aria-label={`Edit habit ${name}`}
              title="Edit habit"
            >
              ✏️
            </button>
          )}
          {onDelete && (
            <button
              type="button"
              className="delete-btn"
              onClick={handleDelete}
              aria-label={`Delete habit ${name}`}
              title="Delete habit"
            >
              🗑️
            </button>
          )}
        </div>
      </header>

      <div className="progress-section">
        <div 
          className="progress-bar" 
          role="progressbar"
          aria-valuenow={week_completion}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`Weekly progress: ${week_completion}%`}
        >
          <div 
            className="progress-fill" 
            style={{ width: `${Math.min(100, Math.max(0, week_completion))}%` }}
          />
        </div>
        <div className="progress-info">
          <span className="progress-text">
            {week_completion}% this week
          </span>
          <span className="progress-detail">
            ({week_checks}/{target_frequency} days)
          </span>
        </div>
      </div>

      <footer className="habit-actions">
        <button
          type="button"
          className={`check-btn ${today_completed ? 'completed' : 'pending'}`}
          onClick={handleToggle}
          onKeyDown={handleKeyPress}
          aria-pressed={today_completed}
          aria-label={`${buttonText.label} for ${name}`}
          title={buttonText.action}
        >
          <span className="btn-text">
            {buttonText.label}
          </span>
        </button>
      </footer>
    </article>
  );
});

HabitCard.displayName = 'HabitCard';

export default HabitCard;
