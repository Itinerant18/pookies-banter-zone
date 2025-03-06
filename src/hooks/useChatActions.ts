
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, findRandomUser, createChatRoom, sendMessage } from '@/lib/firebase';
import { useToast } from '@/components/ui/use-toast';

export function useChatActions(
  setFinding: (finding: boolean) => void,
  setError: (error: string | null) => void,
  setMatchedUser: (user: any) => void,
  setChatRoomId: (id: string | null) => void,
  setMessages: (messages: any[]) => void,
  setIndexingError: (error: boolean) => void,
  setIsRecipientTyping: (typing: boolean) => void,
  setUserListMode: (mode: boolean) => void
) {
  const [user] = useAuthState(auth);
  const { toast } = useToast();

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
    if (!user || !user.uid || !setChatRoomId) return;
    const chatId = setChatRoomId;
    
    try {
      console.log("Sending message:", message);
      const messageId = await sendMessage(chatId, user.uid, message);
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

  return {
    user,
    selectUser,
    findRandomMatch,
    handleSendMessage,
  };
}
