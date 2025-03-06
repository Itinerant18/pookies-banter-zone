
import { useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import { updateUserSettings } from '@/lib/firebase/profile';

export const useDarkMode = (user: User | null, initialDarkMode: boolean = false) => {
  const [darkMode, setDarkMode] = useState<boolean>(initialDarkMode);
  
  // Apply dark mode class to html element
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    // Save to localStorage for persistence
    localStorage.setItem('darkModeEnabled', JSON.stringify(darkMode));
  }, [darkMode]);
  
  // Load initial state from localStorage
  useEffect(() => {
    const savedDarkMode = localStorage.getItem('darkModeEnabled');
    if (savedDarkMode !== null) {
      setDarkMode(JSON.parse(savedDarkMode));
    }
  }, []);
  
  // Toggle dark mode with optional backend sync
  const toggleDarkMode = async () => {
    const newValue = !darkMode;
    setDarkMode(newValue);
    
    // Update user settings in backend if user is authenticated
    if (user) {
      try {
        await updateUserSettings(user, { darkModeEnabled: newValue });
      } catch (error) {
        console.error('Failed to update dark mode preference in backend:', error);
        // Continue with local changes even if backend update fails
      }
    }
    
    return newValue;
  };
  
  return { darkMode, toggleDarkMode, setDarkMode };
};
