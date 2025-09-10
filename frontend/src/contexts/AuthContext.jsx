import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';

// Creiamo il contesto di autenticazione
const AuthContext = createContext(null);

// Questa è la funzione di mock che simula il login verso un backend
const mockAuthenticate = async (email, password) => {
  // Simuliamo una chiamata API con un leggero ritardo
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Controllo base della validità dei dati
  if (!email || !password) {
    return { 
      success: false, 
      message: 'Email e password sono richiesti.' 
    };
  }
  
  if (password.length < 6) {
    return { 
      success: false, 
      message: 'La password deve contenere almeno 6 caratteri.' 
    };
  }
  
  // Controllo email formato
  if (!email.includes('@') || !email.includes('.')) {
    return { 
      success: false, 
      message: 'Inserisci un indirizzo email valido.' 
    };
  }
  
  // Simuliamo un database di utenti per il controllo delle credenziali
  const mockUsers = JSON.parse(localStorage.getItem('smartHabitUsers') || '[]');
  
  // Cerchiamo l'utente per email
  const existingUser = mockUsers.find(user => user.email === email);
  
  if (!existingUser) {
    return { 
      success: false, 
      message: 'Nessun account trovato con questa email. Registrati prima.' 
    };
  }
  
  // Controlliamo la password
  if (existingUser.password !== password) {
    return { 
      success: false, 
      message: 'Password errata. Controlla le tue credenziali e riprova.' 
    };
  }
  
  // Login riuscito
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

  // Controllo se c'è un utente salvato al caricamento
  useEffect(() => {
    const checkLoggedIn = () => {
      try {
        const userData = localStorage.getItem('smartHabitUser');
        if (userData) {
          setCurrentUser(JSON.parse(userData));
        }
      } catch (err) {
        console.error('Errore nel recupero dei dati utente:', err);
        // In caso di errore, ripuliamo lo storage
        localStorage.removeItem('smartHabitUser');
      } finally {
        setLoading(false);
      }
    };
    
    checkLoggedIn();
  }, []);

  // Funzione di login
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
      console.error('Errore durante il login:', err);
      const errorMsg = 'Si è verificato un errore durante il login. Riprova più tardi.';
      setError(errorMsg);
      return { success: false, message: errorMsg };
    } finally {
      setLoading(false);
    }
  }, []);

  // Funzione di registrazione (simile al login in questa implementazione demo)
  const register = useCallback(async (name, email, password) => {
    setLoading(true);
    setError(null);
    
    try {
      if (!name || name.length < 2) {
        setError('Il nome deve contenere almeno 2 caratteri');
        return { success: false, message: 'Il nome deve contenere almeno 2 caratteri' };
      }
      
      // Controllo email semplice
      if (!email || !email.includes('@') || !email.includes('.')) {
        setError('Inserisci un indirizzo email valido');
        return { success: false, message: 'Inserisci un indirizzo email valido' };
      }
      
      // Controllo password
      if (!password || password.length < 6) {
        setError('La password deve contenere almeno 6 caratteri');
        return { success: false, message: 'La password deve contenere almeno 6 caratteri' };
      }
      
      // Simuliamo una chiamata API con un leggero ritardo
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Controlliamo se l'utente esiste già
      const mockUsers = JSON.parse(localStorage.getItem('smartHabitUsers') || '[]');
      const existingUser = mockUsers.find(user => user.email === email);
      
      if (existingUser) {
        setError('Un account con questa email esiste già. Prova ad accedere.');
        return { success: false, message: 'Un account con questa email esiste già. Prova ad accedere.' };
      }
      
      // Creiamo un nuovo utente
      const newUser = {
        id: Date.now(),
        name,
        email,
        password, // In un'app reale, questa sarebbe hashata
        bio: '',
        goals: '',
        createdAt: new Date().toISOString()
      };
      
      // Salviamo l'utente nel "database" mock
      mockUsers.push(newUser);
      localStorage.setItem('smartHabitUsers', JSON.stringify(mockUsers));
      
      // Salviamo l'utente corrente (senza password)
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
      console.error('Errore durante la registrazione:', err);
      const errorMsg = 'Si è verificato un errore durante la registrazione. Riprova più tardi.';
      setError(errorMsg);
      return { success: false, message: errorMsg };
    } finally {
      setLoading(false);
    }
  }, []);

  // Funzione per aggiornare il profilo utente
  const updateProfile = useCallback(async (updatedData) => {
    setLoading(true);
    setError(null);
    
    try {
      // Simuliamo una chiamata API per aggiornare il profilo
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
      console.error('Errore durante l\'aggiornamento del profilo:', err);
      const errorMsg = 'Si è verificato un errore durante l\'aggiornamento del profilo.';
      setError(errorMsg);
      return { success: false, message: errorMsg };
    } finally {
      setLoading(false);
    }
  }, [currentUser]);

  // Funzione di logout
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

// Hook personalizzato per usare il contesto di autenticazione
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve essere usato all\'interno di un AuthProvider');
  }
  return context;
};
