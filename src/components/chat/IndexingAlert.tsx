
import React from 'react';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const IndexingAlert: React.FC = () => {
  return (
    <Alert variant="destructive" className="animate-bounce-slow">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Firestore Index Required</AlertTitle>
      <AlertDescription>
        <p>Firebase needs to create an index for chat messages. Please check your browser console for a link to create it. This is a one-time setup.</p>
        <p className="mt-2 text-sm">After creating the index, it may take a few minutes to become active.</p>
      </AlertDescription>
    </Alert>
  );
};

export default IndexingAlert;
