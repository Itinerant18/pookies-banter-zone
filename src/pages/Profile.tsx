
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/lib/firebase';
import ProfileSettings from '@/components/ProfileSettings';

const Profile = () => {
  const [user, loading] = useAuthState(auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/');
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-12 w-48 bg-gray-300 rounded-lg mb-4"></div>
          <div className="h-4 w-36 bg-gray-300 rounded-md"></div>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return <ProfileSettings />;
};

export default Profile;
