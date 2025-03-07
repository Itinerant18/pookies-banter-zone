
import { doc, updateDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../config';

// Time window in milliseconds (48 hours = 48 * 60 * 60 * 1000)
const DELETE_FOR_EVERYONE_TIME_WINDOW = 48 * 60 * 60 * 1000;

/**
 * Delete a message for the current user only
 */
export const deleteMessageForMe = async (messageId: string, userId: string) => {
  try {
    const messageRef = doc(db, "messages", messageId);
    const messageDoc = await getDoc(messageRef);
    
    if (!messageDoc.exists()) {
      throw new Error("Message not found");
    }
    
    const messageData = messageDoc.data();
    const deletedForUsers = messageData.deletedForUsers || [];
    
    // If not already deleted for this user
    if (!deletedForUsers.includes(userId)) {
      await updateDoc(messageRef, {
        deletedForUsers: [...deletedForUsers, userId]
      });
    }
    
    return true;
  } catch (error) {
    console.error("Error deleting message for user:", error);
    throw error;
  }
};

/**
 * Delete a message for everyone in the chat
 */
export const deleteMessageForEveryone = async (messageId: string, userId: string) => {
  try {
    const messageRef = doc(db, "messages", messageId);
    const messageDoc = await getDoc(messageRef);
    
    if (!messageDoc.exists()) {
      throw new Error("Message not found");
    }
    
    const messageData = messageDoc.data();
    
    // Check if the user is the sender
    if (messageData.senderId !== userId) {
      throw new Error("Only the sender can delete messages for everyone");
    }
    
    // Check if the message is within the time window
    const messageTime = messageData.timestamp.toDate();
    const currentTime = new Date();
    const timeDifference = currentTime.getTime() - messageTime.getTime();
    
    if (timeDifference > DELETE_FOR_EVERYONE_TIME_WINDOW) {
      throw new Error("Messages can only be deleted for everyone within 48 hours");
    }
    
    // Update the message
    await updateDoc(messageRef, {
      deletedForEveryone: true,
      deletedAt: serverTimestamp()
    });
    
    return true;
  } catch (error) {
    console.error("Error deleting message for everyone:", error);
    throw error;
  }
};

/**
 * Check if message deletion for everyone is allowed
 */
export const canDeleteForEveryone = (message: any, userId: string): boolean => {
  if (!message || !message.timestamp) return false;
  
  // Only the sender can delete for everyone
  if (message.senderId !== userId) return false;
  
  // Check time window
  const messageTime = message.timestamp.toDate();
  const currentTime = new Date();
  const timeDifference = currentTime.getTime() - messageTime.getTime();
  
  return timeDifference <= DELETE_FOR_EVERYONE_TIME_WINDOW;
};
