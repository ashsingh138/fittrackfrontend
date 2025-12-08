import React, { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [isDark, setIsDark] = useState(() => {
    // 1. Get the value from local storage
    const saved = localStorage.getItem('theme');
    
    // 2. If nothing is saved, default to Dark Mode (true)
    if (saved === null) return true;

    // 3. Try to parse it. If it fails (like the "light" error), catch it and default to true.
    try {
      return JSON.parse(saved);
    } catch (error) {
      console.warn("Theme storage was corrupted, resetting to Dark Mode.");
      return true; // Default back to Dark Mode if error occurs
    }
  });

  useEffect(() => {
    // Save as a boolean (true/false) which is valid JSON
    localStorage.setItem('theme', JSON.stringify(isDark));
    
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme: () => setIsDark(!isDark) }}>
      <div className={isDark ? 'dark' : ''}>
        <div className="min-h-screen bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-gray-100 transition-colors duration-200">
          {children}
        </div>
      </div>
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);