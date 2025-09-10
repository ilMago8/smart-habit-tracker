import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Dashboard from './pages/Dashboard';
import './styles/App.css';

// Dati mock ottimizzati - TUTTE LE ABITUDINI PARTONO DA 0%
const MOCK_HABITS = [
  {
    id: 1,
    name: "Bere Acqua",
    description: "Bere almeno 8 bicchieri d'acqua al giorno",
    color: "#4a90e2",
    target_frequency: 7,
    week_checks: 0,
    week_completion: 0,
    today_completed: false,
    total_checks: 0
  },
  {
    id: 2,
    name: "Lettura",
    description: "Leggere almeno 10 minuti al giorno",
    color: "#e4b363",
    target_frequency: 7,
    week_checks: 0,
    week_completion: 0,
    today_completed: false,
    total_checks: 0
  },
  {
    id: 3,
    name: "Stretching",
    description: "Fare stretching mattutino",
    color: "#5d9e7f",
    target_frequency: 7,
    week_checks: 0,
    week_completion: 0,
    today_completed: false,
    total_checks: 0
  },
  {
    id: 4,
    name: "Meditazione",
    description: "5 minuti di meditazione quotidiana",
    color: "#9c6adb",
    target_frequency: 5,
    week_checks: 0,
    week_completion: 0,
    today_completed: false,
    total_checks: 0
  }
];

function App() {
  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(true);

  // Memoized fetch function
  const fetchHabits = useCallback(async () => {
    try {
      // Simulazione loading per UX realistica
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setHabits(MOCK_HABITS);
      
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
      setHabits([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Ottimizzato con useCallback per prevenire re-renders
  const toggleHabit = useCallback(async (habitId) => {
    try {
      setHabits(prevHabits => 
        prevHabits.map(habit => {
          if (habit.id !== habitId) return habit;
          
          // Calcola i nuovi valori
          const willBeCompleted = !habit.today_completed;
          const newWeekChecks = willBeCompleted 
            ? habit.week_checks + 1
            : Math.max(0, habit.week_checks - 1);
          
          const newTotalChecks = willBeCompleted
            ? habit.total_checks + 1
            : Math.max(0, habit.total_checks - 1);
          
          // Calcola la percentuale dinamicamente
          const newWeekCompletion = habit.target_frequency > 0 
            ? Math.round((newWeekChecks / habit.target_frequency) * 100)
            : 0;
          
          return {
            ...habit,
            today_completed: willBeCompleted,
            week_checks: newWeekChecks,
            week_completion: Math.min(100, newWeekCompletion), // Cap al 100%
            total_checks: newTotalChecks
          };
        })
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
        fetchHabits();
      }
      */
    } catch (error) {
      console.error('Errore nel toggle abitudine:', error);
    }
  }, []);

  const addHabit = useCallback(async (habitData) => {
    try {
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
        fetchHabits();
      }
      */
    } catch (error) {
      console.error('Errore nella creazione abitudine:', error);
    }
  }, []);

  // Funzione per eliminare un'abitudine
  const deleteHabit = useCallback(async (habitId) => {
    try {
      setHabits(prevHabits => prevHabits.filter(habit => habit.id !== habitId));
      
      // Codice originale per quando il backend sarà attivo:
      /*
      const response = await fetch(`/api/habits/${habitId}`, {
        method: 'DELETE'
      });
      
      const data = await response.json();
      if (data.success) {
        fetchHabits();
      }
      */
    } catch (error) {
      console.error('Errore nell\'eliminazione abitudine:', error);
    }
  }, []);

  // Funzione per resettare tutti i progressi (utile per demo)
  const resetAllProgress = useCallback(() => {
    if (window.confirm('Sei sicuro di voler resettare tutti i progressi? Questa azione non può essere annullata.')) {
      setHabits(prevHabits => 
        prevHabits.map(habit => ({
          ...habit,
          week_checks: 0,
          week_completion: 0,
          today_completed: false,
          total_checks: 0
        }))
      );
    }
  }, []);

  useEffect(() => {
    fetchHabits();
  }, [fetchHabits]);

  // Memoized loading component
  const loadingComponent = useMemo(() => (
    <div className="loading-container">
      <div className="spinner"></div>
      <p>Caricamento abitudini...</p>
    </div>
  ), []);

  if (loading) {
    return loadingComponent;
  }

  return (
    <div className="App">
      <Dashboard 
        habits={habits}
        onToggleHabit={toggleHabit}
        onAddHabit={addHabit}
        onDeleteHabit={deleteHabit}
        onResetProgress={resetAllProgress}
      />
    </div>
  );
}

export default App;
