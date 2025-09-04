import React, { useState } from 'react';
import HabitCard from '../components/HabitCard';
import AddHabitForm from '../components/AddHabitForm';
import StatsPanel from '../components/StatsPanel';

const Dashboard = ({ habits, onToggleHabit, onAddHabit }) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [activeTab, setActiveTab] = useState('habits');

  const today = new Date().toLocaleDateString('it-IT', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  const completedToday = habits.filter(habit => habit.today_completed).length;

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="header-content">
          <h1>🌟 Smart Habit Tracker</h1>
          <p className="date">{today}</p>
          <div className="daily-summary">
            <span className="completed">{completedToday}</span>
            <span className="separator">/</span>
            <span className="total">{habits.length}</span>
            <span className="label">abitudini completate oggi</span>
          </div>
        </div>
      </header>

      <nav className="dashboard-tabs">
        <button 
          className={`tab ${activeTab === 'habits' ? 'active' : ''}`}
          onClick={() => setActiveTab('habits')}
        >
          📋 Le Mie Abitudini
        </button>
        <button 
          className={`tab ${activeTab === 'stats' ? 'active' : ''}`}
          onClick={() => setActiveTab('stats')}
        >
          📊 Statistiche
        </button>
      </nav>

      <main className="dashboard-content">
        {activeTab === 'habits' && (
          <div className="habits-section">
            <div className="section-header">
              <h2>Oggi</h2>
              <button 
                className="add-habit-btn"
                onClick={() => setShowAddForm(true)}
              >
                ➕ Nuova Abitudine
              </button>
            </div>

            {showAddForm && (
              <AddHabitForm 
                onSubmit={onAddHabit}
                onCancel={() => setShowAddForm(false)}
              />
            )}

            <div className="habits-grid">
              {habits.length === 0 ? (
                <div className="empty-state">
                  <p>🎯 Non hai ancora creato nessuna abitudine!</p>
                  <p>Inizia aggiungendo la tua prima abitudine quotidiana.</p>
                </div>
              ) : (
                habits.map(habit => (
                  <HabitCard
                    key={habit.id}
                    habit={habit}
                    onToggle={() => onToggleHabit(habit.id)}
                  />
                ))
              )}
            </div>
          </div>
        )}

        {activeTab === 'stats' && (
          <StatsPanel habits={habits} />
        )}
      </main>
    </div>
  );
};

export default Dashboard;
