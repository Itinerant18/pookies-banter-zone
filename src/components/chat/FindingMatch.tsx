
import React from 'react';
import { Loader2 } from 'lucide-react';

const FindingMatch: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-64">
      <Loader2 className="h-12 w-12 text-primary animate-spin mb-4" />
      <h3 className="text-xl font-medium">Finding someone to chat with...</h3>
      <p className="text-muted-foreground mt-2">This might take a moment</p>
    </div>
  );
};

export default FindingMatch;
