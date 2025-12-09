import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();
const API_URL = `${import.meta.env.VITE_API_URL}/users`; 

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('fittrack_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  // Helper to handle API Responses
  const handleResponse = async (response) => {
    const text = await response.text();
    let data;
    try {
      data = JSON.parse(text); 
    } catch (err) {
      // If server returns text/html instead of JSON (like 500 error)
      throw new Error(text || "Server Error");
    }
    
    if (!response.ok) {
      // Throw the specific message from backend (e.g., "User already exists")
      throw new Error(data.message || "Something went wrong");
    }
    return data;
  };

  // Register
  const signup = async (userData) => {
    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });

      const data = await handleResponse(res);

      localStorage.setItem('fittrack_user', JSON.stringify(data));
      setUser(data);
      return { success: true };

    } catch (error) {
      console.error("Signup Error:", error.message);
      // Return the specific error message to be displayed in UI
      return { success: false, message: error.message };
    }
  };

  // Login
  const login = async (email, password) => {
    try {
      const res = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await handleResponse(res);

      localStorage.setItem('fittrack_user', JSON.stringify(data));
      setUser(data);
      return { success: true };
    } catch (error) {
      console.error("Login Error:", error.message);
      // Return the specific error message to be displayed in UI
      return { success: false, message: error.message };
    }
  };

  const logout = () => {
    localStorage.removeItem('fittrack_user');
    setUser(null);
  };

  const updateUser = async (updatedData) => {
    const newUser = { ...user, ...updatedData };
    setUser(newUser);
    localStorage.setItem('fittrack_user', JSON.stringify(newUser));

    try {
      await fetch(`${API_URL}/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify(updatedData)
      });
    } catch (error) {
      console.error("Failed to update profile", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, updateUser, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);