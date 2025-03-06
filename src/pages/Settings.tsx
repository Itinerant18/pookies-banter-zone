
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
import { Bell, Moon, LogOut } from 'lucide-react';
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
import { getUserProfile, updateUserSettings } from '@/lib/firebase/profile';

const Settings = () => {
  const [user, loading] = useAuthState(auth);
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // Settings state
  const [notificationsEnabled, setNotificationsEnabled] = useState<boolean>(true);
  const [darkModeEnabled, setDarkModeEnabled] = useState<boolean>(false);

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
          
          // Set dark mode preference from DB or default to false
          setDarkModeEnabled(
            userProfile.darkModeEnabled !== undefined 
              ? userProfile.darkModeEnabled 
              : false
          );
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
  }, [user, toast]);

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

  // Handle dark mode toggle
  const handleDarkModeToggle = async () => {
    if (!user) return;
    
    const newValue = !darkModeEnabled;
    
    try {
      // Optimistically update UI
      setDarkModeEnabled(newValue);
      // localStorage update handled in useEffect
      
      // Update in database
      await updateUserSettings(user, { darkModeEnabled: newValue });
      
      toast({
        title: newValue ? 'Dark mode enabled' : 'Light mode enabled',
        description: 'The theme has been updated',
      });
    } catch (error) {
      console.error('Failed to update theme:', error);
      // Revert UI on error
      setDarkModeEnabled(!newValue);
      
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
            {/* Notifications Toggle */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Bell className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Notifications</p>
                  <p className="text-xs text-muted-foreground">Receive app notifications</p>
                </div>
              </div>
              <Toggle 
                aria-label="Toggle notifications" 
                pressed={notificationsEnabled}
                onPressedChange={handleNotificationsToggle}
              />
            </div>
            
            {/* Dark Mode Toggle */}
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
            
            {/* Language (Fixed to English) */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="h-5 w-5 flex items-center justify-center text-muted-foreground">
                  <span className="text-sm">🇺🇸</span>
                </div>
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
