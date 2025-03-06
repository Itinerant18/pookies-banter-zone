
import React from 'react';
import { LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
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

interface LogoutDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onLogout: () => Promise<void>;
  isLoggingOut: boolean;
  userEmail: string | null;
}

const LogoutDialog = ({
  open,
  onOpenChange,
  onLogout,
  isLoggingOut,
  userEmail,
}: LogoutDialogProps) => {
  return (
    <div className="flex-col space-y-2 w-full">
      <AlertDialog open={open} onOpenChange={onOpenChange}>
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
              onClick={onLogout}
              disabled={isLoggingOut}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isLoggingOut ? 'Logging out...' : 'Yes, log out'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      <p className="text-center text-xs text-muted-foreground pt-2">
        Connected as {userEmail}
      </p>
    </div>
  );
};

export default LogoutDialog;
