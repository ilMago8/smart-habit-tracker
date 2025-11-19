import React, { useState, useMemo, useCallback, memo } from 'react';
import HabitCard from '../components/HabitCard';
import AddHabitForm from '../components/AddHabitForm';
import EditHabitForm from '../components/EditHabitForm';
import StatsPanel from '../components/StatsPanel';
import UserProfile from '../components/UserProfile';
import UserProfilePage from '../components/UserProfilePage';

const Dashboard = memo(({ habits, onToggleHabit, onAddHabit, onUpdateHabit, onDeleteHabit, onResetProgress }) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingHabit, setEditingHabit] = useState(null);
  const [activeTab, setActiveTab] = useState('habits');

  // Memoized date formatting
  const today = useMemo(() => {
    return new Date().toLocaleDateString('en-US', { 
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

  const handleEditHabit = useCallback((habit) => {
    setEditingHabit(habit);
  }, []);

  const handleUpdateHabit = useCallback(async (habitData) => {
    if (!editingHabit) return;
    
    try {
      await onUpdateHabit(editingHabit.id, habitData);
      setEditingHabit(null);
    } catch (error) {
      throw error;
    }
  }, [editingHabit, onUpdateHabit]);

  const handleCancelEdit = useCallback(() => {
    setEditingHabit(null);
  }, []);

  // Memoized empty state
  const emptyState = useMemo(() => (
    <div className="empty-state">
      <div className="empty-icon"></div>
      <h3>No habits yet</h3>
      <p>Start your personal growth journey by creating your first habit!</p>
      <button 
        className="cta-button"
        onClick={handleShowAddForm}
      >
        Create your first habit
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
        onEdit={handleEditHabit}
        onDelete={onDeleteHabit ? () => onDeleteHabit(habit.id) : undefined}
      />
    ));
  }, [habits, onToggleHabit, handleEditHabit, onDeleteHabit, emptyState]);

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="dashboard-top-bar">
          <h1 className="app-title">Smart Habit Tracker</h1>
          <UserProfile />
        </div>
        
        <div className="dashboard-info">
          <p className="date" aria-label={`Today is ${today}`}>{today}</p>
          
          <div className="daily-summary" role="status">
            <div className="progress-circle">
              <span className="completed">{completedToday}</span>
              <span className="separator">/</span>
              <span className="total">{habits.length}</span>
            </div>
            <span className="label">habits completed today</span>
          </div>
        </div>
      </header>

      <nav className="dashboard-tabs" role="tablist">
        <button 
          className={`tab ${activeTab === 'habits' ? 'active' : ''}`}
          onClick={() => handleTabChange('habits')}
          role="tab"
          aria-selected={activeTab === 'habits'}
          aria-label="View your habits"
        >
          My Habits
        </button>
        <button 
          className={`tab ${activeTab === 'stats' ? 'active' : ''}`}
          onClick={() => handleTabChange('stats')}
          role="tab"
          aria-selected={activeTab === 'stats'}
          aria-label="View statistics"
        >
          Statistics
        </button>
        <button 
          className={`tab ${activeTab === 'profile' ? 'active' : ''}`}
          onClick={() => handleTabChange('profile')}
          role="tab"
          aria-selected={activeTab === 'profile'}
          aria-label="Manage your profile"
        >
          User Profile
        </button>
      </nav>

      <main className="dashboard-content">
        {activeTab === 'habits' && (
          <div className="habits-section" role="tabpanel">
            <div className="section-header">
              <h2>Today's Habits</h2>
              <div className="header-actions">
                {habits.length > 0 && (
                  <>
                    <button 
                      className="add-habit-btn"
                      onClick={handleShowAddForm}
                      aria-label="Add a new habit"
                    >
                      New Habit
                    </button>
                    {onResetProgress && (
                      <button 
                        className="reset-btn"
                        onClick={onResetProgress}
                        aria-label="Reset all progress"
                        title="Reset all progress"
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

            {editingHabit && (
              <EditHabitForm 
                habit={editingHabit}
                onSubmit={handleUpdateHabit}
                onCancel={handleCancelEdit}
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
