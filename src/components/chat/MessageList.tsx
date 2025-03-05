
import React, { useRef, useEffect, useState } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/lib/firebase';
import { format } from 'date-fns';

interface Message {
  id: string;
  senderId: string;
  message: string;
  timestamp: any;
}

interface MessageListProps {
  messages: Message[];
}

const MessageList: React.FC<MessageListProps> = ({ messages }) => {
  const [user] = useAuthState(auth);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [formattedMessages, setFormattedMessages] = useState<Message[]>([]);

  // Format message timestamps
  useEffect(() => {
    if (messages && messages.length > 0) {
      console.log("Processing messages:", messages.length);
      const processed = messages.map(msg => ({
        ...msg,
        // Format timestamp if it exists
        formattedTime: msg.timestamp?.toDate ? 
          format(msg.timestamp.toDate(), 'HH:mm') : 
          'Sending...'
      }));
      setFormattedMessages(processed);
    } else {
      setFormattedMessages([]);
    }
  }, [messages]);

  // Scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [formattedMessages]);

  return (
    <ScrollArea className="h-[400px] p-4">
      {formattedMessages.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full text-center p-4">
          <h3 className="text-lg font-medium">No messages yet</h3>
          <p className="text-muted-foreground mt-2">Say hello to start the conversation!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {formattedMessages.map((msg) => (
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
                <span className="text-xs text-muted-foreground mt-1 px-2">
                  {msg.formattedTime}
                </span>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      )}
    </ScrollArea>
  );
};

export default MessageList;
