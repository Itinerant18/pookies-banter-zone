
import React from 'react';
import { Check, Clock } from 'lucide-react';

interface MessageStatusProps {
  status: 'sending' | 'sent' | 'delivered' | 'read';
}

const MessageStatus: React.FC<MessageStatusProps> = ({ status }) => {
  switch (status) {
    case 'sending':
      return (
        <span className="flex items-center text-xs text-muted-foreground">
          <Clock className="h-3 w-3 mr-1" />
          Sending...
        </span>
      );
    case 'sent':
      return (
        <span className="flex items-center text-xs text-muted-foreground">
          <Check className="h-3 w-3 mr-1" />
          Sent
        </span>
      );
    case 'delivered':
      return (
        <span className="flex items-center text-xs text-muted-foreground">
          <Check className="h-3 w-3 mr-1" />
          <Check className="h-3 w-3 mr-1" />
          Delivered
        </span>
      );
    case 'read':
      return (
        <span className="flex items-center text-xs text-green-500">
          <Check className="h-3 w-3 mr-1" />
          <Check className="h-3 w-3 mr-1" />
          Read
        </span>
      );
    default:
      return null;
  }
};

export default MessageStatus;
