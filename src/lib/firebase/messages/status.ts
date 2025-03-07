
import { doc, updateDoc, query, collection, where, getDocs, writeBatch } from 'firebase/firestore';
import { db } from '../config';
import { MessageStatus } from './types';

export const updateMessageStatus = async (messageId: string, status: MessageStatus) => {
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
