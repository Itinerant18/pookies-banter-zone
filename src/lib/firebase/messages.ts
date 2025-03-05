
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
  });
};
