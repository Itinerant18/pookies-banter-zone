
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, logoutUser } from '@/lib/firebase';
import { useToast } from '@/components/ui/use-toast';

// Import our components
import SettingsCard from '@/components/settings/SettingsCard';
import SettingsLoading from '@/components/settings/SettingsLoading';
import SettingsContent from '@/components/settings/SettingsContent';
import BackButton from '@/components/settings/BackButton';
import LogoutDialog from '@/components/settings/LogoutDialog';
import { useSettings } from '@/hooks/useSettings';

const Settings = () => {
  const [user, loading] = useAuthState(auth);
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
  const { isLoading } = useSettings(user);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/');
    }
  }, [user, loading, navigate]);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await logoutUser();
      toast({
        title: 'Logged out successfully',
        description: 'You have been logged out of your account',
      });
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
      toast({
        title: 'Logout failed',
        description: 'Please try again later',
        variant: 'destructive',
      });
    } finally {
      setIsLoggingOut(false);
    }
  };

  if (loading || isLoading) {
    return <SettingsLoading />;
  }

  if (!user) {
    return null;
  }

  return (
    <div className="w-full max-w-md mx-auto py-6 animate-fade-in">
      <BackButton />
      <SettingsCard 
        title="Settings" 
        description="Customize your app experience"
        footer={
          <LogoutDialog
            open={logoutDialogOpen}
            onOpenChange={setLogoutDialogOpen}
            onLogout={handleLogout}
            isLoggingOut={isLoggingOut}
            userEmail={user.email}
          />
        }
      >
        <SettingsContent
          user={user}
          isLoggingOut={isLoggingOut}
          logoutDialogOpen={logoutDialogOpen}
          setLogoutDialogOpen={setLogoutDialogOpen}
          handleLogout={handleLogout}
        />
      </SettingsCard>
    </div>
  );
};

export default Settings;
