
import React from 'react';
import { Loader2 } from 'lucide-react';

const FindingMatch: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-64">
      <Loader2 className="h-12 w-12 text-primary animate-spin mb-4" />
      <h3 className="text-xl font-medium">Finding someone to chat with...</h3>
      <p className="text-muted-foreground mt-2">This might take a moment</p>
      <p className="text-muted-foreground text-sm mt-4">
        Creating your user profile and searching for available users...
      </p>
      <div className="mt-6 text-xs text-muted-foreground max-w-md text-center">
        <p>If this takes longer than expected, please check:</p>
        <ul className="list-disc pl-5 mt-2 text-left">
          <li>Your Firebase rules are updated correctly</li>
          <li>You're properly authenticated</li>
          <li>Your database has other user accounts to match with</li>
        </ul>
      </div>
    </div>
  );
};

export default FindingMatch;
