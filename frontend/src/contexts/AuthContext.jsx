import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';

// Create authentication context
const AuthContext = createContext(null);

// API base URL - adjust this based on your backend setup
// In production, Vercel redirects /api/* to the public server
const API_BASE_URL = '/api';

// Function to authenticate user via backend API
const authenticate = async (email, password) => {
  try {
    console.log('Attempting to authenticate user with URL:', `${API_BASE_URL}/auth/login.php`);
    const response = await fetch(`${API_BASE_URL}/auth/login.php`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password })
    });
    
    const result = await response.json();
    
    if (response.ok && result.success) {
      return {
        success: true,
        user: result.user,
        token: result.token
      };
    } else {
      return {
        success: false,
        message: result.error || 'Login failed'
      };
    }
  } catch (error) {
    console.error('Login error:', error);
    // Check if it's a network error
    if (error instanceof TypeError && error.message.includes('fetch')) {
      return {
        success: false,
        message: 'Cannot connect to server. Please make sure the backend is running on http://localhost:8000'
      };
    }
    return {
      success: false,
      message: 'Network error. Please check your connection.'
    };
  }
};

// Function to register user via backend API
const registerUser = async (name, email, password, bio = '', goals = '') => {
  try {
    console.log('Attempting to register user with URL:', `${API_BASE_URL}/auth/register.php`);
    const response = await fetch(`${API_BASE_URL}/auth/register.php`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email, password, bio, goals })
    });
    
    const result = await response.json();
    
    if (response.ok && result.success) {
      return {
        success: true,
        user: result.user
      };
    } else {
      return {
        success: false,
        message: result.error || 'Registration failed'
      };
    }
  } catch (error) {
    console.error('Registration error:', error);
    // Check if it's a network error
    if (error instanceof TypeError && error.message.includes('fetch')) {
      return {
        success: false,
        message: 'Cannot connect to server. Please make sure the backend is running on http://localhost:8000'
      };
    }
    return {
      success: false,
      message: 'Network error. Please check your connection.'
    };
  }
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if there's a saved user on load
  useEffect(() => {
    const checkLoggedIn = () => {
      try {
        const userData = localStorage.getItem('smartHabitUser');
        const userToken = localStorage.getItem('smartHabitToken');
        if (userData && userToken) {
          setCurrentUser(JSON.parse(userData));
        }
      } catch (err) {
        console.error('Error retrieving user data:', err);
        // Clean storage in case of error
        localStorage.removeItem('smartHabitUser');
        localStorage.removeItem('smartHabitToken');
      } finally {
        setLoading(false);
      }
    };
    
    checkLoggedIn();
  }, []);

  // Login function
  const login = useCallback(async (email, password) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await authenticate(email, password);
      
      if (result.success) {
        setCurrentUser(result.user);
        localStorage.setItem('smartHabitUser', JSON.stringify(result.user));
        localStorage.setItem('smartHabitToken', result.token);
        return { success: true };
      } else {
        setError(result.message);
        return { success: false, message: result.message };
      }
    } catch (err) {
      console.error('Error during login:', err);
      const errorMsg = 'An error occurred during login. Please try again later.';
      setError(errorMsg);
      return { success: false, message: errorMsg };
    } finally {
      setLoading(false);
    }
  }, []);

  // Registration function
  const register = useCallback(async (name, email, password) => {
    setLoading(true);
    setError(null);
    
    try {
      // Basic validation (additional to backend validation)
      if (!name || name.length < 2) {
        setError('Name must contain at least 2 characters');
        return { success: false, message: 'Name must contain at least 2 characters' };
      }
      
      if (!email || !email.includes('@') || !email.includes('.')) {
        setError('Please enter a valid email address');
        return { success: false, message: 'Please enter a valid email address' };
      }
      
      if (!password || password.length < 6) {
        setError('Password must contain at least 6 characters');
        return { success: false, message: 'Password must contain at least 6 characters' };
      }
      
      const result = await registerUser(name, email, password);
      
      if (result.success) {
        setCurrentUser(result.user);
        localStorage.setItem('smartHabitUser', JSON.stringify(result.user));
        // Note: For registration, we'll need to auto-login or redirect to login
        return { success: true };
      } else {
        setError(result.message);
        return { success: false, message: result.message };
      }
      
    } catch (err) {
      console.error('Error during registration:', err);
      const errorMsg = 'An error occurred during registration. Please try again later.';
      setError(errorMsg);
      return { success: false, message: errorMsg };
    } finally {
      setLoading(false);
    }
  }, []);

  // Function to update user profile
  const updateProfile = useCallback(async (updatedData) => {
    // Do not flip global loading when updating profile to avoid remounts
    setError(null);
    try {
      if (!currentUser) {
        throw new Error('No user logged in');
      }
      
      const response = await fetch(`${API_BASE_URL}/auth/profile.php`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: currentUser.id,
          ...updatedData
        })
      });
      
      const result = await response.json();
      
      if (response.ok && result.success) {
        setCurrentUser(result.user);
        localStorage.setItem('smartHabitUser', JSON.stringify(result.user));
        return { success: true };
      } else {
        setError(result.error || 'Profile update failed');
        return { success: false, message: result.error || 'Profile update failed' };
      }
    } catch (err) {
      console.error('Error updating profile:', err);
      const errorMsg = 'An error occurred while updating the profile.';
      setError(errorMsg);
      return { success: false, message: errorMsg };
    }
  }, [currentUser]);

  // Logout function
  const logout = useCallback(() => {
    setCurrentUser(null);
    localStorage.removeItem('smartHabitUser');
    localStorage.removeItem('smartHabitToken');
  }, []);

  const value = {
    currentUser,
    loading,
    error,
    login,
    register,
    logout,
    updateProfile
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use authentication context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
