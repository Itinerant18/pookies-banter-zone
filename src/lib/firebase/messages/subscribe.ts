import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../config';
import { Message } from './types';

export const subscribeToMessages = (chatRoomId: string, currentUserId: string, callback: (messages: Message[]) => void) => {
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
      
      const messages = snapshot.docs
        .map(doc => {
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
        })
        // Filter out messages that are deleted for the current user
        .filter(msg => {
          // If deleted for everyone, keep it (we'll display a placeholder)
          if (msg.deletedForEveryone) return true;
          
          // If deleted for this user specifically, filter it out
          const deletedForUsers = msg.deletedForUsers || [];
          return !deletedForUsers.includes(currentUserId);
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
