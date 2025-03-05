
import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import { auth } from '@/lib/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';

const Layout: React.FC = () => {
  const [user, loading] = useAuthState(auth);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white text-gray-900">
      {!loading && user && <Header />}
      <main className="w-full mx-auto px-4 sm:px-6 animate-fade-in">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
