
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, findRandomUser, createChatRoom, subscribeToMessages, updateTypingStatus, subscribeToTypingStatus } from '@/lib/firebase';
import { sendMessage } from '@/lib/firebase/messages';
import { useToast } from '@/components/ui/use-toast';
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

export const ChatContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user] = useAuthState(auth);
  const [matchedUser, setMatchedUser] = useState<any>(null);
  const [finding, setFinding] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [chatRoomId, setChatRoomId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [indexingError, setIndexingError] = useState<boolean>(false);
  const [isRecipientTyping, setIsRecipientTyping] = useState(false);
  const [userListMode, setUserListMode] = useState(false);
  const { toast } = useToast();
  
  // Show user list for direct messaging
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
  
  // Go back to empty state
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
  
  // Select a specific user to chat with
  const selectUser = async (selectedUser: any) => {
    if (!user) return;
    
    try {
      setFinding(true);
      setUserListMode(false);
      setError(null);
      
      console.log("Starting chat with user:", selectedUser);
      
      toast({
        title: 'Starting chat',
        description: `You're now chatting with ${selectedUser.name || 'Anonymous'}`,
      });
      
      // Create a chat room
      const roomId = await createChatRoom(user.uid, selectedUser.uid);
      console.log("Chat room created with ID:", roomId);
      
      setMatchedUser(selectedUser);
      setChatRoomId(roomId);
    } catch (error: any) {
      console.error('Error selecting user:', error);
      let errorMessage = error.message || 'Unknown error occurred';
      
      console.log("Detailed error:", JSON.stringify(error));
      setError(errorMessage);
      toast({
        title: 'Error starting chat',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setFinding(false);
    }
  };

  // Find a random user to chat with
  const findRandomMatch = async () => {
    if (!user) return;
    
    try {
      setFinding(true);
      setError(null);
      setMatchedUser(null);
      setChatRoomId(null);
      setMessages([]);
      setIndexingError(false);
      setIsRecipientTyping(false);
      setUserListMode(false);
      
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
      } else if (errorMessage.includes('failed-precondition') && errorMessage.includes('index')) {
        errorMessage = 'Firestore requires an index for this query. Please check the console for a link to create it.';
        setIndexingError(true);
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

  // Handle sending a message
  const handleSendMessage = async (message: string) => {
    if (!user || !chatRoomId) return;
    
    try {
      console.log("Sending message:", message);
      const messageId = await sendMessage(chatRoomId, user.uid, message);
      console.log("Message sent with ID:", messageId);
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

  // Handle typing status
  const handleTypingStatus = async (isTyping: boolean) => {
    if (!user || !chatRoomId) return;
    
    try {
      await updateTypingStatus(chatRoomId, user.uid, isTyping);
    } catch (error) {
      console.error('Error updating typing status:', error);
      // Don't show a toast for typing errors as it's not critical
    }
  };

  // Subscribe to messages when chat room changes
  useEffect(() => {
    if (!chatRoomId) return;
    
    console.log("Subscribing to messages in room:", chatRoomId);
    
    // Add a delay to ensure Firestore has time to process the chat room creation
    const timer = setTimeout(() => {
      const unsubscribe = subscribeToMessages(chatRoomId, (newMessages) => {
        console.log("Message update received, count:", newMessages.length);
        
        // Check if we have any messages with null or undefined timestamp
        const hasInvalidMessages = newMessages.some(msg => !msg.timestamp);
        if (hasInvalidMessages) {
          console.warn("Some messages have invalid timestamps:", 
            newMessages.filter(msg => !msg.timestamp));
        }
        
        // Use direct assignment instead of functional update to ensure we always get fresh data
        setMessages(newMessages);
        
        // If we received messages successfully, clear any indexing error
        if (indexingError && newMessages.length > 0) {
          setIndexingError(false);
        }
      });
      
      return () => {
        console.log("Unsubscribing from messages");
        unsubscribe();
      };
    }, 1000); // 1 second delay
    
    return () => {
      clearTimeout(timer);
    };
  }, [chatRoomId, indexingError]);

  // Subscribe to typing status
  useEffect(() => {
    if (!chatRoomId || !matchedUser) return;
    
    console.log("Subscribing to typing status in room:", chatRoomId);
    const unsubscribe = subscribeToTypingStatus(chatRoomId, matchedUser.uid, (isTyping) => {
      console.log("Typing status update:", isTyping);
      setIsRecipientTyping(isTyping);
    });
    
    return () => {
      console.log("Unsubscribing from typing status");
      unsubscribe();
    };
  }, [chatRoomId, matchedUser]);

  // Context value
  const contextValue: ChatContextType = {
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
