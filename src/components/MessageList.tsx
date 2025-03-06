import React, { useRef, useEffect, useState } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/lib/firebase';
import { format } from 'date-fns';
import { Message, markMessagesAsRead } from '@/lib/firebase/messages';
import MessageStatus from '@/components/chat/MessageStatus';

interface FormattedMessage extends Message {
  formattedTime?: string;
}

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
  const [formattedMessages, setFormattedMessages] = useState<FormattedMessage[]>([]);
  const [lastReadMessageId, setLastReadMessageId] = useState<string | null>(null);
  const isVisible = useRef(true);

  const groupMessagesByDate = (msgs: FormattedMessage[]) => {
    const groups: { [date: string]: FormattedMessage[] } = {};
    
    msgs.forEach(msg => {
      if (msg.timestamp?.toDate) {
        const date = format(msg.timestamp.toDate(), 'yyyy-MM-dd');
        if (!groups[date]) {
          groups[date] = [];
        }
        groups[date].push(msg);
      } else {
        if (!groups['pending']) {
          groups['pending'] = [];
        }
        groups['pending'].push(msg);
      }
    });
    
    return groups;
  };

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
    if (messages && messages.length > 0) {
      console.log("Processing messages in MessageList:", messages.length, messages);
      const processed = messages.map(msg => {
        return {
          ...msg,
          formattedTime: msg.timestamp?.toDate ? 
            format(msg.timestamp.toDate(), 'HH:mm') : 
            'Sending...'
        };
      });
      
      setFormattedMessages(processed);
      
      const lastMessage = processed[processed.length - 1];
      if (lastMessage && lastMessage.senderId !== user?.uid) {
        setLastReadMessageId(lastMessage.id);
      }
    } else {
      setFormattedMessages([]);
    }
  }, [messages, user?.uid]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [formattedMessages, isTyping]);

  const messageGroups = groupMessagesByDate(formattedMessages);
  const dates = Object.keys(messageGroups).sort();

  const renderDateHeader = (dateStr: string) => {
    if (dateStr === 'pending') return null;
    
    const date = new Date(dateStr);
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    
    let displayDate;
    if (dateStr === format(today, 'yyyy-MM-dd')) {
      displayDate = 'Today';
    } else if (dateStr === format(yesterday, 'yyyy-MM-dd')) {
      displayDate = 'Yesterday';
    } else {
      displayDate = format(date, 'MMMM d, yyyy');
    }
    
    return (
      <div className="flex justify-center my-4">
        <div className="bg-muted px-3 py-1 rounded-full text-xs font-medium text-muted-foreground">
          {displayDate}
        </div>
      </div>
    );
  };

  return (
    <ScrollArea className="h-[400px] p-4">
      {formattedMessages.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full text-center p-4">
          <h3 className="text-lg font-medium">No messages yet</h3>
          <p className="text-muted-foreground mt-2">Say hello to start the conversation!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {Object.keys(groupMessagesByDate(formattedMessages))
            .sort()
            .map(date => (
              <div key={date}>
                {renderDateHeader(date)}
                <div className="space-y-4">
                  {groupMessagesByDate(formattedMessages)[date].map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${
                        msg.senderId === user?.uid ? 'justify-end' : 'justify-start'
                      }`}
                    >
                      <div className="flex flex-col">
                        <div
                          className={`max-w-[75%] px-4 py-2 rounded-lg ${
                            msg.senderId === user?.uid
                              ? 'bg-primary text-primary-foreground rounded-br-none'
                              : 'bg-secondary text-secondary-foreground rounded-bl-none'
                          }`}
                        >
                          {msg.message}
                        </div>
                        <div className="flex justify-between items-center text-xs text-muted-foreground mt-1 px-2">
                          <span>{msg.formattedTime}</span>
                          {msg.senderId === user?.uid && <MessageStatus status={msg.status} />}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          
          {isTyping && recipientId && (
            <div className="flex justify-start">
              <div className="flex flex-col">
                <div className="max-w-[75%] px-4 py-2 rounded-lg bg-secondary text-secondary-foreground rounded-bl-none">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
                    <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
                    <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: "600ms" }}></div>
                  </div>
                </div>
                <span className="text-xs text-muted-foreground mt-1 px-2">Typing...</span>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      )}
    </ScrollArea>
  );
};

export default MessageList;
