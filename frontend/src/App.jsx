import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Dashboard from './pages/Dashboard';
import AuthPage from './pages/AuthPage';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ToastProvider, useToast } from './contexts/ToastContext';
import HabitService from './services/habitService';
import './styles/App.css';
import './styles/Auth.css';
import './styles/UserProfile.css';
import ConfirmDialog from './components/ConfirmDialog';

function App() {
  const { currentUser, logout } = useAuth();
  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [resetting, setResetting] = useState(false);
  const [deletingAll, setDeletingAll] = useState(false);
  const [deletingOne, setDeletingOne] = useState(false);
  const [confirm, setConfirm] = useState({ open: false, type: null });
  const [pendingHabit, setPendingHabit] = useState(null); // for single delete
  const { addToast } = useToast();

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
        addToast('Attività creata', { type: 'success' });
      } else {
        console.error('Failed to create habit:', data.error);
        addToast('Creazione attività fallita', { type: 'error' });
      }
    } catch (error) {
      console.error('Error creating habit:', error);
      addToast('Errore durante la creazione', { type: 'error' });
    }
  }, [currentUser]);

  // Function to update a habit
  const updateHabit = useCallback(async (habitId, habitData) => {
    if (!currentUser) return;
    
    try {
      const data = await HabitService.updateHabit(currentUser.id, habitId, habitData);
      
      if (data.success && data.habit) {
        // Update local state with the updated habit
        setHabits(prevHabits => 
          prevHabits.map(habit => 
            habit.id === habitId ? { ...habit, ...data.habit } : habit
          )
        );
        addToast('Attività aggiornata', { type: 'success' });
      } else {
        console.error('Failed to update habit:', data.error);
        addToast('Aggiornamento attività fallito', { type: 'error' });
        throw new Error(data.error || 'Failed to update habit');
      }
    } catch (error) {
      console.error('Error updating habit:', error);
      addToast('Errore durante l\'aggiornamento', { type: 'error' });
      throw error;
    }
  }, [currentUser, addToast]);

  // Function to delete a habit
  const doDeleteHabit = useCallback(async () => {
    if (!currentUser || !pendingHabit) return;
    try {
      setDeletingOne(true);
      await HabitService.deleteHabit(currentUser.id, pendingHabit.id);
      setHabits(prev => prev.filter(h => h.id !== pendingHabit.id));
      addToast(`Attività "${pendingHabit.name ?? ''}" eliminata`, { type: 'success' });
    } catch (error) {
      console.error('Error deleting habit:', error);
      addToast('Impossibile eliminare l\'attività. Riprova.', { type: 'error' });
      fetchHabits();
    } finally {
      setDeletingOne(false);
      setPendingHabit(null);
      setConfirm({ open: false, type: null });
    }
  }, [currentUser, pendingHabit, fetchHabits, addToast]);

  // Open confirm for single delete
  const deleteHabit = useCallback((habitId) => {
    const habit = habits.find(h => h.id === habitId);
    setPendingHabit(habit ? { id: habit.id, name: habit.name } : { id: habitId });
    setConfirm({ open: true, type: 'delete' });
  }, [habits]);

  // Function to reset all progress (useful for demo)
  const doResetAllProgress = useCallback(async () => {
    if (!currentUser) return;
    try {
      setResetting(true);
      setHabits(prev => prev.map(h => ({
        ...h,
        today_completed: false,
        week_checks: 0,
        week_completion: 0
      })));
      await HabitService.resetProgress(currentUser.id);
      await fetchHabits();
      addToast('Progresso azzerato con successo', { type: 'success' });
    } catch (error) {
      console.error('Error resetting progress:', error);
      addToast('Errore durante il reset del progresso', { type: 'error' });
      fetchHabits();
    } finally {
      setResetting(false);
      setConfirm({ open: false, type: null });
    }
  }, [currentUser, fetchHabits, addToast]);

  const resetAllProgress = useCallback(() => {
    setConfirm({ open: true, type: 'reset' });
  }, []);

  // Function to delete all habits
  const doDeleteAllHabits = useCallback(async () => {
    if (!currentUser) return;
    try {
      setDeletingAll(true);
      setHabits([]);
      await HabitService.deleteAllHabits(currentUser.id);
      await fetchHabits();
      addToast('Tutte le attività sono state eliminate', { type: 'success' });
    } catch (error) {
      console.error('Error deleting all habits:', error);
      addToast('Eliminazione fallita. Riprova.', { type: 'error' });
      fetchHabits();
    } finally {
      setDeletingAll(false);
      setConfirm({ open: false, type: null });
    }
  }, [currentUser, fetchHabits, addToast]);

  const deleteAllHabits = useCallback(() => {
    setConfirm({ open: true, type: 'deleteAll' });
  }, []);

  // Logout confirmation and action
  const doLogout = useCallback(() => {
    logout();
    addToast('Logout effettuato', { type: 'success' });
    setConfirm({ open: false, type: null });
  }, [logout, addToast]);

  const requestLogout = useCallback(() => {
    setConfirm({ open: true, type: 'logout' });
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
        onUpdateHabit={updateHabit}
        onDeleteHabit={deleteHabit}
        onResetProgress={resetAllProgress}
        onDeleteAllHabits={deleteAllHabits}
        onLogout={requestLogout}
        isResetting={resetting}
        isDeletingAll={deletingAll}
      />
      <ConfirmDialog
        open={confirm.open}
        title={
          confirm.type === 'reset' ? 'Azzera progressi' :
          confirm.type === 'deleteAll' ? 'Elimina tutte le attività' :
          confirm.type === 'delete' ? 'Elimina attività' :
          'Conferma logout'
        }
        message={
          confirm.type === 'reset'
            ? 'Sei sicuro di voler azzerare i progressi di tutte le abitudini? Questa azione non elimina le abitudini ed è irreversibile.'
            : confirm.type === 'deleteAll'
              ? 'Sei sicuro di eliminare TUTTE le attività? L\'azione è irreversibile.'
              : confirm.type === 'delete'
                ? `Eliminare definitivamente l\'attività \"${pendingHabit?.name ?? ''}\"?`
                : 'Vuoi effettuare il logout?'
        }
        confirmLabel={
          confirm.type === 'reset' ? 'Azzera' :
          confirm.type === 'deleteAll' ? 'Elimina tutte' :
          confirm.type === 'delete' ? 'Elimina' :
          'Esci'
        }
        cancelLabel="Cancel"
        onConfirm={
          confirm.type === 'reset' ? doResetAllProgress :
          confirm.type === 'deleteAll' ? doDeleteAllHabits :
          confirm.type === 'delete' ? doDeleteHabit :
          doLogout
        }
        onCancel={() => setConfirm({ open: false, type: null })}
        loading={confirm.type === 'reset' ? resetting : confirm.type === 'deleteAll' ? deletingAll : confirm.type === 'delete' ? deletingOne : false}
      />
    </div>
  );
}

// Main App wrapper with authentication provider
function AppWithAuth() {
  return (
    <ToastProvider>
      <AuthProvider>
        <AuthenticatedApp />
      </AuthProvider>
    </ToastProvider>
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
