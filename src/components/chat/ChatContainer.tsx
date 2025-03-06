
import React from 'react';
import { useChatContext } from './ChatContext';
import FindingMatch from './FindingMatch';
import ErrorState from './ErrorState';
import EmptyState from './EmptyState';
import ChatContent from './ChatContent';
import UsersList from './UsersList';

const ChatContainer: React.FC = () => {
  const { 
    finding, 
    error, 
    matchedUser,
    findRandomMatch,
    selectUser,
    userListMode
  } = useChatContext();

  // Render the appropriate component based on state
  if (finding) {
    return <FindingMatch />;
  }
  
  if (error) {
    return <ErrorState error={error} onRetry={findRandomMatch} />;
  }
  
  if (userListMode) {
    return <UsersList onSelectUser={selectUser} />;
  }
  
  if (!matchedUser) {
    return <EmptyState onFindMatch={findRandomMatch} />;
  }
  
  return <ChatContent />;
};

export default ChatContainer;
