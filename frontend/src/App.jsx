import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Dashboard from './pages/Dashboard';
import './styles/App.css';

// Dati mock ottimizzati - Iniziano tutti a 0
const MOCK_HABITS = [
  {
    id: 1,
    name: "Bere Acqua",
    description: "Bere almeno 8 bicchieri d'acqua al giorno",
    color: "#00a8ff",
    icon: "💧",
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
    color: "#fbc531",
    icon: "📚",
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
    color: "#44bd32",
    icon: "🤸‍♂️",
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
    color: "#9c88ff",
    icon: "🧘‍♀️",
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

  // Funzione per salvare le abitudini nel localStorage
  const saveHabitsToStorage = useCallback((habitsData) => {
    try {
      localStorage.setItem('smart-habit-tracker-habits', JSON.stringify(habitsData));
    } catch (error) {
      console.warn('Impossibile salvare nel localStorage:', error);
    }
  }, []);

  // Funzione per caricare le abitudini dal localStorage
  const loadHabitsFromStorage = useCallback(() => {
    try {
      const stored = localStorage.getItem('smart-habit-tracker-habits');
      return stored ? JSON.parse(stored) : null;
    } catch (error) {
      console.warn('Impossibile leggere dal localStorage:', error);
      return null;
    }
  }, []);

  // Memoized fetch function
  const fetchHabits = useCallback(async () => {
    try {
      // Simulazione loading per UX realistica
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Prova a caricare dal localStorage prima dei mock data
      const storedHabits = loadHabitsFromStorage();
      if (storedHabits && storedHabits.length > 0) {
        setHabits(storedHabits);
      } else {
        // Usa i dati mock solo se non ci sono dati salvati
        setHabits(MOCK_HABITS);
        saveHabitsToStorage(MOCK_HABITS);
      }
      
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
  }, [loadHabitsFromStorage, saveHabitsToStorage]);

  // Ottimizzato con useCallback per prevenire re-renders
  const toggleHabit = useCallback(async (habitId) => {
    try {
      const updatedHabits = habits.map(habit => {
        if (habit.id !== habitId) return habit;
        
        // Calcola i nuovi valori
        const wasCompleted = habit.today_completed;
        const newTodayCompleted = !wasCompleted;
        
        // Aggiorna week_checks
        const newWeekChecks = wasCompleted 
          ? Math.max(0, habit.week_checks - 1)
          : Math.min(habit.target_frequency, habit.week_checks + 1);
        
        // Calcola la nuova percentuale
        const newWeekCompletion = habit.target_frequency > 0 
          ? Math.round((newWeekChecks / habit.target_frequency) * 100)
          : 0;
        
        // Aggiorna total_checks
        const newTotalChecks = wasCompleted 
          ? Math.max(0, habit.total_checks - 1)
          : habit.total_checks + 1;
        
        return {
          ...habit,
          today_completed: newTodayCompleted,
          week_checks: newWeekChecks,
          week_completion: newWeekCompletion,
          total_checks: newTotalChecks
        };
      });
      
      // Aggiorna lo stato e salva nel localStorage
      setHabits(updatedHabits);
      saveHabitsToStorage(updatedHabits);
      
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
  }, [habits, saveHabitsToStorage]);

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
      
      const updatedHabits = [...habits, newHabit];
      setHabits(updatedHabits);
      saveHabitsToStorage(updatedHabits);
      
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
  }, [habits, saveHabitsToStorage]);

  // Funzione per resettare tutte le abitudini
  const resetHabits = useCallback(() => {
    const resetHabitsData = habits.map(habit => ({
      ...habit,
      week_checks: 0,
      week_completion: 0,
      today_completed: false,
      total_checks: 0
    }));
    
    setHabits(resetHabitsData);
    saveHabitsToStorage(resetHabitsData);
  }, [habits, saveHabitsToStorage]);

  // Funzione per eliminare tutte le abitudini e ricaricare i mock
  const resetToDefaults = useCallback(() => {
    setHabits(MOCK_HABITS);
    saveHabitsToStorage(MOCK_HABITS);
  }, [saveHabitsToStorage]);

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
        onResetHabits={resetHabits}
        onResetToDefaults={resetToDefaults}
      />
    </div>
  );
}

export default App;
