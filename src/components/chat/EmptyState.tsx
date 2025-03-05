
import React from 'react';
import { Button } from '@/components/ui/button';

interface EmptyStateProps {
  onFindMatch: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({ onFindMatch }) => {
  return (
    <div className="flex flex-col items-center justify-center h-64">
      <h3 className="text-xl font-medium mb-4">No one to chat with right now</h3>
      <Button onClick={onFindMatch} size="lg" className="animate-enter">
        Find Someone to Chat With
      </Button>
    </div>
  );
};

export default EmptyState;
