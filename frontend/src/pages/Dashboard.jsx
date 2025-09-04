import React, { useState, useMemo, useCallback, memo, useEffect, useRef } from 'react';
import HabitCard from '../components/HabitCard';
import AddHabitForm from '../components/AddHabitForm';
import StatsPanel from '../components/StatsPanel';

const Dashboard = memo(({ habits, onToggleHabit, onAddHabit, onResetHabits, onResetToDefaults }) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [activeTab, setActiveTab] = useState('habits');
  const [showResetMenu, setShowResetMenu] = useState(false);
  const resetMenuRef = useRef(null);

  // Chiudi il menu reset quando si clicca fuori
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (resetMenuRef.current && !resetMenuRef.current.contains(event.target)) {
        setShowResetMenu(false);
      }
    };

    if (showResetMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showResetMenu]);

  // Memoized date formatting
  const today = useMemo(() => {
    return new Date().toLocaleDateString('it-IT', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  }, []);

  // Memoized calculations
  const completedToday = useMemo(() => {
    return habits.filter(habit => habit.today_completed).length;
  }, [habits]);

  // Memoized tab handlers
  const handleTabChange = useCallback((tab) => {
    setActiveTab(tab);
  }, []);

  const handleShowAddForm = useCallback(() => {
    setShowAddForm(true);
  }, []);

  const handleCancelAddForm = useCallback(() => {
    setShowAddForm(false);
  }, []);

  const handleAddHabit = useCallback((habitData) => {
    onAddHabit(habitData);
    setShowAddForm(false);
  }, [onAddHabit]);

  // Callbacks per il reset
  const handleResetProgress = useCallback(() => {
    if (window.confirm('Sei sicuro di voler azzerare i progressi di tutte le abitudini?')) {
      onResetHabits();
      setShowResetMenu(false);
    }
  }, [onResetHabits]);

  const handleResetToDefaults = useCallback(() => {
    if (window.confirm('Sei sicuro di voler resettare tutto e caricare le abitudini di esempio?')) {
      onResetToDefaults();
      setShowResetMenu(false);
    }
  }, [onResetToDefaults]);

  // Memoized empty state
  const emptyState = useMemo(() => (
    <div className="empty-state">
      <div className="empty-icon">🎯</div>
      <h3>Nessuna abitudine ancora</h3>
      <p>Inizia il tuo percorso di crescita personale creando la tua prima abitudine!</p>
      <button 
        className="cta-button"
        onClick={handleShowAddForm}
      >
        ✨ Crea la tua prima abitudine
      </button>
    </div>
  ), [handleShowAddForm]);

  // Memoized habits list
  const habitsList = useMemo(() => {
    if (habits.length === 0) return emptyState;
    
    return habits.map(habit => (
      <HabitCard
        key={habit.id}
        habit={habit}
        onToggle={() => onToggleHabit(habit.id)}
      />
    ));
  }, [habits, onToggleHabit, emptyState]);

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="header-content">
          <h1 className="app-title">
            <span className="title-icon">🌟</span>
            Smart Habit Tracker
          </h1>
          <p className="date" aria-label={`Oggi è ${today}`}>{today}</p>
          <div className="daily-summary" role="status">
            <div className="progress-circle">
              <span className="completed">{completedToday}</span>
              <span className="separator">/</span>
              <span className="total">{habits.length}</span>
            </div>
            <span className="label">abitudini completate oggi</span>
          </div>
        </div>
      </header>

      <nav className="dashboard-tabs" role="tablist">
        <button 
          className={`tab ${activeTab === 'habits' ? 'active' : ''}`}
          onClick={() => handleTabChange('habits')}
          role="tab"
          aria-selected={activeTab === 'habits'}
          aria-label="Visualizza le tue abitudini"
        >
          <span className="tab-icon">📋</span>
          Le Mie Abitudini
        </button>
        <button 
          className={`tab ${activeTab === 'stats' ? 'active' : ''}`}
          onClick={() => handleTabChange('stats')}
          role="tab"
          aria-selected={activeTab === 'stats'}
          aria-label="Visualizza le statistiche"
        >
          <span className="tab-icon">📊</span>
          Statistiche
        </button>
      </nav>

      <main className="dashboard-content">
        {activeTab === 'habits' && (
          <div className="habits-section" role="tabpanel">
            <div className="section-header">
              <h2>Abitudini di Oggi</h2>
              <div className="section-actions">
                {habits.length > 0 && (
                  <>
                    <div className="reset-menu-container" ref={resetMenuRef}>
                      <button 
                        className="reset-btn"
                        onClick={() => setShowResetMenu(!showResetMenu)}
                        aria-label="Menu reset"
                        title="Opzioni reset"
                      >
                        <span className="btn-icon">🔄</span>
                        Reset
                      </button>
                      {showResetMenu && (
                        <div className="reset-dropdown">
                          <button 
                            className="reset-option"
                            onClick={handleResetProgress}
                            title="Azzera solo i progressi, mantieni le abitudini"
                          >
                            <span className="option-icon">📊</span>
                            Azzera Progressi
                          </button>
                          <button 
                            className="reset-option danger"
                            onClick={handleResetToDefaults}
                            title="Elimina tutto e carica le abitudini di esempio"
                          >
                            <span className="option-icon">🏠</span>
                            Reset Completo
                          </button>
                        </div>
                      )}
                    </div>
                    <button 
                      className="add-habit-btn"
                      onClick={handleShowAddForm}
                      aria-label="Aggiungi una nuova abitudine"
                    >
                      <span className="btn-icon">➕</span>
                      Nuova Abitudine
                    </button>
                  </>
                )}
              </div>
            </div>

            {showAddForm && (
              <AddHabitForm 
                onSubmit={handleAddHabit}
                onCancel={handleCancelAddForm}
              />
            )}

            <div className="habits-grid">
              {habitsList}
            </div>
          </div>
        )}

        {activeTab === 'stats' && (
          <div role="tabpanel">
            <StatsPanel habits={habits} />
          </div>
        )}
      </main>
    </div>
  );
});

Dashboard.displayName = 'Dashboard';

export default Dashboard;
