
import { collection, doc, addDoc, updateDoc, query, where, orderBy, onSnapshot, serverTimestamp, getDocs, setDoc, Timestamp, writeBatch } from 'firebase/firestore';
import { db } from './config';

// Define a Message type to ensure consistent handling
export interface Message {
  id?: string;
  chatRoomId: string;
  senderId: string;
  message: string;
  timestamp: any;
  status: 'sending' | 'sent' | 'delivered' | 'read';
}

export const sendMessage = async (chatRoomId: string, senderId: string, message: string) => {
  try {
    console.log(`Sending message to room ${chatRoomId} from user ${senderId}: ${message}`);
    
    // Create a timestamp on the client side for immediate use
    const clientTimestamp = new Date();
    
    // Add message to messages collection
    const messageData: Omit<Message, 'id'> = {
      chatRoomId,
      senderId,
      message,
      timestamp: serverTimestamp(), // Server timestamp for consistency
      status: 'sent' // Now using literal string 'sent' instead of a generic string
    };
    
    console.log("Message data being sent:", messageData);
    
    // Add the message document
    const messageRef = await addDoc(collection(db, "messages"), messageData);
    console.log("Message sent with ID:", messageRef.id);
    
    // Update chat room with last message
    await updateDoc(doc(db, "chatRooms", chatRoomId), {
      lastMessage: message,
      lastMessageTime: serverTimestamp(),
      lastMessageSenderId: senderId
    });
    
    // Return the message ID
    return messageRef.id;
  } catch (error) {
    console.error("Error sending message: ", error);
    throw error;
  }
};

export const updateMessageStatus = async (messageId: string, status: 'sending' | 'sent' | 'delivered' | 'read') => {
  try {
    const messageRef = doc(db, "messages", messageId);
    await updateDoc(messageRef, { status });
    console.log(`Message ${messageId} marked as ${status}`);
    return true;
  } catch (error) {
    console.error(`Error updating message ${messageId} status:`, error);
    return false;
  }
};

export const markMessagesAsRead = async (chatRoomId: string, recipientId: string) => {
  try {
    // Get all unread messages sent to this recipient
    const unreadQuery = query(
      collection(db, "messages"),
      where("chatRoomId", "==", chatRoomId),
      where("senderId", "!=", recipientId),
      where("status", "in", ["sent", "delivered"])
    );
    
    const unreadSnapshot = await getDocs(unreadQuery);
    
    if (unreadSnapshot.empty) {
      return 0;
    }
    
    // Use batch update for better performance
    const batch = writeBatch(db);
    
    unreadSnapshot.docs.forEach(doc => {
      batch.update(doc.ref, { status: "read" });
    });
    
    await batch.commit();
    console.log(`Marked ${unreadSnapshot.size} messages as read in room ${chatRoomId}`);
    
    return unreadSnapshot.size;
  } catch (error) {
    console.error("Error marking messages as read:", error);
    return 0;
  }
};

export const updateTypingStatus = async (chatRoomId: string, userId: string, isTyping: boolean) => {
  try {
    const typingRef = doc(db, "typing", `${chatRoomId}_${userId}`);
    await setDoc(typingRef, {
      chatRoomId,
      userId,
      isTyping,
      timestamp: serverTimestamp()
    });
    return true;
  } catch (error) {
    console.error("Error updating typing status: ", error);
    return false;
  }
};

export const subscribeToTypingStatus = (chatRoomId: string, userId: string, callback: (isTyping: boolean) => void) => {
  try {
    const typingRef = doc(db, "typing", `${chatRoomId}_${userId}`);
    
    return onSnapshot(typingRef, (doc) => {
      if (doc.exists()) {
        const data = doc.data();
        callback(data.isTyping === true);
      } else {
        callback(false);
      }
    });
  } catch (error) {
    console.error("Error subscribing to typing status: ", error);
    callback(false);
    return () => {};
  }
};

export const subscribeToMessages = (chatRoomId: string, callback: (messages: Message[]) => void) => {
  try {
    console.log(`Setting up subscription for chat room: ${chatRoomId}`);
    
    // Create query for messages in this chat room, ordered by timestamp
    const messagesQuery = query(
      collection(db, "messages"),
      where("chatRoomId", "==", chatRoomId),
      orderBy("timestamp", "asc")
    );
    
    // Set up the real-time listener first
    const unsubscribe = onSnapshot(messagesQuery, (snapshot) => {
      console.log(`Snapshot received: ${snapshot.docs.length} documents`);
      console.log(`Snapshot metadata: fromCache=${snapshot.metadata.fromCache}, hasPendingWrites=${snapshot.metadata.hasPendingWrites}`);
      
      // Check if the snapshot is from cache and has no pending writes
      if (snapshot.metadata.fromCache && !snapshot.metadata.hasPendingWrites) {
        console.log("Warning: Data is from cache only, might not be up-to-date");
      }
      
      const messages = snapshot.docs.map(doc => {
        const data = doc.data();
        console.log(`Message data for ${doc.id}:`, data);
        
        // Ensure status is one of the valid types
        let status: 'sending' | 'sent' | 'delivered' | 'read' = 'sent';
        if (data.status && ['sending', 'sent', 'delivered', 'read'].includes(data.status)) {
          status = data.status as 'sending' | 'sent' | 'delivered' | 'read';
        }
        
        return {
          id: doc.id,
          ...data,
          status
        } as Message;
      });
      
      console.log(`Live update: Received ${messages.length} messages for room ${chatRoomId}`);
      console.log("Live message data:", messages);
      callback(messages);
    }, (error) => {
      console.error("Error in messages subscription:", error);
      
      // Check if the error is related to missing index
      if (error.code === 'failed-precondition' && error.message.includes('index')) {
        const indexUrl = error.message.match(/https:\/\/console\.firebase\.google\.com\/[^\s]+/)?.[0];
        
        console.error(`
          Firestore index required. Please create the index by:
          1. Going to: ${indexUrl || 'your Firebase Console > Firestore > Indexes'}
          2. Click "Create Index" if redirected to the index creation page
          3. Otherwise, add a composite index for:
             - Collection: messages
             - Fields to index: chatRoomId (Ascending), timestamp (Ascending)
        `);
      } else {
        // For other errors, still provide empty array but log the full error
        console.error("Detailed error in messages subscription:", error);
      }
      
      // Return empty array as a fallback
      callback([]);
    });
    
    return unsubscribe;
  } catch (error) {
    console.error("Error setting up message subscription:", error);
    // Return a no-op unsubscribe function
    return () => {};
  }
};
