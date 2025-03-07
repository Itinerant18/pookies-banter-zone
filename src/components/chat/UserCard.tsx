
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { RefreshCw, UserPlus, Circle } from 'lucide-react';

interface UserCardProps {
  user: {
    uid: string;
    name?: string;
    photoURL?: string;
    status?: string;
    username?: string;
  };
  onNewChat: () => void;
  buttonLabel?: string;
  disabled?: boolean;
}

const UserCard: React.FC<UserCardProps> = ({ 
  user, 
  onNewChat, 
  buttonLabel = "New Chat", 
  disabled = false 
}) => {
  const isOnline = user.status === 'online';
  
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
          {user.username && (
            <div className="text-sm text-muted-foreground">@{user.username}</div>
          )}
          <div className="flex items-center text-xs mt-1">
            <Circle 
              className={`w-3 h-3 mr-1 ${isOnline ? 'text-green-500 fill-green-500' : 'text-gray-400 fill-gray-400'}`}
            />
            <span className={isOnline ? 'text-green-500' : 'text-muted-foreground'}>
              {isOnline ? 'Online now' : 'Offline'}
            </span>
          </div>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onNewChat} 
          disabled={disabled}
          className="shrink-0"
        >
          {buttonLabel === "New Chat" ? (
            <RefreshCw className="h-4 w-4 mr-2" />
          ) : (
            <UserPlus className="h-4 w-4 mr-2" />
          )}
          {buttonLabel}
        </Button>
      </CardContent>
    </Card>
  );
};

export default UserCard;
