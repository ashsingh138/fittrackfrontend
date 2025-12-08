import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();
const API_URL = `${import.meta.env.VITE_API_URL}/users`; // Backend URL

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in by looking for token in localStorage
    const storedUser = localStorage.getItem('fittrack_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  // Register
  // ... inside AuthProvider

  const signup = async (userData) => {
    console.log("1. Sending Signup Data:", userData);

    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });

      // KEY CHANGE: Read text first, then parse JSON
      const responseText = await res.text(); 
      console.log("2. Raw Server Response:", responseText); // <--- CHECK THIS IN CONSOLE

      let data;
      try {
        data = JSON.parse(responseText);
      } catch (err) {
        throw new Error(`Server didn't send JSON! It sent: ${responseText}`);
      }

      if (!res.ok) throw new Error(data.message || "Registration failed");

      // Save user & token
      localStorage.setItem('fittrack_user', JSON.stringify(data));
      setUser(data);
      return { success: true };

    } catch (error) {
      console.error("Signup Logic Error:", error);
      return { success: false, message: error.message };
    }
  };

  // ... keep the rest the same

  // Login
  const login = async (email, password) => {
    try {
      const res = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.message);

      localStorage.setItem('fittrack_user', JSON.stringify(data));
      setUser(data);
      return { success: true };
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  // Logout
  const logout = () => {
    localStorage.removeItem('fittrack_user');
    setUser(null);
  };

  // Update Profile (Syncs with DB)
  const updateUser = async (updatedData) => {
    // Optimistic UI update
    const newUser = { ...user, ...updatedData };
    setUser(newUser);
    localStorage.setItem('fittrack_user', JSON.stringify(newUser));

    // Send to backend
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