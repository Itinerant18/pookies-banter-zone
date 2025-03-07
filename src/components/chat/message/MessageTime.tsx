
import React from 'react';
import { format } from 'date-fns';

interface MessageTimeProps {
  time?: string;
  timestamp?: Date | { seconds: number; nanoseconds: number };
}

const MessageTime: React.FC<MessageTimeProps> = ({ time, timestamp }) => {
  if (time) {
    return <span className="text-xs text-muted-foreground">{time}</span>;
  }
  
  if (timestamp) {
    let formattedTime: string;
    
    if (timestamp instanceof Date) {
      formattedTime = format(timestamp, 'h:mm a');
    } else if (typeof timestamp === 'object' && 'seconds' in timestamp) {
      // Handle Firestore Timestamp
      const date = new Date(timestamp.seconds * 1000);
      formattedTime = format(date, 'h:mm a');
    } else {
      return null;
    }
    
    return <span className="text-xs text-muted-foreground">{formattedTime}</span>;
  }
  
  return null;
};

export default MessageTime;
