
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../config';

export const isUsernameAvailable = async (username: string, currentUserId?: string): Promise<boolean> => {
  try {
    if (!username) return false;
    
    // Basic validation
    if (username.length < 3 || username.length > 30) {
      return false;
    }
    
    // Check if username contains only allowed characters: letters, numbers, underscores
    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      return false;
    }
    
    const usersRef = collection(db, "users");
    const usernameQuery = query(usersRef, where("username", "==", username));
    const snapshot = await getDocs(usernameQuery);
    
    if (snapshot.empty) {
      return true; // Username is available
    }
    
    // If there's a match but it's the current user, username is still available
    if (currentUserId && snapshot.docs.length === 1) {
      return snapshot.docs[0].id === currentUserId;
    }
    
    return false; // Username is taken
  } catch (error) {
    console.error("Error checking username availability: ", error);
    throw error;
  }
};
