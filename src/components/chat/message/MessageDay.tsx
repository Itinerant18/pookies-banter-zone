
import React from 'react';
import MessageBubble from './MessageBubble';
import DateHeader from './DateHeader';
import { FormattedMessage } from './types';

interface MessageDayProps {
  date: string;
  messages: FormattedMessage[];
  currentUserId?: string;
}

const MessageDay: React.FC<MessageDayProps> = ({ 
  date, 
  messages, 
  currentUserId 
}) => {
  return (
    <div key={date}>
      <DateHeader dateStr={date} />
      <div className="space-y-4">
        {messages.map((msg) => (
          <MessageBubble 
            key={msg.id} 
            message={msg} 
            isCurrentUser={msg.senderId === currentUserId} 
          />
        ))}
      </div>
    </div>
  );
};

export default MessageDay;
