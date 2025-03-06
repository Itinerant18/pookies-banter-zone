
import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import { auth } from '@/lib/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';

const Layout: React.FC = () => {
  const [user, loading] = useAuthState(auth);
  
  // Initialize dark mode from localStorage on first load
  useEffect(() => {
    const darkModeEnabled = localStorage.getItem('darkModeEnabled');
    if (darkModeEnabled !== null && JSON.parse(darkModeEnabled)) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-champagne to-white dark:from-outerspace dark:to-outerspace-400 text-outerspace dark:text-timberwolf theme-transition">
      {!loading && user && <Header />}
      <main className="w-full mx-auto px-4 sm:px-6 animate-fade-in">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
