import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Dashboard from './pages/Dashboard';
import AuthPage from './pages/AuthPage';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import './styles/App.css';
import './styles/Auth.css';
import './styles/UserProfile.css';

// Optimized mock data - starter habits
const INITIAL_HABITS = [
  {
    id: 1,
    name: "Drink Water",
    description: "Drink at least 8 glasses of water per day",
    color: "#4a90e2",
    target_frequency: 7,
    week_checks: 0,
    week_completion: 0,
    today_completed: false,
    total_checks: 0
  },
  {
    id: 2,
    name: "Reading",
    description: "Read for at least 10 minutes a day",
    color: "#e4b363",
    target_frequency: 7,
    week_checks: 0,
    week_completion: 0,
    today_completed: false,
    total_checks: 0
  },
  {
    id: 3,
    name: "Exercise",
    description: "Daily physical activity",
    color: "#5d9e7f",
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
      // Simulation loading for realistic UX
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setHabits(INITIAL_HABITS);
      
      // Original code for when backend is active:
      /*
      const response = await fetch('/api/habits');
      const data = await response.json();
      if (data.success) {
        setHabits(data.data);
      }
      */
    } catch (error) {
      console.error('Error fetching habits:', error);
      setHabits([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Optimized with useCallback to prevent re-renders
  const toggleHabit = useCallback(async (habitId) => {
    try {
      setHabits(prevHabits => 
        prevHabits.map(habit => {
          if (habit.id !== habitId) return habit;
          
          // Calculate new values
          const willBeCompleted = !habit.today_completed;
          const newWeekChecks = willBeCompleted 
            ? habit.week_checks + 1
            : Math.max(0, habit.week_checks - 1);
          
          const newTotalChecks = willBeCompleted
            ? habit.total_checks + 1
            : Math.max(0, habit.total_checks - 1);
          
          // Calculate percentage dynamically
          const newWeekCompletion = habit.target_frequency > 0 
            ? Math.round((newWeekChecks / habit.target_frequency) * 100)
            : 0;
          
          return {
            ...habit,
            today_completed: willBeCompleted,
            week_checks: newWeekChecks,
            week_completion: Math.min(100, newWeekCompletion), // Cap at 100%
            total_checks: newTotalChecks
          };
        })
      );
      
      // Original code for when backend is active:
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
      console.error('Error toggling habit:', error);
    }
  }, []);

  const addHabit = useCallback(async (habitData) => {
    try {
      const newHabit = {
        id: Date.now(), // Temporary ID
        ...habitData,
        week_checks: 0,
        week_completion: 0,
        today_completed: false,
        total_checks: 0
      };
      
      setHabits(prevHabits => [...prevHabits, newHabit]);
      
      // Original code for when backend is active:
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
      console.error('Error creating habit:', error);
    }
  }, []);

  // Function to delete a habit
  const deleteHabit = useCallback(async (habitId) => {
    try {
      setHabits(prevHabits => prevHabits.filter(habit => habit.id !== habitId));
      
      // Original code for when backend is active:
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
      console.error('Error deleting habit:', error);
    }
  }, []);

  // Function to reset all progress (useful for demo)
  const resetAllProgress = useCallback(() => {
    if (window.confirm('Are you sure you want to reset all progress? This action cannot be undone.')) {
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
      <p>Loading habits...</p>
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

// Main App wrapper with authentication provider
function AppWithAuth() {
  return (
    <AuthProvider>
      <AuthenticatedApp />
    </AuthProvider>
  );
}

// Component that handles authentication
function AuthenticatedApp() {
  const { currentUser, loading } = useAuth();
  
  // Show loader while checking if user is already logged in
  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }
  
  // If no user is logged in, show authentication page
  if (!currentUser) {
    return <AuthPage />;
  }
  
  // If user is logged in, show main app
  return <App />;
}

export default AppWithAuth;
