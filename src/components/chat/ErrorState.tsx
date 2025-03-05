
import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ErrorStateProps {
  error: string;
  onRetry: () => void;
}

const ErrorState: React.FC<ErrorStateProps> = ({ error, onRetry }) => {
  return (
    <div className="flex flex-col items-center justify-center h-64">
      <AlertTriangle className="h-12 w-12 text-destructive mb-4" />
      <h3 className="text-xl font-medium mb-2">We encountered a problem</h3>
      <p className="text-muted-foreground text-center mb-6">{error}</p>
      <Button onClick={onRetry} size="lg" className="animate-enter">
        Try Again
      </Button>
    </div>
  );
};

export default ErrorState;
