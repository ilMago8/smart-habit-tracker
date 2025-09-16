import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';

// Create authentication context
const AuthContext = createContext(null);

// Mock function that simulates backend login
const mockAuthenticate = async (email, password) => {
  // Simulate API call with slight delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Basic data validation
  if (!email || !password) {
    return { 
      success: false, 
      message: 'Email and password are required.' 
    };
  }
  
  if (password.length < 6) {
    return { 
      success: false, 
      message: 'Password must contain at least 6 characters.' 
    };
  }
  
  // Email format validation
  if (!email.includes('@') || !email.includes('.')) {
    return { 
      success: false, 
      message: 'Please enter a valid email address.' 
    };
  }
  
  // Simulate user database for credential checking
  const mockUsers = JSON.parse(localStorage.getItem('smartHabitUsers') || '[]');
  
  // Search for user by email
  const existingUser = mockUsers.find(user => user.email === email);
  
  if (!existingUser) {
    return { 
      success: false, 
      message: 'No account found with this email. Please register first.' 
    };
  }
  
  // Check password
  if (existingUser.password !== password) {
    return { 
      success: false, 
      message: 'Incorrect password. Check your credentials and try again.' 
    };
  }
  
  // Login successful
  return { 
    success: true, 
    user: {
      id: existingUser.id,
      name: existingUser.name,
      email: existingUser.email,
      bio: existingUser.bio || '',
      goals: existingUser.goals || '',
      createdAt: existingUser.createdAt
    },
    token: 'mock-jwt-token-' + Math.random().toString(36).substring(2)
  };
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
        if (userData) {
          setCurrentUser(JSON.parse(userData));
        }
      } catch (err) {
        console.error('Error retrieving user data:', err);
        // Clean storage in case of error
        localStorage.removeItem('smartHabitUser');
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
      const result = await mockAuthenticate(email, password);
      
      if (result.success) {
        setCurrentUser(result.user);
        localStorage.setItem('smartHabitUser', JSON.stringify(result.user));
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

  // Registration function (similar to login in this demo implementation)
  const register = useCallback(async (name, email, password) => {
    setLoading(true);
    setError(null);
    
    try {
      if (!name || name.length < 2) {
        setError('Name must contain at least 2 characters');
        return { success: false, message: 'Name must contain at least 2 characters' };
      }
      
      // Simple email validation
      if (!email || !email.includes('@') || !email.includes('.')) {
        setError('Please enter a valid email address');
        return { success: false, message: 'Please enter a valid email address' };
      }
      
      // Password validation
      if (!password || password.length < 6) {
        setError('Password must contain at least 6 characters');
        return { success: false, message: 'Password must contain at least 6 characters' };
      }
      
      // Simulate API call with slight delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Check if user already exists
      const mockUsers = JSON.parse(localStorage.getItem('smartHabitUsers') || '[]');
      const existingUser = mockUsers.find(user => user.email === email);
      
      if (existingUser) {
        setError('An account with this email already exists. Try logging in.');
        return { success: false, message: 'An account with this email already exists. Try logging in.' };
      }
      
      // Create new user
      const newUser = {
        id: Date.now(),
        name,
        email,
        password, // In a real app, this would be hashed
        bio: '',
        goals: '',
        createdAt: new Date().toISOString()
      };
      
      // Save user to mock "database"
      mockUsers.push(newUser);
      localStorage.setItem('smartHabitUsers', JSON.stringify(mockUsers));
      
      // Save current user (without password)
      const userForState = {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        bio: newUser.bio,
        goals: newUser.goals,
        createdAt: newUser.createdAt
      };
      
      setCurrentUser(userForState);
      localStorage.setItem('smartHabitUser', JSON.stringify(userForState));
      return { success: true };
      
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
    setLoading(true);
    setError(null);
    
    try {
      // Simulate API call to update profile
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const updatedUser = {
        ...currentUser,
        ...updatedData,
        updatedAt: new Date().toISOString()
      };
      
      setCurrentUser(updatedUser);
      localStorage.setItem('smartHabitUser', JSON.stringify(updatedUser));
      
      return { success: true };
      
    } catch (err) {
      console.error('Error updating profile:', err);
      const errorMsg = 'An error occurred while updating the profile.';
      setError(errorMsg);
      return { success: false, message: errorMsg };
    } finally {
      setLoading(false);
    }
  }, [currentUser]);

  // Logout function
  const logout = useCallback(() => {
    setCurrentUser(null);
    localStorage.removeItem('smartHabitUser');
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
