
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { AlertCircle, Clock, RefreshCw } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

interface ErrorStateProps {
  error: string | null;
  onRetry: () => void;
  variant?: 'error' | 'no-users';
}

const ErrorState: React.FC<ErrorStateProps> = ({ error, onRetry, variant = 'error' }) => {
  // Display different UI based on whether it's a "no users" message or generic error
  const isNoUsers = variant === 'no-users' || error?.includes('No users available');
  
  return (
    <Card className="glass-card overflow-hidden animate-fade-in">
      <CardContent className="p-6 pt-6 flex flex-col items-center space-y-4">
        {isNoUsers ? (
          <>
            <div className="bg-orange-100 dark:bg-orange-900/20 text-orange-500 p-4 rounded-full">
              <Clock className="h-12 w-12" />
            </div>
            <h3 className="text-2xl font-semibold tracking-tight">No one is online right now</h3>
            <p className="text-center text-muted-foreground">
              Please try again later!
            </p>
          </>
        ) : (
          <>
            <div className="bg-destructive/10 p-4 rounded-full">
              <AlertCircle className="h-12 w-12 text-destructive" />
            </div>
            <h3 className="text-2xl font-semibold tracking-tight">Something went wrong</h3>
            <Alert variant="destructive">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription className="mt-2">{error}</AlertDescription>
            </Alert>
          </>
        )}
      </CardContent>
      <CardFooter className="p-6 pt-0">
        <Button onClick={onRetry} className="w-full">
          <RefreshCw className="h-4 w-4 mr-2" />
          {isNoUsers ? 'Try Again' : 'Retry'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ErrorState;
