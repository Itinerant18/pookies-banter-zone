
import React, { useState } from 'react';
import MessageStatus from '../MessageStatus';
import MessageTime from './MessageTime';
import { FormattedMessage } from './types';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { MoreVertical, Trash, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { canDeleteForEveryone, deleteMessageForEveryone, deleteMessageForMe } from '@/lib/firebase/messages';
import DeletedMessage from './DeletedMessage';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/lib/firebase';

interface MessageBubbleProps {
  message: FormattedMessage;
  isCurrentUser: boolean;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ 
  message, 
  isCurrentUser 
}) => {
  const [user] = useAuthState(auth);
  const { toast } = useToast();
  const [isDeleting, setIsDeleting] = useState(false);
  const canDelete = user && message.id;
  const canDeleteAll = canDelete && canDeleteForEveryone(message, user.uid);

  const handleDeleteForMe = async () => {
    if (!canDelete || !message.id || !user) return;
    
    try {
      setIsDeleting(true);
      await deleteMessageForMe(message.id, user.uid);
      toast({
        title: "Message deleted",
        description: "Message was deleted from your chat history",
      });
    } catch (error: any) {
      toast({
        title: "Error deleting message",
        description: error.message || "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeleteForEveryone = async () => {
    if (!canDeleteAll || !message.id || !user) return;
    
    try {
      setIsDeleting(true);
      await deleteMessageForEveryone(message.id, user.uid);
      toast({
        title: "Message deleted for everyone",
        description: "Message was deleted for everyone in the chat",
      });
    } catch (error: any) {
      toast({
        title: "Error deleting message",
        description: error.message || "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  // If the message is deleted for everyone, show the deleted message placeholder
  if (message.deletedForEveryone) {
    return (
      <div className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
        <DeletedMessage />
      </div>
    );
  }

  return (
    <div
      className={`flex ${
        isCurrentUser ? 'justify-end' : 'justify-start'
      } group`}
    >
      <div className="flex flex-col relative">
        {canDelete && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="absolute top-0 -right-8 p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <MoreVertical className="h-4 w-4 text-muted-foreground" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align={isCurrentUser ? "end" : "start"} className="w-48">
              <DropdownMenuItem 
                onClick={handleDeleteForMe}
                disabled={isDeleting}
                className="cursor-pointer"
              >
                <Trash className="h-4 w-4 mr-2" />
                Delete for me
              </DropdownMenuItem>
              
              {canDeleteAll && (
                <DropdownMenuItem 
                  onClick={handleDeleteForEveryone}
                  disabled={isDeleting}
                  className="text-destructive cursor-pointer"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete for everyone
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
        
        <div
          className={`max-w-[75%] px-4 py-2 rounded-lg ${
            isCurrentUser
              ? 'bg-primary text-primary-foreground rounded-br-none'
              : 'bg-secondary text-secondary-foreground rounded-bl-none'
          }`}
        >
          {message.message}
        </div>
        <div className="flex justify-between items-center text-xs text-muted-foreground mt-1 px-2">
          <MessageTime time={message.formattedTime} />
          {isCurrentUser && <MessageStatus status={message.status} />}
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
