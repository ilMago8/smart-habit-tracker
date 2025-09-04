import React from 'react';

const HabitCard = ({ habit, onToggle }) => {
  const { name, description, color, icon, week_completion, today_completed } = habit;

  return (
    <div className="habit-card" style={{ '--habit-color': color }}>
      <div className="habit-header">
        <span className="habit-icon">{icon}</span>
        <div className="habit-info">
          <h3 className="habit-name">{name}</h3>
          {description && <p className="habit-description">{description}</p>}
        </div>
      </div>

      <div className="progress-section">
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ width: `${week_completion}%` }}
          ></div>
        </div>
        <span className="progress-text">{week_completion}% questa settimana</span>
      </div>

      <div className="habit-actions">
        <button
          className={`check-btn ${today_completed ? 'completed' : ''}`}
          onClick={onToggle}
        >
          {today_completed ? '✅ Completato' : '⭕ Da fare'}
        </button>
      </div>
    </div>
  );
};

export default HabitCard;
