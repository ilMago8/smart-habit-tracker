import React, { useState, useMemo } from 'react';
import { useAuth } from '../contexts/AuthContext';

const UserProfilePage = ({ habits }) => {
  const { currentUser, logout, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [editForm, setEditForm] = useState({
    name: currentUser?.name || '',
    email: currentUser?.email || '',
    bio: currentUser?.bio || '',
    goals: currentUser?.goals || ''
  });

  // Calcoli delle statistiche utente
  const userStats = useMemo(() => {
    if (!habits || habits.length === 0) {
      return {
        totalHabits: 0,
        completedToday: 0,
        weeklyAverage: 0,
        longestStreak: 0,
        totalCompletions: 0
      };
    }

    const completedToday = habits.filter(h => h.today_completed).length;
    const totalCompletions = habits.reduce((sum, h) => sum + (h.total_checks || 0), 0);
    const weeklyAverage = habits.reduce((sum, h) => sum + (h.week_completion || 0), 0) / habits.length;

    return {
      totalHabits: habits.length,
      completedToday,
      weeklyAverage: Math.round(weeklyAverage),
      longestStreak: Math.max(...habits.map(h => h.current_streak || 0), 0),
      totalCompletions
    };
  }, [habits]);

  const handleEditToggle = async () => {
    if (isEditing) {
      // Salva le modifiche
      setIsLoading(true);
      try {
        const result = await updateProfile(editForm);
        if (result.success) {
          setIsEditing(false);
        } else {
          alert('Errore durante il salvataggio delle modifiche');
        }
      } catch (error) {
        console.error('Errore durante il salvataggio:', error);
        alert('Errore durante il salvataggio delle modifiche');
      } finally {
        setIsLoading(false);
      }
    } else {
      // Inizia l'editing
      setEditForm({
        name: currentUser?.name || '',
        email: currentUser?.email || '',
        bio: currentUser?.bio || '',
        goals: currentUser?.goals || ''
      });
      setIsEditing(true);
    }
  };

  const handleInputChange = (field, value) => {
    setEditForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleLogout = () => {
    if (window.confirm('Sei sicuro di voler effettuare il logout?')) {
      logout();
    }
  };

  const getInitial = () => {
    return currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : 'U';
  };

  const joinDate = useMemo(() => {
    if (currentUser?.createdAt) {
      return new Date(currentUser.createdAt).toLocaleDateString('it-IT', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    }
    return 'Data non disponibile';
  }, [currentUser]);

  return (
    <div className="user-profile-page">
      <div className="profile-header">
        <div className="profile-avatar-large">
          {getInitial()}
        </div>
        <div className="profile-info">
          {isEditing ? (
            <input
              type="text"
              value={editForm.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className="profile-name-edit"
              placeholder="Il tuo nome"
            />
          ) : (
            <h2 className="profile-name">{currentUser?.name}</h2>
          )}
          
          {isEditing ? (
            <input
              type="email"
              value={editForm.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className="profile-email-edit"
              placeholder="La tua email"
            />
          ) : (
            <p className="profile-email">{currentUser?.email}</p>
          )}
          
          <p className="join-date">Membro dal {joinDate}</p>
        </div>
        <div className="profile-actions">
          <button 
            className={`edit-profile-btn ${isEditing ? 'save' : 'edit'}`}
            onClick={handleEditToggle}
            disabled={isLoading}
          >
            {isLoading ? 'Salvando...' : (isEditing ? 'Salva Modifiche' : 'Modifica Profilo')}
          </button>
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>

      <div className="profile-content">
        <div className="profile-section">
          <h3>Statistiche Personali</h3>
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-number">{userStats.totalHabits}</div>
              <div className="stat-label">Abitudini Totali</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{userStats.completedToday}</div>
              <div className="stat-label">Completate Oggi</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{userStats.weeklyAverage}%</div>
              <div className="stat-label">Media Settimanale</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{userStats.totalCompletions}</div>
              <div className="stat-label">Completamenti Totali</div>
            </div>
          </div>
        </div>

        <div className="profile-section">
          <h3>Biografia</h3>
          {isEditing ? (
            <textarea
              value={editForm.bio}
              onChange={(e) => handleInputChange('bio', e.target.value)}
              className="profile-bio-edit"
              placeholder="Raccontaci qualcosa di te..."
              rows="4"
            />
          ) : (
            <p className="profile-bio">
              {currentUser?.bio || 'Nessuna biografia disponibile. Clicca su "Modifica Profilo" per aggiungerne una.'}
            </p>
          )}
        </div>

        <div className="profile-section">
          <h3>I Miei Obiettivi</h3>
          {isEditing ? (
            <textarea
              value={editForm.goals}
              onChange={(e) => handleInputChange('goals', e.target.value)}
              className="profile-goals-edit"
              placeholder="Quali sono i tuoi obiettivi?"
              rows="3"
            />
          ) : (
            <p className="profile-goals">
              {currentUser?.goals || 'Nessun obiettivo definito. Aggiungi i tuoi obiettivi per rimanere motivato!'}
            </p>
          )}
        </div>

        <div className="profile-section">
          <h3>Abitudini Preferite</h3>
          {habits && habits.length > 0 ? (
            <div className="favorite-habits">
              {habits
                .sort((a, b) => (b.week_completion || 0) - (a.week_completion || 0))
                .slice(0, 3)
                .map(habit => (
                  <div key={habit.id} className="favorite-habit">
                    <div 
                      className="habit-color-dot" 
                      style={{ backgroundColor: habit.color }}
                    ></div>
                    <span className="habit-name">{habit.name}</span>
                    <span className="habit-completion">{habit.week_completion || 0}%</span>
                  </div>
                ))}
            </div>
          ) : (
            <p className="no-habits">Nessuna abitudine ancora. Inizia creando la tua prima abitudine!</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfilePage;
