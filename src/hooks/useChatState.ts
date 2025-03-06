
import { useState } from 'react';
import { Message } from '@/lib/firebase/messages';

export function useChatState() {
  const [matchedUser, setMatchedUser] = useState<any>(null);
  const [finding, setFinding] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [chatRoomId, setChatRoomId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [indexingError, setIndexingError] = useState<boolean>(false);
  const [isRecipientTyping, setIsRecipientTyping] = useState(false);
  const [userListMode, setUserListMode] = useState(false);

  // UI state actions
  const showUserList = () => {
    setUserListMode(true);
    setMatchedUser(null);
    setChatRoomId(null);
    setMessages([]);
    setError(null);
    setFinding(false);
    setIndexingError(false);
    setIsRecipientTyping(false);
  };
  
  const goBack = () => {
    setUserListMode(false);
    setMatchedUser(null);
    setChatRoomId(null);
    setMessages([]);
    setError(null);
    setFinding(false);
    setIndexingError(false);
    setIsRecipientTyping(false);
  };

  return {
    // State
    matchedUser,
    setMatchedUser,
    finding,
    setFinding,
    error,
    setError,
    chatRoomId,
    setChatRoomId,
    messages,
    setMessages,
    indexingError,
    setIndexingError,
    isRecipientTyping,
    setIsRecipientTyping,
    userListMode,
    setUserListMode,
    
    // Actions
    showUserList,
    goBack
  };
}
