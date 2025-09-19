import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Dashboard from './pages/Dashboard';
import AuthPage from './pages/AuthPage';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import HabitService from './services/habitService';
import './styles/App.css';
import './styles/Auth.css';
import './styles/UserProfile.css';

function App() {
  const { currentUser } = useAuth();
  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(true);

  // Memoized fetch function
  const fetchHabits = useCallback(async () => {
    if (!currentUser) {
      setHabits([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const data = await HabitService.getHabits(currentUser.id);
      
      if (data.success) {
        setHabits(data.data);
      } else {
        console.error('Failed to fetch habits:', data.error);
        setHabits([]);
      }
    } catch (error) {
      console.error('Error fetching habits:', error);
      setHabits([]);
    } finally {
      setLoading(false);
    }
  }, [currentUser]);

  // Optimized with useCallback to prevent re-renders
  const toggleHabit = useCallback(async (habitId) => {
    if (!currentUser) return;

    try {
      // Optimistically update the UI
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
            week_completion: Math.min(100, newWeekCompletion),
            total_checks: newTotalChecks
          };
        })
      );

      // Call the API
      await HabitService.toggleHabit(currentUser.id, habitId);
      
      // Optionally refresh habits from server
      // fetchHabits();
      
    } catch (error) {
      console.error('Error toggling habit:', error);
      // Revert optimistic update on error
      fetchHabits();
    }
  }, [currentUser, fetchHabits]);

  const addHabit = useCallback(async (habitData) => {
    if (!currentUser) return;

    try {
      const data = await HabitService.createHabit(currentUser.id, habitData);
      
      if (data.success) {
        // Add the new habit to the state
        setHabits(prevHabits => [...prevHabits, {
          ...data.data,
          week_checks: 0,
          week_completion: 0,
          today_completed: false,
          total_checks: 0
        }]);
      } else {
        console.error('Failed to create habit:', data.error);
      }
    } catch (error) {
      console.error('Error creating habit:', error);
    }
  }, [currentUser]);

  // Function to delete a habit
  const deleteHabit = useCallback(async (habitId) => {
    if (!currentUser) return;
    
    try {
      await HabitService.deleteHabit(currentUser.id, habitId);
      
      // Update local state
      setHabits(prevHabits => prevHabits.filter(habit => habit.id !== habitId));
      
    } catch (error) {
      console.error('Error deleting habit:', error);
      // Revert the local state change by refetching
      fetchHabits();
    }
  }, [currentUser, fetchHabits]);

  // Function to reset all progress (useful for demo)
  const resetAllProgress = useCallback(async () => {
    if (!currentUser) return;
    
    if (window.confirm('Are you sure you want to reset all progress? This action cannot be undone.')) {
      try {
        await HabitService.resetProgress(currentUser.id);
        
        // Refresh habits to show updated progress
        await fetchHabits();
        
      } catch (error) {
        console.error('Error resetting progress:', error);
        alert('Failed to reset progress. Please try again.');
      }
    }
  }, [currentUser, fetchHabits]);

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
  
  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }
  
  return currentUser ? <App /> : <AuthPage />;
}

export default AppWithAuth;
