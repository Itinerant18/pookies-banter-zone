
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
      
      console.log("Starting to find a match...");
      console.log("Current user ID:", user.uid);
      
      // Check if user exists in Firestore
      try {
        // Find a random user
        const randomUser = await findRandomUser(user.uid);
        
        if (!randomUser) {
          console.log("No users available");
          toast({
            title: 'No users available',
            description: 'Please wait for more users to join, or invite friends to create an account!',
            variant: 'destructive',
          });
          setError('No users available. Try again later when more users are online.');
          return;
        }
        
        console.log("Match found:", randomUser);
        toast({
          title: 'Match found!',
          description: `You're now chatting with ${randomUser.name || 'Anonymous'}`,
          variant: 'default',
        });
        
        // Create a chat room
        const roomId = await createChatRoom(user.uid, randomUser.uid);
        console.log("Chat room created with ID:", roomId);
        
        setMatchedUser(randomUser);
        setChatRoomId(roomId);
      } catch (innerError: any) {
        console.error('Inner error during matching:', innerError);
        throw innerError;
      }
    } catch (error: any) {
      console.error('Error finding match:', error);
      let errorMessage = error.message || 'Unknown error occurred';
      
      // More specific error messages
      if (errorMessage.includes('permission-denied')) {
        errorMessage = 'Firebase permission denied. Please check that you\'ve updated the Firestore rules correctly and try again.';
      } else if (errorMessage.includes('not-found')) {
        errorMessage = 'User document not found. Please make sure your user account is correctly set up.';
      }
      
      console.log("Detailed error:", JSON.stringify(error));
      setError(errorMessage);
      toast({
        title: 'Error finding match',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setFinding(false);
    }
  };

  // Subscribe to messages when chat room changes
  useEffect(() => {
    if (!chatRoomId) return;
    
    console.log("Subscribing to messages in room:", chatRoomId);
    const unsubscribe = subscribeToMessages(chatRoomId, (newMessages) => {
      setMessages(newMessages);
      console.log("New messages:", newMessages.length);
    });
    
    return () => {
      console.log("Unsubscribing from messages");
      unsubscribe();
    };
  }, [chatRoomId]);

  // Find a match on first load
  useEffect(() => {
    if (user) {
      console.log("User authenticated, finding initial match");
      findRandomMatch();
    }
  }, [user]);

  // Handle sending a message
  const handleSendMessage = async (message: string) => {
    if (!user || !chatRoomId) return;
    
    try {
      console.log("Sending message:", message);
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
