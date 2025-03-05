
import React from 'react';
import { Card } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useChatContext } from './ChatContext';

// Import our components
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import UserCard from './UserCard';
import FindingMatch from './FindingMatch';
import ErrorState from './ErrorState';
import EmptyState from './EmptyState';

const ChatContainer: React.FC = () => {
  const { 
    matchedUser, 
    finding, 
    error, 
    chatRoomId, 
    messages, 
    indexingError, 
    isRecipientTyping,
    findRandomMatch,
    handleSendMessage,
    handleTypingStatus
  } = useChatContext();

  // Render the appropriate component based on state
  if (finding) {
    return <FindingMatch />;
  }
  
  if (error) {
    return <ErrorState error={error} onRetry={findRandomMatch} />;
  }
  
  if (!matchedUser) {
    return <EmptyState onFindMatch={findRandomMatch} />;
  }
  
  return (
    <div className="flex flex-col space-y-4">
      <UserCard 
        user={matchedUser} 
        onNewChat={findRandomMatch} 
        disabled={finding} 
      />

      {indexingError && (
        <Alert variant="destructive" className="animate-bounce-slow">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Firestore Index Required</AlertTitle>
          <AlertDescription>
            <p>Firebase needs to create an index for chat messages. Please check your browser console for a link to create it. This is a one-time setup.</p>
            <p className="mt-2 text-sm">After creating the index, it may take a few minutes to become active.</p>
          </AlertDescription>
        </Alert>
      )}

      <Card className="glass-card overflow-hidden">
        <MessageList 
          messages={messages} 
          isTyping={isRecipientTyping}
          recipientId={matchedUser.uid}
        />
      </Card>

      <MessageInput 
        onSendMessage={handleSendMessage}
        onTyping={handleTypingStatus}
        chatRoomId={chatRoomId}
        disabled={!chatRoomId} 
      />
    </div>
  );
};

export default ChatContainer;
