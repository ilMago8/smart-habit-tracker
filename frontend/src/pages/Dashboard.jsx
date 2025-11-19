import React, { useState, useMemo, useCallback, memo } from 'react';
import HabitCard from '../components/HabitCard';
import AddHabitForm from '../components/AddHabitForm';
import EditHabitForm from '../components/EditHabitForm';
import StatsPanel from '../components/StatsPanel';
import UserProfile from '../components/UserProfile';
import UserProfilePage from '../components/UserProfilePage';

const Dashboard = memo(({ habits, onToggleHabit, onAddHabit, onUpdateHabit, onDeleteHabit, onResetProgress, onDeleteAllHabits, onLogout, isResetting = false, isDeletingAll = false }) => {
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
          <h1 className="app-title">
            <span aria-hidden="true" style={{display:'inline-flex',alignItems:'center',justifyContent:'center',width:28,height:28,borderRadius:6,background:'var(--primary-color)',color:'#fff',marginRight:'8px'}}>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12a9 9 0 1 1-9-9"/>
                <path d="m3.5 12 6 6L20 7.5"/>
              </svg>
            </span>
            Smart Habit Tracker
          </h1>
          <UserProfile onGoProfile={() => setActiveTab('profile')} onLogout={onLogout} />
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
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <rect x="3" y="4" width="7" height="7" rx="2"></rect>
            <rect x="14" y="4" width="7" height="7" rx="2"></rect>
            <rect x="3" y="14" width="7" height="7" rx="2"></rect>
            <rect x="14" y="14" width="7" height="7" rx="2"></rect>
          </svg>
          My Habits
        </button>
        <button 
          className={`tab ${activeTab === 'stats' ? 'active' : ''}`}
          onClick={() => handleTabChange('stats')}
          role="tab"
          aria-selected={activeTab === 'stats'}
          aria-label="View statistics"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M3 3v18h18"/>
            <rect x="7" y="13" width="3" height="5" rx="1"/>
            <rect x="12" y="9" width="3" height="9" rx="1"/>
            <rect x="17" y="6" width="3" height="12" rx="1"/>
          </svg>
          Statistics
        </button>
        <button 
          className={`tab ${activeTab === 'profile' ? 'active' : ''}`}
          onClick={() => handleTabChange('profile')}
          role="tab"
          aria-selected={activeTab === 'profile'}
          aria-label="Manage your profile"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M20 21a8 8 0 0 0-16 0"/>
            <circle cx="12" cy="7" r="4"/>
          </svg>
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
                        className={`reset-btn ${isResetting ? 'loading' : ''}`}
                        onClick={onResetProgress}
                        aria-label="Reset progress for all habits (does not delete habits)"
                        title="Reset progress for all habits (does not delete habits)"
                        disabled={isResetting}
                      >
                        {isResetting ? (
                          'Resetting…'
                        ) : (
                          <>
                            {/* refresh icon */}
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{marginRight:8}}>
                              <path d="M21 12a9 9 0 1 1-3-6.7"/>
                              <polyline points="21 3 21 9 15 9"/>
                            </svg>
                            Reset progress
                          </>
                        )}
                      </button>
                    )}
                    {onDeleteAllHabits && (
                      <button
                        className={`delete-all-btn ${isDeletingAll ? 'loading' : ''}`}
                        onClick={onDeleteAllHabits}
                        aria-label="Delete all habits"
                        title="Delete all habits"
                        disabled={isDeletingAll}
                      >
                        {isDeletingAll ? 'Deleting…' : 'Delete all'}
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
