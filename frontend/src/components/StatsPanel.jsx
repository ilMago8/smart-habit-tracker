import React, { useState, useEffect } from 'react';

const StatsPanel = ({ habits }) => {
  const [weeklyStats, setWeeklyStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/habits/stats');
        const data = await response.json();
        if (data.success) {
          setWeeklyStats(data.data);
        }
      } catch (error) {
        console.error('Errore nel recupero statistiche:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [habits]);

  if (loading) {
    return <div className="loading">Caricamento statistiche...</div>;
  }

  if (!weeklyStats) {
    return <div className="error">Errore nel caricamento delle statistiche</div>;
  }

  const { habits: habitStats, summary } = weeklyStats;

  return (
    <div className="stats-panel">
      <div className="stats-header">
        <h2>📊 Statistiche Settimanali</h2>
        <p className="date-range">
          {new Date(summary.week_start).toLocaleDateString('it-IT')} - {' '}
          {new Date(summary.week_end).toLocaleDateString('it-IT')}
        </p>
      </div>

      <div className="summary-cards">
        <div className="summary-card">
          <div className="card-icon">🎯</div>
          <div className="card-content">
            <h3>{summary.total_habits}</h3>
            <p>Abitudini Attive</p>
          </div>
        </div>

        <div className="summary-card">
          <div className="card-icon">📈</div>
          <div className="card-content">
            <h3>{summary.average_completion}%</h3>
            <p>Completamento Medio</p>
          </div>
        </div>

        <div className="summary-card">
          <div className="card-icon">⭐</div>
          <div className="card-content">
            <h3>{habitStats.filter(h => h.completion_percentage >= 80).length}</h3>
            <p>Obiettivi Raggiunti</p>
          </div>
        </div>
      </div>

      <div className="habits-stats">
        <h3>Dettaglio per Abitudine</h3>
        <div className="stats-list">
          {habitStats.length === 0 ? (
            <p className="empty-stats">Nessuna statistica disponibile</p>
          ) : (
            habitStats.map(habit => (
              <div key={habit.id} className="stat-item">
                <div className="stat-header">
                  <span className="stat-name">{habit.name}</span>
                  <span className={`stat-percentage ${habit.completion_percentage >= 80 ? 'high' : habit.completion_percentage >= 50 ? 'medium' : 'low'}`}>
                    {habit.completion_percentage}%
                  </span>
                </div>
                <div className="stat-progress">
                  <div 
                    className="stat-bar" 
                    style={{ 
                      width: `${habit.completion_percentage}%`,
                      backgroundColor: habit.color 
                    }}
                  ></div>
                </div>
                <div className="stat-details">
                  <span>{habit.completed_days}/{habit.target_frequency} giorni completati</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="motivational-message">
        {summary.average_completion >= 80 && (
          <div className="message success">
            🎉 Fantastico! Stai mantenendo le tue abitudini alla grande!
          </div>
        )}
        {summary.average_completion >= 50 && summary.average_completion < 80 && (
          <div className="message good">
            👏 Ottimo progresso! Continua così per raggiungere i tuoi obiettivi!
          </div>
        )}
        {summary.average_completion < 50 && summary.total_habits > 0 && (
          <div className="message encourage">
            💪 Non scoraggiarti! Ogni piccolo passo conta verso i tuoi obiettivi!
          </div>
        )}
      </div>
    </div>
  );
};

export default StatsPanel;
