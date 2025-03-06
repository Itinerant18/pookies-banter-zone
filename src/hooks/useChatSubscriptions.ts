
import { useEffect } from 'react';
import { subscribeToMessages, updateTypingStatus, subscribeToTypingStatus } from '@/lib/firebase';

export function useChatSubscriptions(
  chatRoomId: string | null,
  matchedUser: any,
  user: any,
  indexingError: boolean,
  setMessages: (messages: any[]) => void,
  setIndexingError: (error: boolean) => void,
  setIsRecipientTyping: (typing: boolean) => void
) {
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
  }, [chatRoomId, indexingError, setMessages, setIndexingError]);

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
  }, [chatRoomId, matchedUser, setIsRecipientTyping]);

  return {
    handleTypingStatus
  };
}
