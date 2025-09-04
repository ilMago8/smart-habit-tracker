import React, { useState, useEffect } from 'react';
import Dashboard from './pages/Dashboard';
import './styles/App.css';

function App() {
  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchHabits = async () => {
    try {
      const response = await fetch('/api/habits');
      const data = await response.json();
      if (data.success) {
        setHabits(data.data);
      }
    } catch (error) {
      console.error('Errore nel recupero abitudini:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleHabit = async (habitId) => {
    try {
      const response = await fetch('/api/habits/check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ habit_id: habitId })
      });
      
      const data = await response.json();
      if (data.success) {
        // Ricarica le abitudini per aggiornare le statistiche
        fetchHabits();
      }
    } catch (error) {
      console.error('Errore nel toggle abitudine:', error);
    }
  };

  const addHabit = async (habitData) => {
    try {
      const response = await fetch('/api/habits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(habitData)
      });
      
      const data = await response.json();
      if (data.success) {
        fetchHabits(); // Ricarica la lista
      }
    } catch (error) {
      console.error('Errore nella creazione abitudine:', error);
    }
  };

  useEffect(() => {
    fetchHabits();
  }, []);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Caricamento abitudini...</p>
      </div>
    );
  }

  return (
    <div className="App">
      <Dashboard 
        habits={habits}
        onToggleHabit={toggleHabit}
        onAddHabit={addHabit}
      />
    </div>
  );
}

export default App;
