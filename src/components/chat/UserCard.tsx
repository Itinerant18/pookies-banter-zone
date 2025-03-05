
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { Check } from 'lucide-react';

interface UserCardProps {
  user: {
    uid: string;
    name?: string;
    photoURL?: string;
  };
  onNewChat: () => void;
  disabled?: boolean;
}

const UserCard: React.FC<UserCardProps> = ({ user, onNewChat, disabled = false }) => {
  return (
    <Card className="glass-card overflow-hidden">
      <CardContent className="p-4 flex items-center space-x-4">
        <Avatar className="h-12 w-12 border-2 border-white shadow-sm">
          <AvatarImage src={user.photoURL || undefined} alt={user.name} />
          <AvatarFallback className="bg-primary text-primary-foreground">
            {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <h3 className="text-lg font-medium">{user.name || 'Anonymous'}</h3>
          <div className="flex items-center text-xs text-green-500">
            <Check className="w-3 h-3 mr-1" />
            <span>Online now</span>
          </div>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onNewChat} 
          disabled={disabled}
          className="shrink-0"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          New Chat
        </Button>
      </CardContent>
    </Card>
  );
};

export default UserCard;
