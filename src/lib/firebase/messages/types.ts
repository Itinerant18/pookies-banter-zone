
import { Timestamp } from 'firebase/firestore';

// Define a Message type to ensure consistent handling
export interface Message {
  id?: string;
  chatRoomId: string;
  senderId: string;
  message: string;
  timestamp: any;
  status: 'sending' | 'sent' | 'delivered' | 'read';
}

export type MessageStatus = 'sending' | 'sent' | 'delivered' | 'read';
