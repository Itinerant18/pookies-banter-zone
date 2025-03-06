
import React, { createContext, useContext, useState } from 'react';
import { Message } from '@/lib/firebase/messages';

// Define context types
interface ChatContextType {
  user: any;
  matchedUser: any;
  finding: boolean;
  error: string | null;
  chatRoomId: string | null;
  messages: Message[];
  indexingError: boolean;
  isRecipientTyping: boolean;
  userListMode: boolean;
  findRandomMatch: () => Promise<void>;
  handleSendMessage: (message: string) => Promise<void>;
  handleTypingStatus: (isTyping: boolean) => Promise<void>;
  selectUser: (user: any) => Promise<void>;
  showUserList: () => void;
  goBack: () => void;
}

// Create context with default values
const ChatContext = createContext<ChatContextType>({
  user: null,
  matchedUser: null,
  finding: false,
  error: null,
  chatRoomId: null,
  messages: [],
  indexingError: false,
  isRecipientTyping: false,
  userListMode: false,
  findRandomMatch: async () => {},
  handleSendMessage: async () => {},
  handleTypingStatus: async () => {},
  selectUser: async () => {},
  showUserList: () => {},
  goBack: () => {},
});

// Custom hook to use the chat context
export const useChatContext = () => useContext(ChatContext);

export { ChatContext };
