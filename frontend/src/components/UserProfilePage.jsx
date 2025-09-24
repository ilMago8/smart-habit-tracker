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

  // User statistics calculations
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
      // Save changes (exclude email to prevent modification)
      setIsLoading(true);
      try {
        // Create a copy of editForm object without the email property
        const { email, ...dataToUpdate } = editForm;
        const result = await updateProfile(dataToUpdate);
        if (result.success) {
          setIsEditing(false);
        } else {
          alert('Error saving changes');
        }
      } catch (error) {
        console.error('Error saving:', error);
        alert('Error saving changes');
      } finally {
        setIsLoading(false);
      }
    } else {
      // Start editing
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
    if (window.confirm('Are you sure you want to logout?')) {
      logout();
    }
  };

  const getInitial = () => {
    return currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : 'U';
  };

  const joinDate = useMemo(() => {
    // Check for both camelCase (createdAt) and snake_case (created_at) formats
    const dateField = currentUser?.createdAt || currentUser?.created_at;
    if (dateField) {
      return new Date(dateField).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    }
    return 'Data not available';
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
              placeholder="Your name"
            />
          ) : (
            <h2 className="profile-name">{currentUser?.name}</h2>
          )}
          
          {/* Email is not editable */}
          <p className="profile-email">{currentUser?.email}</p>
          
          <p className="join-date">Member since {joinDate}</p>
        </div>
        <div className="profile-actions">
          <button 
            className={`edit-profile-btn ${isEditing ? 'save' : 'edit'}`}
            onClick={handleEditToggle}
            disabled={isLoading}
          >
            {isLoading ? 'Saving...' : (isEditing ? 'Save Changes' : 'Edit Profile')}
          </button>
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>

      <div className="profile-content">
        <div className="profile-section">
          <h3>Personal Statistics</h3>
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-number">{userStats.totalHabits}</div>
              <div className="stat-label">Total Habits</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{userStats.completedToday}</div>
              <div className="stat-label">Completed Today</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{userStats.weeklyAverage}%</div>
              <div className="stat-label">Weekly Average</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{userStats.totalCompletions}</div>
              <div className="stat-label">Total Completions</div>
            </div>
          </div>
        </div>

        <div className="profile-section">
          <h3>Biography</h3>
          {isEditing ? (
            <textarea
              value={editForm.bio}
              onChange={(e) => handleInputChange('bio', e.target.value)}
              className="profile-bio-edit"
              placeholder="Tell us something about yourself..."
              rows="4"
            />
          ) : (
            <p className="profile-bio">
              {currentUser?.bio || 'No biography available. Click "Edit Profile" to add one.'}
            </p>
          )}
        </div>

        <div className="profile-section">
          <h3>My Goals</h3>
          {isEditing ? (
            <textarea
              value={editForm.goals}
              onChange={(e) => handleInputChange('goals', e.target.value)}
              className="profile-goals-edit"
              placeholder="What are your goals?"
              rows="3"
            />
          ) : (
            <p className="profile-goals">
              {currentUser?.goals || 'No goals defined. Add your goals to stay motivated!'}
            </p>
          )}
        </div>

        <div className="profile-section">
          <h3>Favorite Habits</h3>
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
            <p className="no-habits">No habits yet. Start by creating your first habit!</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfilePage;
