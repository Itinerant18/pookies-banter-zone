
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, logoutUser } from '@/lib/firebase';
import { useToast } from '@/components/ui/use-toast';
import { Bell, Moon, ChevronLeft } from 'lucide-react';
import { getUserProfile, updateUserSettings } from '@/lib/firebase/profile';
import { Button } from '@/components/ui/button';
import { useDarkMode } from '@/hooks/useDarkMode';

// Import our components
import SettingsCard from '@/components/settings/SettingsCard';
import SettingsToggle from '@/components/settings/SettingsToggle';
import LogoutDialog from '@/components/settings/LogoutDialog';
import LanguageDisplay from '@/components/settings/LanguageDisplay';
import SettingsLoading from '@/components/settings/SettingsLoading';

const Settings = () => {
  const [user, loading] = useAuthState(auth);
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // Settings state
  const [notificationsEnabled, setNotificationsEnabled] = useState<boolean>(true);
  const { darkMode, toggleDarkMode, setDarkMode } = useDarkMode(user, false);

  // Handle back button click
  const handleBackClick = () => {
    navigate('/');
  };

  // Fetch user settings when component mounts
  useEffect(() => {
    const fetchUserSettings = async () => {
      if (!user) return;
      
      try {
        setIsLoading(true);
        const userProfile = await getUserProfile(user.uid);
        
        if (userProfile) {
          // Set notification preference from DB or default to true
          setNotificationsEnabled(
            userProfile.notificationsEnabled !== undefined 
              ? userProfile.notificationsEnabled 
              : true
          );
          
          // Set dark mode if it's defined in profile
          if (userProfile.darkModeEnabled !== undefined) {
            setDarkMode(userProfile.darkModeEnabled);
          }
        }
      } catch (error) {
        console.error("Failed to fetch user settings:", error);
        toast({
          title: "Failed to load settings",
          description: "Please try again later",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUserSettings();
  }, [user, toast, setDarkMode]);

  // Handle notifications toggle
  const handleNotificationsToggle = async () => {
    if (!user) return;
    
    const newValue = !notificationsEnabled;
    
    try {
      // Optimistically update UI
      setNotificationsEnabled(newValue);
      localStorage.setItem('notificationsEnabled', JSON.stringify(newValue));
      
      // Update in database
      await updateUserSettings(user, { notificationsEnabled: newValue });
      
      toast({
        title: newValue ? 'Notifications enabled' : 'Notifications disabled',
        description: newValue 
          ? 'You will now receive notifications' 
          : 'You will no longer receive notifications',
      });
    } catch (error) {
      console.error('Failed to update notification settings:', error);
      // Revert UI on error
      setNotificationsEnabled(!newValue);
      localStorage.setItem('notificationsEnabled', JSON.stringify(!newValue));
      
      toast({
        title: 'Failed to update notification settings',
        description: 'Please try again later',
        variant: 'destructive',
      });
    }
  };

  // Handle dark mode toggle using our custom hook
  const handleDarkModeToggle = async () => {
    if (!user) return;
    
    try {
      const newValue = await toggleDarkMode();
      
      toast({
        title: newValue ? 'Dark mode enabled' : 'Light mode enabled',
        description: 'The theme has been updated',
      });
    } catch (error) {
      console.error('Failed to update theme:', error);
      
      toast({
        title: 'Failed to update theme',
        description: 'Please try again later',
        variant: 'destructive',
      });
    }
  };

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
      <div className="mb-4">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={handleBackClick}
          className="flex items-center gap-1 text-muted-foreground hover:text-foreground"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to Home
        </Button>
      </div>
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
        {/* Notifications Toggle */}
        <SettingsToggle
          icon={Bell}
          title="Notifications"
          description="Receive app notifications"
          enabled={notificationsEnabled}
          onToggle={handleNotificationsToggle}
        />
        
        {/* Dark Mode Toggle */}
        <SettingsToggle
          icon={Moon}
          title="Dark Mode"
          description="Toggle dark mode on/off"
          enabled={darkMode}
          onToggle={handleDarkModeToggle}
        />
        
        {/* Language (Fixed to English) */}
        <LanguageDisplay />
      </SettingsCard>
    </div>
  );
};

export default Settings;
