
import { useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import { getUserProfile, updateUserSettings } from '@/lib/firebase/profile';
import { useToast } from '@/components/ui/use-toast';
import { useDarkMode } from '@/hooks/useDarkMode';

export const useSettings = (user: User | null) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [notificationsEnabled, setNotificationsEnabled] = useState<boolean>(true);
  const { darkMode, toggleDarkMode, setDarkMode } = useDarkMode(user, false);

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

  return {
    isLoading,
    notificationsEnabled,
    darkMode,
    handleNotificationsToggle,
    handleDarkModeToggle
  };
};
