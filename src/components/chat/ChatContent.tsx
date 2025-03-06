
import React from 'react';
import { Card } from '@/components/ui/card';
import { useChatContext } from '@/contexts/ChatContext';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import UserCard from './UserCard';
import IndexingAlert from './IndexingAlert';

const ChatContent: React.FC = () => {
  const { 
    matchedUser, 
    chatRoomId, 
    messages, 
    indexingError, 
    isRecipientTyping,
    showUserList,
    handleSendMessage,
    handleTypingStatus
  } = useChatContext();

  if (!matchedUser) {
    return null;
  }

  return (
    <div className="flex flex-col space-y-4">
      <UserCard 
        user={matchedUser} 
        onNewChat={showUserList} 
        buttonLabel="Change User"
        disabled={false} 
      />

      {indexingError && <IndexingAlert />}

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

export default ChatContent;
