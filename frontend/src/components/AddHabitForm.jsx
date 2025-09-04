import React, { useState } from 'react';

const AddHabitForm = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    color: '#007bff',
    icon: '📋',
    target_frequency: 7
  });

  const predefinedIcons = ['📋', '💧', '📚', '🤸‍♂️', '🧘‍♀️', '🏃‍♂️', '🥗', '💤', '🎯', '✍️'];
  const predefinedColors = ['#007bff', '#00a8ff', '#fbc531', '#44bd32', '#9c88ff', '#e84393', '#fd79a8', '#fdcb6e', '#6c5ce7', '#a29bfe'];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.name.trim()) {
      onSubmit(formData);
      onCancel();
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="add-habit-overlay">
      <div className="add-habit-form">
        <div className="form-header">
          <h3>➕ Nuova Abitudine</h3>
          <button className="close-btn" onClick={onCancel}>✕</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Nome abitudine *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="es. Bere 8 bicchieri d'acqua"
              required
            />
          </div>

          <div className="form-group">
            <label>Descrizione (opzionale)</label>
            <textarea
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="Descrizione dell'abitudine..."
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Icona</label>
              <div className="icon-selector">
                {predefinedIcons.map(icon => (
                  <button
                    key={icon}
                    type="button"
                    className={`icon-option ${formData.icon === icon ? 'selected' : ''}`}
                    onClick={() => handleChange('icon', icon)}
                  >
                    {icon}
                  </button>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label>Colore</label>
              <div className="color-selector">
                {predefinedColors.map(color => (
                  <button
                    key={color}
                    type="button"
                    className={`color-option ${formData.color === color ? 'selected' : ''}`}
                    style={{ backgroundColor: color }}
                    onClick={() => handleChange('color', color)}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="form-group">
            <label>Obiettivo settimanale</label>
            <select
              value={formData.target_frequency}
              onChange={(e) => handleChange('target_frequency', parseInt(e.target.value))}
            >
              <option value={1}>1 volta a settimana</option>
              <option value={2}>2 volte a settimana</option>
              <option value={3}>3 volte a settimana</option>
              <option value={5}>5 volte a settimana</option>
              <option value={7}>Tutti i giorni</option>
            </select>
          </div>

          <div className="form-actions">
            <button type="button" onClick={onCancel} className="cancel-btn">
              Annulla
            </button>
            <button type="submit" className="submit-btn">
              Crea Abitudine
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddHabitForm;
