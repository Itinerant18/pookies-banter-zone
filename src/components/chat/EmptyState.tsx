
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Settings, Shuffle, User, Users } from 'lucide-react';
import { useChatContext } from '@/contexts/ChatContext';

interface EmptyStateProps {
  onFindMatch: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({ onFindMatch }) => {
  const { showUserList } = useChatContext();
  
  return (
    <Card className="glass-card overflow-hidden animate-fade-in theme-transition">
      
      
      <CardContent className="p-6 pt-6 flex flex-col items-center space-y-4">
        <div className="bg-primary/10 dark:bg-primary/20 p-4 rounded-full theme-transition">
        <img src="/Start Chatting.png" alt="User Icon" className="h-16 w-16" />
        </div>
        <h3 className="text-2xl font-semibold tracking-tight">
          Start Chatting
        </h3>
        <p className="text-center text-muted-foreground">
          Connect with someone new or choose from available users to start a
          conversation.
        </p>
      </CardContent>



      <CardFooter className="p-6 pt-0 flex flex-col sm:flex-row gap-4">
        <Button onClick={onFindMatch} className="w-full">
        <img
                        src="/shuffle.png"
                        alt="Profile"
                        className="w-4 h-4"
                      />
          Find Random Match
        </Button>
        <Button onClick={showUserList} variant="outline" className="w-full">
        <img
                        src="/user.png"
                        alt="Profile"
                        className="w-4 h-4"
                      />
          View All Users
        </Button>
      </CardFooter>
    </Card>
  );
};

export default EmptyState;
