import React, { useState, useEffect, useMemo, memo, useCallback } from 'react';

const StatsPanel = memo(({ habits }) => {
  const [weeklyStats, setWeeklyStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Memoized calculations per evitare ricalcoli inutili
  const statsData = useMemo(() => {
    if (!habits || habits.length === 0) {
      return {
        habits: [],
        summary: {
          total_habits: 0,
          average_completion: 0,
          week_start: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          week_end: new Date().toISOString().split('T')[0]
        }
      };
    }

    const totalCompletion = habits.reduce((sum, h) => sum + (h.week_completion || 0), 0);
    const averageCompletion = Math.round(totalCompletion / habits.length);

    return {
      habits: habits.map(habit => ({
        id: habit.id,
        name: habit.name,
        color: habit.color,
        icon: habit.icon,
        target_frequency: habit.target_frequency || 7,
        completed_days: habit.week_checks || 0,
        completion_percentage: habit.week_completion || 0
      })),
      summary: {
        total_habits: habits.length,
        average_completion: averageCompletion,
        successful_habits: habits.filter(h => (h.week_completion || 0) >= 80).length,
        week_start: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        week_end: new Date().toISOString().split('T')[0]
      }
    };
  }, [habits]);

  // Fetch ottimizzato con error handling
  const fetchStats = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Simulazione loading realistico
      await new Promise(resolve => setTimeout(resolve, 300));
      
      setWeeklyStats(statsData);
      
      // Codice per backend futuro:
      /*
      const response = await fetch('/api/habits/stats');
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      if (data.success) {
        setWeeklyStats(data.data);
      } else {
        throw new Error(data.message || 'Failed to fetch stats');
      }
      */
    } catch (error) {
      console.error('Errore nel recupero statistiche:', error);
      setError('Impossibile caricare le statistiche');
      setWeeklyStats(statsData); // Fallback ai dati locali
    } finally {
      setLoading(false);
    }
  }, [statsData]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  // Memoized motivational message
  const motivationalMessage = useMemo(() => {
    if (!weeklyStats) return null;
    
    const { average_completion, total_habits } = weeklyStats.summary;
    
    if (total_habits === 0) {
      return {
        type: 'empty',
        icon: '🎯',
        title: 'Inizia il tuo percorso!',
        message: 'Crea la tua prima abitudine per iniziare a tracciare i progressi.'
      };
    }
    
    if (average_completion >= 90) {
      return {
        type: 'excellent',
        icon: '🏆',
        title: 'Eccellente!',
        message: 'Sei un campione delle abitudini! Continua così!'
      };
    } else if (average_completion >= 80) {
      return {
        type: 'success',
        icon: '🎉',
        title: 'Fantastico!',
        message: 'Stai mantenendo le tue abitudini alla grande!'
      };
    } else if (average_completion >= 60) {
      return {
        type: 'good',
        icon: '👏',
        title: 'Ottimo progresso!',
        message: 'Continua così per raggiungere i tuoi obiettivi!'
      };
    } else if (average_completion >= 30) {
      return {
        type: 'moderate',
        icon: '📈',
        title: 'Buon inizio!',
        message: 'Stai costruendo le tue routine. Piccoli passi portano a grandi risultati!'
      };
    } else {
      return {
        type: 'encourage',
        icon: '💪',
        title: 'Non mollare!',
        message: 'Ogni giorno è una nuova opportunità. Concentrati su un\'abitudine alla volta!'
      };
    }
  }, [weeklyStats]);

  if (loading) {
    return (
      <div className="stats-loading">
        <div className="spinner large"></div>
        <p>Caricamento statistiche...</p>
      </div>
    );
  }

  if (error && !weeklyStats) {
    return (
      <div className="stats-error">
        <div className="error-icon">📊</div>
        <h3>Errore nel caricamento</h3>
        <p>{error}</p>
        <button onClick={fetchStats} className="retry-btn">
          Riprova
        </button>
      </div>
    );
  }

  const { habits: habitStats, summary } = weeklyStats;

  return (
    <div className="stats-panel">
      <header className="stats-header">
        <h2>
          <span className="header-icon" aria-hidden="true">📊</span>
          Statistiche Settimanali
        </h2>
        <p className="date-range" aria-label={`Periodo dal ${new Date(summary.week_start).toLocaleDateString('it-IT')} al ${new Date(summary.week_end).toLocaleDateString('it-IT')}`}>
          {new Date(summary.week_start).toLocaleDateString('it-IT')} - {' '}
          {new Date(summary.week_end).toLocaleDateString('it-IT')}
        </p>
      </header>

      <div className="summary-cards">
        <div className="summary-card habits-count">
          <div className="card-icon" aria-hidden="true">🎯</div>
          <div className="card-content">
            <h3>{summary.total_habits}</h3>
            <p>Abitudini Attive</p>
          </div>
        </div>

        <div className="summary-card average-completion">
          <div className="card-icon" aria-hidden="true">📈</div>
          <div className="card-content">
            <h3>{summary.average_completion}%</h3>
            <p>Completamento Medio</p>
          </div>
        </div>

        <div className="summary-card successful-habits">
          <div className="card-icon" aria-hidden="true">⭐</div>
          <div className="card-content">
            <h3>{summary.successful_habits || 0}</h3>
            <p>Obiettivi Raggiunti</p>
          </div>
        </div>
      </div>

      <section className="habits-stats">
        <h3>Dettaglio per Abitudine</h3>
        <div className="stats-list">
          {habitStats.length === 0 ? (
            <div className="empty-stats">
              <div className="empty-icon">📋</div>
              <p>Nessuna abitudine da tracciare</p>
              <p>Crea la tua prima abitudine per vedere le statistiche!</p>
            </div>
          ) : (
            habitStats
              .sort((a, b) => b.completion_percentage - a.completion_percentage) // Ordina per performance
              .map(habit => (
                <article key={habit.id} className="stat-item">
                  <header className="stat-header">
                    <div className="stat-info">
                      <span className="habit-icon" aria-hidden="true">{habit.icon}</span>
                      <span className="stat-name">{habit.name}</span>
                    </div>
                    <span 
                      className={`stat-percentage ${
                        habit.completion_percentage >= 80 ? 'high' : 
                        habit.completion_percentage >= 50 ? 'medium' : 'low'
                      }`}
                      aria-label={`Completamento ${habit.completion_percentage}%`}
                    >
                      {habit.completion_percentage}%
                    </span>
                  </header>
                  <div className="stat-progress">
                    <div 
                      className="stat-bar" 
                      style={{ 
                        width: `${Math.min(100, Math.max(0, habit.completion_percentage))}%`,
                        backgroundColor: habit.color 
                      }}
                      role="progressbar"
                      aria-valuenow={habit.completion_percentage}
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-label={`Progresso ${habit.name}: ${habit.completion_percentage}%`}
                    />
                  </div>
                  <div className="stat-details">
                    <span>
                      {habit.completed_days}/{habit.target_frequency} giorni completati
                    </span>
                    <span className="frequency-info">
                      (obiettivo: {habit.target_frequency === 7 ? 'quotidiano' : `${habit.target_frequency}x/settimana`})
                    </span>
                  </div>
                </article>
              ))
          )}
        </div>
      </section>

      {motivationalMessage && (
        <aside className={`motivational-message ${motivationalMessage.type}`}>
          <div className="message-content">
            <span className="message-icon" aria-hidden="true">
              {motivationalMessage.icon}
            </span>
            <div className="message-text">
              <h4>{motivationalMessage.title}</h4>
              <p>{motivationalMessage.message}</p>
            </div>
          </div>
        </aside>
      )}
    </div>
  );
});

StatsPanel.displayName = 'StatsPanel';

export default StatsPanel;
