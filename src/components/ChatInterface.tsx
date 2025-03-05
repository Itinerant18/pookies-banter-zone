
import React, { useState, useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db, findRandomUser, createChatRoom, sendMessage, subscribeToMessages } from '@/lib/firebase';
import { Card } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';

// Import our new components
import MessageList from './chat/MessageList';
import MessageInput from './chat/MessageInput';
import UserCard from './chat/UserCard';
import FindingMatch from './chat/FindingMatch';
import ErrorState from './chat/ErrorState';
import EmptyState from './chat/EmptyState';

const ChatInterface: React.FC = () => {
  const [user] = useAuthState(auth);
  const [matchedUser, setMatchedUser] = useState<any>(null);
  const [finding, setFinding] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [chatRoomId, setChatRoomId] = useState<string | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const { toast } = useToast();

  // Find a random user to chat with
  const findRandomMatch = async () => {
    if (!user) return;
    
    try {
      setFinding(true);
      setError(null);
      setMatchedUser(null);
      setChatRoomId(null);
      setMessages([]);
      
      // Find a random user
      const randomUser = await findRandomUser(user.uid);
      
      if (!randomUser) {
        toast({
          title: 'No users available',
          description: 'Please wait for more users to join, or invite friends to create an account!',
          variant: 'destructive',
        });
        setError('No users available. Try again later when more users are online.');
        return;
      }
      
      toast({
        title: 'Match found!',
        description: `You're now chatting with ${randomUser.name || 'Anonymous'}`,
        variant: 'default',
      });
      
      // Create a chat room
      const roomId = await createChatRoom(user.uid, randomUser.uid);
      
      setMatchedUser(randomUser);
      setChatRoomId(roomId);
    } catch (error: any) {
      console.error('Error finding match:', error);
      setError(error.message || 'Error finding match. Please try again later.');
      toast({
        title: 'Error finding match',
        description: 'Please check the Firebase rules or try again later',
        variant: 'destructive',
      });
    } finally {
      setFinding(false);
    }
  };

  // Subscribe to messages when chat room changes
  useEffect(() => {
    if (!chatRoomId) return;
    
    const unsubscribe = subscribeToMessages(chatRoomId, (newMessages) => {
      setMessages(newMessages);
    });
    
    return () => unsubscribe();
  }, [chatRoomId]);

  // Find a match on first load
  useEffect(() => {
    if (user) {
      findRandomMatch();
    }
  }, [user]);

  // Handle sending a message
  const handleSendMessage = async (message: string) => {
    if (!user || !chatRoomId) return;
    
    try {
      await sendMessage(chatRoomId, user.uid, message);
    } catch (error: any) {
      console.error('Error sending message:', error);
      toast({
        title: 'Error sending message',
        description: error.message || 'Please try again',
        variant: 'destructive',
      });
      throw error; // Propagate error to MessageInput component
    }
  };

  // Render the appropriate component based on state
  const renderContent = () => {
    if (finding) {
      return <FindingMatch />;
    }
    
    if (error) {
      return <ErrorState error={error} onRetry={findRandomMatch} />;
    }
    
    if (!matchedUser) {
      return <EmptyState onFindMatch={findRandomMatch} />;
    }
    
    return (
      <div className="flex flex-col space-y-4">
        <UserCard 
          user={matchedUser} 
          onNewChat={findRandomMatch} 
          disabled={finding} 
        />

        <Card className="glass-card overflow-hidden">
          <MessageList messages={messages} />
        </Card>

        <MessageInput 
          onSendMessage={handleSendMessage} 
          disabled={!chatRoomId} 
        />
      </div>
    );
  };

  return (
    <div className="w-full max-w-4xl mx-auto pt-6 pb-20 animate-fade-in">
      {renderContent()}
    </div>
  );
};

export default ChatInterface;
