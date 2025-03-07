
import React from 'react';
import MessageStatus from '../MessageStatus';
import MessageTime from './MessageTime';
import { FormattedMessage } from './types';

interface MessageBubbleProps {
  message: FormattedMessage;
  isCurrentUser: boolean;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ 
  message, 
  isCurrentUser 
}) => {
  return (
    <div
      className={`flex ${
        isCurrentUser ? 'justify-end' : 'justify-start'
      }`}
    >
      <div className="flex flex-col">
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
