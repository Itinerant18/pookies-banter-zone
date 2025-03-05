
import { collection, doc, addDoc, updateDoc, query, where, orderBy, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { db } from './config';

export const sendMessage = async (chatRoomId: string, senderId: string, message: string) => {
  try {
    // Add message to messages collection
    const messageData = {
      chatRoomId,
      senderId,
      message,
      timestamp: serverTimestamp()
    };
    
    await addDoc(collection(db, "messages"), messageData);
    
    // Update chat room with last message
    await updateDoc(doc(db, "chatRooms", chatRoomId), {
      lastMessage: message,
      lastMessageTime: serverTimestamp()
    });
  } catch (error) {
    console.error("Error sending message: ", error);
    throw error;
  }
};

export const subscribeToMessages = (chatRoomId: string, callback: (messages: any[]) => void) => {
  try {
    // Create query for messages in this chat room, ordered by timestamp
    const messagesQuery = query(
      collection(db, "messages"),
      where("chatRoomId", "==", chatRoomId),
      orderBy("timestamp", "asc")
    );
    
    // Listen for updates
    return onSnapshot(messagesQuery, (snapshot) => {
      const messages = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
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
        
        // Return empty array temporarily while index is being created
        callback([]);
      } else {
        // For other errors, still provide empty array but log the full error
        console.error("Detailed error in messages subscription:", error);
        callback([]);
      }
    });
  } catch (error) {
    console.error("Error setting up message subscription:", error);
    // Return a no-op unsubscribe function
    return () => {};
  }
};
