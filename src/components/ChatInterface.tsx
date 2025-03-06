
import React from 'react';
import ChatContextProvider from './chat/ChatContextProvider';
import ChatContainer from './chat/ChatContainer';

const ChatInterface: React.FC = () => {
  return (
    <ChatContextProvider>
      <div className="w-full max-w-4xl mx-auto pt-6 pb-20 animate-fade-in">
        <ChatContainer />
      </div>
    </ChatContextProvider>
  );
};

export default ChatInterface;
