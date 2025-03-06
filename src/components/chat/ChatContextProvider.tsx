
import React from 'react';
import { ChatContext } from '@/contexts/ChatContext';
import { useChatState } from '@/hooks/useChatState';
import { useChatActions } from '@/hooks/useChatActions';
import { useChatSubscriptions } from '@/hooks/useChatSubscriptions';

export const ChatContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const {
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
    showUserList,
    goBack
  } = useChatState();

  const {
    user,
    selectUser,
    findRandomMatch,
    handleSendMessage,
  } = useChatActions(
    setFinding,
    setError,
    setMatchedUser,
    setChatRoomId,
    setMessages,
    setIndexingError,
    setIsRecipientTyping,
    setUserListMode,
    chatRoomId // Pass chatRoomId value to useChatActions
  );

  const {
    handleTypingStatus
  } = useChatSubscriptions(
    chatRoomId,
    matchedUser,
    user,
    indexingError,
    setMessages,
    setIndexingError,
    setIsRecipientTyping
  );

  // Context value
  const contextValue = {
    user,
    matchedUser,
    finding,
    error,
    chatRoomId,
    messages,
    indexingError,
    isRecipientTyping,
    userListMode,
    findRandomMatch,
    handleSendMessage,
    handleTypingStatus,
    selectUser,
    showUserList,
    goBack,
  };

  return (
    <ChatContext.Provider value={contextValue}>
      {children}
    </ChatContext.Provider>
  );
};

export default ChatContextProvider;
