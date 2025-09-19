// API service for habit-related operations
const API_BASE_URL = 'http://localhost:8000/api';

class HabitService {
  // Get all habits for a user
  static async getHabits(userId) {
    if (!userId) {
      throw new Error('User ID is required');
    }

    try {
      const response = await fetch(`${API_BASE_URL}/habits/get.php?user_id=${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch habits');
      }

      return data;
    } catch (error) {
      console.error('Error fetching habits:', error);
      throw error;
    }
  }

  // Create a new habit
  static async createHabit(userId, habitData) {
    if (!userId) {
      throw new Error('User ID is required');
    }

    try {
      const response = await fetch(`${API_BASE_URL}/habits/create.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: userId,
          ...habitData
        })
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to create habit');
      }

      return data;
    } catch (error) {
      console.error('Error creating habit:', error);
      throw error;
    }
  }

  // Toggle habit completion
  static async toggleHabit(userId, habitId, date = null) {
    if (!userId || !habitId) {
      throw new Error('User ID and Habit ID are required');
    }

    try {
      const response = await fetch(`${API_BASE_URL}/habits/check.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: userId,
          habit_id: habitId,
          date: date || new Date().toISOString().split('T')[0]
        })
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to toggle habit');
      }

      return data;
    } catch (error) {
      console.error('Error toggling habit:', error);
      throw error;
    }
  }

  // Get habit statistics
  static async getStats(userId) {
    if (!userId) {
      throw new Error('User ID is required');
    }

    try {
      const response = await fetch(`${API_BASE_URL}/habits/stats.php?user_id=${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch stats');
      }

      return data;
    } catch (error) {
      console.error('Error fetching stats:', error);
      throw error;
    }
  }

  // Delete a habit
  static async deleteHabit(userId, habitId) {
    if (!userId) {
      throw new Error('User ID is required');
    }
    
    if (!habitId) {
      throw new Error('Habit ID is required');
    }

    try {
      const response = await fetch(`${API_BASE_URL}/habits/manage.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'delete',
          user_id: userId,
          habit_id: habitId
        })
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete habit');
      }

      return data;
    } catch (error) {
      console.error('Error deleting habit:', error);
      throw error;
    }
  }

  // Reset all progress for a user
  static async resetProgress(userId) {
    if (!userId) {
      throw new Error('User ID is required');
    }

    try {
      const response = await fetch(`${API_BASE_URL}/habits/manage.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'reset',
          user_id: userId
        })
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to reset progress');
      }

      return data;
    } catch (error) {
      console.error('Error resetting progress:', error);
      throw error;
    }
  }
}

export default HabitService;