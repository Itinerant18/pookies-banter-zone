
import React from 'react';
import { AlertTriangle, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

interface ErrorStateProps {
  error: string;
  onRetry: () => void;
}

const ErrorState: React.FC<ErrorStateProps> = ({ error, onRetry }) => {
  const openFirebaseRules = () => {
    window.open('/src/lib/firebaseRules.md', '_blank');
  };

  return (
    <div className="flex flex-col items-center justify-center h-64">
      <AlertTriangle className="h-12 w-12 text-destructive mb-4" />
      <h3 className="text-xl font-medium mb-2">We encountered a problem</h3>
      <p className="text-muted-foreground text-center mb-6">{error}</p>
      <Alert variant="destructive" className="mb-4 max-w-md">
        <AlertTitle>Firebase Permission Error</AlertTitle>
        <AlertDescription className="mt-2">
          <p>This error occurs because your Firebase security rules are too restrictive.</p>
          <ol className="list-decimal pl-4 mt-2 space-y-1 text-sm">
            <li>Go to your Firebase Console</li>
            <li>Navigate to Firestore Database → Rules</li>
            <li>Update the rules to allow read/write access to your collections</li>
          </ol>
          <Button 
            variant="outline" 
            size="sm" 
            className="mt-3 w-full"
            onClick={openFirebaseRules}
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            View Recommended Rules
          </Button>
        </AlertDescription>
      </Alert>
      <Button onClick={onRetry} size="lg" className="animate-enter">
        Try Again
      </Button>
    </div>
  );
};

export default ErrorState;
