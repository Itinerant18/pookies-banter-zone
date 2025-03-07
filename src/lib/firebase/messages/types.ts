
import { Timestamp } from 'firebase/firestore';

// Define a Message type to ensure consistent handling
export interface Message {
  id?: string;
  chatRoomId: string;
  senderId: string;
  message: string;
  timestamp: any;
  status: 'sending' | 'sent' | 'delivered' | 'read';
  deletedForUsers?: string[]; // Array of user IDs for whom the message is deleted
  deletedForEveryone?: boolean; // Flag indicating if the message is deleted for everyone
  deletedAt?: any; // Timestamp when the message was deleted
}

export type MessageStatus = 'sending' | 'sent' | 'delivered' | 'read';
