
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Shuffle, Users } from 'lucide-react';
import { useChatContext } from '@/contexts/ChatContext';

interface EmptyStateProps {
  onFindMatch: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({ onFindMatch }) => {
  const { showUserList } = useChatContext();
  
  return (
    <Card className="glass-card overflow-hidden animate-fade-in">
      <CardContent className="p-6 pt-6 flex flex-col items-center space-y-4">
        <div className="bg-primary/10 p-4 rounded-full">
          <Users className="h-12 w-12 text-primary" />
        </div>
        <h3 className="text-2xl font-semibold tracking-tight">Start Chatting</h3>
        <p className="text-center text-muted-foreground">
          Connect with someone new or choose from available users to start a conversation.
        </p>
      </CardContent>
      <CardFooter className="p-6 pt-0 flex flex-col sm:flex-row gap-4">
        <Button onClick={onFindMatch} className="w-full">
          <Shuffle className="h-4 w-4 mr-2" />
          Find Random Match
        </Button>
        <Button onClick={showUserList} variant="outline" className="w-full">
          <Users className="h-4 w-4 mr-2" />
          View All Users
        </Button>
      </CardFooter>
    </Card>
  );
};

export default EmptyState;
