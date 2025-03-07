
import { doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../config';

/**
 * Updates the user's online status in Firestore
 * @param userId User ID
 * @param status 'online' or 'offline'
 */
export const updateUserStatus = async (userId: string, status: 'online' | 'offline'): Promise<void> => {
  try {
    await updateDoc(doc(db, "users", userId), {
      status,
      lastActive: serverTimestamp()
    });
  } catch (error) {
    console.error(`Error updating user status to ${status}:`, error);
    throw error;
  }
};

/**
 * Sets the current user as online
 */
export const setUserOnline = async (): Promise<void> => {
  const user = auth.currentUser;
  if (user) {
    await updateUserStatus(user.uid, 'online');
  }
};

/**
 * Sets the current user as offline
 */
export const setUserOffline = async (): Promise<void> => {
  const user = auth.currentUser;
  if (user) {
    await updateUserStatus(user.uid, 'offline');
  }
};

