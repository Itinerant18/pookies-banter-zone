
import { collection, doc, addDoc, updateDoc, query, where, orderBy, onSnapshot, serverTimestamp, getDocs, setDoc } from 'firebase/firestore';
import { db } from './config';

export const sendMessage = async (chatRoomId: string, senderId: string, message: string) => {
  try {
    // Add message to messages collection
    const messageData = {
      chatRoomId,
      senderId,
      message,
      timestamp: serverTimestamp(),
      status: 'sent' // Now using literal string 'sent' instead of a generic string
    };
    
    // Add the message document
    const messageRef = await addDoc(collection(db, "messages"), messageData);
    console.log("Message sent with ID:", messageRef.id);
    
    // Update chat room with last message
    await updateDoc(doc(db, "chatRooms", chatRoomId), {
      lastMessage: message,
      lastMessageTime: serverTimestamp(),
      lastMessageSenderId: senderId
    });
    
    return messageRef.id;
  } catch (error) {
    console.error("Error sending message: ", error);
    throw error;
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
          ...doc.data(),
          // Ensure status is one of the valid types
          status: doc.data().status || 'sent'
        }));
        console.log(`Initial load: Found ${messages.length} messages for room ${chatRoomId}`);
        callback(messages);
      })
      .catch((error) => {
        console.error("Error fetching initial messages:", error);
      });
    
    // Then listen for updates
    return onSnapshot(messagesQuery, (snapshot) => {
      const messages = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          // Ensure status is one of the valid types
          status: data.status || 'sent'
        };
      });
      
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
