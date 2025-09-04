import React, { memo, useCallback } from 'react';

const HabitCard = memo(({ habit, onToggle, onDelete }) => {
  const { 
    id, 
    name, 
    description, 
    color, 
    icon, 
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
    if (onDelete && window.confirm(`Sei sicuro di voler eliminare l'abitudine "${name}"?`)) {
      onDelete();
    }
  }, [onDelete, name]);

  // Funzione per gestire la pressione di tasti (accessibilità)
  const handleKeyPress = useCallback((e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleToggle(e);
    }
  }, [handleToggle]);

  // Calcolo stato visuale
  const completionStatus = week_completion >= 80 ? 'excellent' : 
                          week_completion >= 60 ? 'good' : 
                          week_completion >= 30 ? 'average' : 'needs-attention';

  const buttonText = today_completed ? 
    { icon: '✅', label: 'Completato oggi' } : 
    { icon: '⭕', label: 'Segna come fatto' };

  return (
    <article 
      className={`habit-card ${completionStatus}`}
      style={{ '--habit-color': color }}
      role="article"
      aria-label={`Abitudine: ${name}`}
    >
      <header className="habit-header">
        <div className="habit-icon" role="img" aria-label={`Icona: ${icon}`}>
          {icon}
        </div>
        <div className="habit-info">
          <h3 className="habit-name">{name}</h3>
          {description && (
            <p className="habit-description" title={description}>
              {description}
            </p>
          )}
        </div>
        {onDelete && (
          <button
            type="button"
            className="delete-btn"
            onClick={handleDelete}
            aria-label={`Elimina abitudine ${name}`}
            title="Elimina abitudine"
          >
            ✕
          </button>
        )}
      </header>

      <div className="progress-section">
        <div 
          className="progress-bar" 
          role="progressbar"
          aria-valuenow={week_completion}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`Progresso settimanale: ${week_completion}%`}
        >
          <div 
            className="progress-fill" 
            style={{ width: `${Math.min(100, Math.max(0, week_completion))}%` }}
          />
        </div>
        <div className="progress-info">
          <span className="progress-text">
            {week_completion}% questa settimana
          </span>
          <span className="progress-detail">
            ({week_checks}/{target_frequency} giorni)
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
          aria-label={`${buttonText.label} per ${name}`}
        >
          <span className="btn-icon" aria-hidden="true">
            {buttonText.icon}
          </span>
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
