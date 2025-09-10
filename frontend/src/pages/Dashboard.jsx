import React, { useState, useMemo, useCallback, memo } from 'react';
import HabitCard from '../components/HabitCard';
import AddHabitForm from '../components/AddHabitForm';
import StatsPanel from '../components/StatsPanel';
import UserProfile from '../components/UserProfile';
import UserProfilePage from '../components/UserProfilePage';

const Dashboard = memo(({ habits, onToggleHabit, onAddHabit, onDeleteHabit, onResetProgress }) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [activeTab, setActiveTab] = useState('habits');

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

  // Memoized empty state
  const emptyState = useMemo(() => (
    <div className="empty-state">
      <div className="empty-icon"></div>
      <h3>Nessuna abitudine ancora</h3>
      <p>Inizia il tuo percorso di crescita personale creando la tua prima abitudine!</p>
      <button 
        className="cta-button"
        onClick={handleShowAddForm}
      >
        Crea la tua prima abitudine
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
        onDelete={onDeleteHabit ? () => onDeleteHabit(habit.id) : undefined}
      />
    ));
  }, [habits, onToggleHabit, onDeleteHabit, emptyState]);

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="dashboard-top-bar">
          <h1 className="app-title">Smart Habit Tracker</h1>
          <UserProfile />
        </div>
        
        <div className="dashboard-info">
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
          Le Mie Abitudini
        </button>
        <button 
          className={`tab ${activeTab === 'stats' ? 'active' : ''}`}
          onClick={() => handleTabChange('stats')}
          role="tab"
          aria-selected={activeTab === 'stats'}
          aria-label="Visualizza le statistiche"
        >
          Statistiche
        </button>
        <button 
          className={`tab ${activeTab === 'profile' ? 'active' : ''}`}
          onClick={() => handleTabChange('profile')}
          role="tab"
          aria-selected={activeTab === 'profile'}
          aria-label="Gestisci il tuo profilo"
        >
          Profilo Utente
        </button>
      </nav>

      <main className="dashboard-content">
        {activeTab === 'habits' && (
          <div className="habits-section" role="tabpanel">
            <div className="section-header">
              <h2>Abitudini di Oggi</h2>
              <div className="header-actions">
                {habits.length > 0 && (
                  <>
                    <button 
                      className="add-habit-btn"
                      onClick={handleShowAddForm}
                      aria-label="Aggiungi una nuova abitudine"
                    >
                      Nuova Abitudine
                    </button>
                    {onResetProgress && (
                      <button 
                        className="reset-btn"
                        onClick={onResetProgress}
                        aria-label="Resetta tutti i progressi"
                        title="Resetta tutti i progressi"
                      >
                        Reset
                      </button>
                    )}
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

        {activeTab === 'profile' && (
          <div role="tabpanel">
            <UserProfilePage habits={habits} />
          </div>
        )}
      </main>
    </div>
  );
});

Dashboard.displayName = 'Dashboard';

export default Dashboard;
