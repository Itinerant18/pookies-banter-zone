
import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Message } from '@/lib/firebase/messages';
import { FormattedMessage } from './types';

export const useMessageFormatter = (messages: Message[]) => {
  const [formattedMessages, setFormattedMessages] = useState<FormattedMessage[]>([]);
  
  useEffect(() => {
    if (messages && messages.length > 0) {
      console.log("Processing messages in useMessageFormatter:", messages.length, messages);
      const processed = messages.map(msg => {
        return {
          ...msg,
          formattedTime: msg.timestamp?.toDate ? 
            format(msg.timestamp.toDate(), 'HH:mm') : 
            'Sending...'
        };
      });
      
      setFormattedMessages(processed);
    } else {
      setFormattedMessages([]);
    }
  }, [messages]);

  // Group messages by date
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
        // Handle messages without valid timestamps
        if (!groups['pending']) {
          groups['pending'] = [];
        }
        groups['pending'].push(msg);
      }
    });
    
    return groups;
  };

  return {
    formattedMessages,
    groupMessagesByDate,
  };
};
