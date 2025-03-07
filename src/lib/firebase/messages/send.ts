
import { collection, doc, addDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../config';
import { Message } from './types';

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
