
import { collection, doc, addDoc, updateDoc, query, where, orderBy, onSnapshot, serverTimestamp, getDocs } from 'firebase/firestore';
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
    
    // Add the message document
    const messageRef = await addDoc(collection(db, "messages"), messageData);
    console.log("Message sent with ID:", messageRef.id);
    
    // Update chat room with last message
    await updateDoc(doc(db, "chatRooms", chatRoomId), {
      lastMessage: message,
      lastMessageTime: serverTimestamp()
    });
    
    return messageRef.id;
  } catch (error) {
    console.error("Error sending message: ", error);
    throw error;
  }
};

export const subscribeToMessages = (chatRoomId: string, callback: (messages: any[]) => void) => {
  try {
    console.log(`Setting up subscription for chat room: ${chatRoomId}`);
    
    // Create query for messages in this chat room, ordered by timestamp
    const messagesQuery = query(
      collection(db, "messages"),
      where("chatRoomId", "==", chatRoomId),
      orderBy("timestamp", "asc")
    );
    
    // First get existing messages once
    getDocs(messagesQuery)
      .then((snapshot) => {
        const messages = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        console.log(`Initial load: Found ${messages.length} messages for room ${chatRoomId}`);
        callback(messages);
      })
      .catch((error) => {
        console.error("Error fetching initial messages:", error);
      });
    
    // Then listen for updates
    return onSnapshot(messagesQuery, (snapshot) => {
      const messages = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      console.log(`Live update: Received ${messages.length} messages for room ${chatRoomId}`);
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
