// src/components/AuthContext.js

import { createContext, useContext, useState, useEffect } from 'react';

// 1. Create context
const AuthContext = createContext();

// 2. Create provider component
export const AuthProvider = ({ children }) => {
  // ✅ Initialize state from localStorage, so it persists after refresh
  const [token, _setToken] = useState(localStorage.getItem('token'));

  // ✅ Create a new setToken function that updates both state and localStorage
  const setToken = (newToken) => {
    if (newToken) {
      // If a token is provided, store it
      localStorage.setItem('token', newToken);
    } else {
      // If the token is null (logout), remove it from storage
      localStorage.removeItem('token');
    }
    _setToken(newToken); // Update the React state
  };

  // ✅ (Optional but recommended) Listen for storage changes in other tabs
  useEffect(() => {
    const handleStorageChange = () => {
      _setToken(localStorage.getItem('token'));
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);


  return (
    <AuthContext.Provider value={{ token, setToken }}>
      {children}
    </AuthContext.Provider>
  );
};

// 3. Create custom hook to use context
export const useAuth = () => useContext(AuthContext);