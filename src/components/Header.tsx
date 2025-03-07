
import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, logoutUser } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MessageCircle, User, Settings, LogOut } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from '@/hooks/use-toast';

const Header: React.FC = () => {
  const [user] = useAuthState(auth);
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);


  if (location.pathname === '/') {
    const noUser = !user;
    if (noUser) return null;
  }

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
      setLogoutDialogOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-champagne/80 dark:bg-outerspace/90 backdrop-blur-md border-b border-gray-100 dark:border-outerspace-300">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/chat" className="flex items-center space-x-2">
          <img src="/hashtags.gif" alt="Logo" className="w-9 h-9" />
          <span className="text-4xl font-display font-bold bg-gradient-to-b from-cherry-200 to-cherry-600 text-transparent bg-clip-text animate-slide-down">Pookie's Banter Zone</span>
        </Link>

        <div className="flex items-center space-x-4">
          <nav className="hidden md:flex items-center space-x-1">
            <Link to="/chat">
              <Button
                variant={location.pathname === '/chat' ? 'default' : 'ghost'}
                size="sm"
                className="animate-enter font-medium"
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                Chat
              </Button>
            </Link>
            <Link to="/profile">
              <Button
                variant={location.pathname === '/profile' ? 'default' : 'ghost'}
                size="sm"
                className="animate-enter font-medium"
              >
                <User className="w-4 h-4 mr-2" />
                Profile
              </Button>
            </Link>
            <Link to="/settings">
              <Button
                variant={location.pathname === '/settings' ? 'default' : 'ghost'}
                size="sm"
                className="animate-enter font-medium"
              >
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
            </Link>
          </nav>

          {user && (
            <>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center space-x-2 focus:outline-none">
                    <Avatar className="h-9 w-9 border-2 border-white shadow-sm transition-transform hover:scale-105">
                      <AvatarImage src={user.photoURL || undefined} alt={user.displayName || 'User'} />
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {user.displayName ? user.displayName.charAt(0).toUpperCase() : 'U'}
                      </AvatarFallback>
                    </Avatar>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-0.5">
                      <p className="text-sm font-medium">{user.displayName || 'User'}</p>
                      <p className="text-xs text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/profile" className="cursor-pointer flex items-center">
                      <img src="/user.png" alt="Profile" className="w-4 h-4 mr-2" />
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/settings" className="cursor-pointer">
                      <img src="/settings.png" alt="Profile" className="w-4 h-4 mr-2" />
                      Settings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => setLogoutDialogOpen(true)}
                    className="text-red-500 focus:bg-red-50 focus:text-red-500 cursor-pointer"
                  >
                    <img src="/Logout.png" alt="Profile" className="w-4 h-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <AlertDialog open={logoutDialogOpen} onOpenChange={setLogoutDialogOpen}>
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
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
