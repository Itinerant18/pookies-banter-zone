import React, { useRef, useEffect, useState } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/lib/firebase';
import { Message, markMessagesAsRead } from '@/lib/firebase/messages';
import { useMessageFormatter } from './message/useMessageFormatter';
import MessageDay from './message/MessageDay';
import TypingIndicator from './message/TypingIndicator';
import EmptyMessageList from './message/EmptyMessageList';

interface MessageListProps {
  messages: Message[];
  isTyping?: boolean;
  recipientId?: string;
  chatRoomId?: string;
}

const MessageList: React.FC<MessageListProps> = ({ 
  messages, 
  isTyping = false,
  recipientId,
  chatRoomId
}) => {
  const [user] = useAuthState(auth);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [lastReadMessageId, setLastReadMessageId] = useState<string | null>(null);
  const isVisible = useRef(true);
  const { formattedMessages, groupMessagesByDate } = useMessageFormatter(messages);

  useEffect(() => {
    if (!user?.uid || !chatRoomId || !recipientId || !isVisible.current) return;
    
    const hasUnreadMessages = messages.some(
      msg => msg.senderId !== user.uid && msg.status !== 'read'
    );
    
    if (hasUnreadMessages) {
      markMessagesAsRead(chatRoomId, user.uid).then(count => {
        if (count > 0) {
          console.log(`Marked ${count} messages as read`);
        }
      });
    }
  }, [messages, user?.uid, chatRoomId, recipientId]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      isVisible.current = document.visibilityState === 'visible';
      
      if (isVisible.current && user?.uid && chatRoomId && recipientId) {
        markMessagesAsRead(chatRoomId, user.uid);
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [chatRoomId, recipientId, user?.uid]);

  useEffect(() => {
    if (formattedMessages && formattedMessages.length > 0) {
      const lastMessage = formattedMessages[formattedMessages.length - 1];
      if (lastMessage && lastMessage.senderId !== user?.uid) {
        setLastReadMessageId(lastMessage.id);
      }
    }
  }, [formattedMessages, user?.uid]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [formattedMessages, isTyping]);

  const messageGroups = groupMessagesByDate(formattedMessages);
  const dates = Object.keys(messageGroups).sort();

  return (
    <ScrollArea className="h-[400px] p-4">
      {formattedMessages.length === 0 ? (
        <EmptyMessageList />
      ) : (
        <div className="space-y-4">
          {dates.map(date => (
            <MessageDay 
              key={date}
              date={date}
              messages={messageGroups[date]}
              currentUserId={user?.uid}
            />
          ))}
          
          <TypingIndicator isTyping={isTyping} recipientId={recipientId} />
          
          <div ref={messagesEndRef} />
        </div>
      )}
    </ScrollArea>
  );
};

export default MessageList;
