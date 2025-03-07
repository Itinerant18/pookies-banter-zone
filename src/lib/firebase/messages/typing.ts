
import { doc, setDoc, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { db } from '../config';

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
