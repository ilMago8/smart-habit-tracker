import React, { useState, useEffect } from 'react';
import Dashboard from './pages/Dashboard';
import './styles/App.css';

function App() {
  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchHabits = async () => {
    try {
      // Dati di esempio per testing senza backend
      const mockData = [
        {
          id: 1,
          name: "Bere Acqua",
          description: "Bere almeno 8 bicchieri d'acqua al giorno",
          color: "#00a8ff",
          icon: "💧",
          target_frequency: 7,
          week_checks: 5,
          week_completion: 71,
          today_completed: false,
          total_checks: 15
        },
        {
          id: 2,
          name: "Lettura",
          description: "Leggere almeno 10 minuti al giorno",
          color: "#fbc531",
          icon: "📚",
          target_frequency: 7,
          week_checks: 6,
          week_completion: 86,
          today_completed: true,
          total_checks: 20
        },
        {
          id: 3,
          name: "Stretching",
          description: "Fare stretching mattutino",
          color: "#44bd32",
          icon: "🤸‍♂️",
          target_frequency: 7,
          week_checks: 4,
          week_completion: 57,
          today_completed: false,
          total_checks: 12
        }
      ];
      
      setHabits(mockData);
      
      // Codice originale per quando il backend sarà attivo:
      /*
      const response = await fetch('/api/habits');
      const data = await response.json();
      if (data.success) {
        setHabits(data.data);
      }
      */
    } catch (error) {
      console.error('Errore nel recupero abitudini:', error);
      // Fallback ai dati di esempio in caso di errore
      setHabits([]);
    } finally {
      setLoading(false);
    }
  };

  const toggleHabit = async (habitId) => {
    try {
      // Simulazione toggle per testing senza backend
      setHabits(prevHabits => 
        prevHabits.map(habit => 
          habit.id === habitId 
            ? { ...habit, today_completed: !habit.today_completed }
            : habit
        )
      );
      
      // Codice originale per quando il backend sarà attivo:
      /*
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
      */
    } catch (error) {
      console.error('Errore nel toggle abitudine:', error);
    }
  };

  const addHabit = async (habitData) => {
    try {
      // Simulazione aggiunta abitudine per testing senza backend
      const newHabit = {
        id: Date.now(), // ID temporaneo
        ...habitData,
        week_checks: 0,
        week_completion: 0,
        today_completed: false,
        total_checks: 0
      };
      
      setHabits(prevHabits => [...prevHabits, newHabit]);
      
      // Codice originale per quando il backend sarà attivo:
      /*
      const response = await fetch('/api/habits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(habitData)
      });
      
      const data = await response.json();
      if (data.success) {
        fetchHabits(); // Ricarica la lista
      }
      */
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
