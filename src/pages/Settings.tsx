
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, logoutUser } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Toggle } from '@/components/ui/toggle';
import { Bell, Moon, Globe, LogOut } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { updateUserSettings } from '@/lib/firebase/profile';

const Settings = () => {
  const [user, loading] = useAuthState(auth);
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
  
  // Settings state
  const [notificationsEnabled, setNotificationsEnabled] = useState<boolean>(() => {
    const saved = localStorage.getItem('notificationsEnabled');
    return saved !== null ? JSON.parse(saved) : true; // Default: enabled
  });
  
  const [darkModeEnabled, setDarkModeEnabled] = useState<boolean>(() => {
    const saved = localStorage.getItem('darkModeEnabled');
    return saved !== null ? JSON.parse(saved) : false; // Default: disabled
  });

  // Apply dark mode when the component mounts or when darkModeEnabled changes
  useEffect(() => {
    if (darkModeEnabled) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkModeEnabled', JSON.stringify(darkModeEnabled));
  }, [darkModeEnabled]);

  // Handle notifications toggle
  const handleNotificationsToggle = async () => {
    try {
      const newValue = !notificationsEnabled;
      setNotificationsEnabled(newValue);
      localStorage.setItem('notificationsEnabled', JSON.stringify(newValue));
      
      if (user) {
        await updateUserSettings(user, { notificationsEnabled: newValue });
      }
      
      toast({
        title: newValue ? 'Notifications enabled' : 'Notifications disabled',
        description: newValue ? 'You will now receive notifications' : 'You will no longer receive notifications',
      });
    } catch (error) {
      console.error('Failed to update notification settings:', error);
      toast({
        title: 'Failed to update notification settings',
        description: 'Please try again later',
        variant: 'destructive',
      });
      // Revert the UI state if the backend update fails
      setNotificationsEnabled(!notificationsEnabled);
      localStorage.setItem('notificationsEnabled', JSON.stringify(!notificationsEnabled));
    }
  };

  // Handle dark mode toggle
  const handleDarkModeToggle = () => {
    try {
      const newValue = !darkModeEnabled;
      setDarkModeEnabled(newValue);
      // localStorage update is handled in the useEffect
      
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
      // Revert the UI state if there's an error
      setDarkModeEnabled(!darkModeEnabled);
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

  return (
    <div className="w-full max-w-md mx-auto py-6 animate-fade-in">
      <Card className="glass-card">
        <CardHeader>
          <CardTitle>Settings</CardTitle>
          <CardDescription>
            Customize your app experience
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Bell className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Notifications</p>
                  <p className="text-xs text-muted-foreground">Receive chat notifications</p>
                </div>
              </div>
              <Toggle 
                aria-label="Toggle notifications" 
                pressed={notificationsEnabled}
                onPressedChange={handleNotificationsToggle}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Moon className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Dark Mode</p>
                  <p className="text-xs text-muted-foreground">Toggle dark mode on/off</p>
                </div>
              </div>
              <Toggle 
                aria-label="Toggle dark mode" 
                pressed={darkModeEnabled}
                onPressedChange={handleDarkModeToggle}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Globe className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Language</p>
                  <p className="text-xs text-muted-foreground">English</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex-col space-y-2">
          <AlertDialog open={logoutDialogOpen} onOpenChange={setLogoutDialogOpen}>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" className="w-full">
                <LogOut className="mr-2 h-4 w-4" />
                Log out
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure you want to log out?</AlertDialogTitle>
                <AlertDialogDescription>
                  You will need to sign in again to access your account.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  {isLoggingOut ? 'Logging out...' : 'Yes, log out'}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          
          <p className="text-center text-xs text-muted-foreground pt-2">
            Connected as {user.email}
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Settings;
