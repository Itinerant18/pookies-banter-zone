
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../config';
import { UserProfile } from './types';

export const getUserProfile = async (userId: string): Promise<UserProfile | null> => {
  try {
    const userDoc = await getDoc(doc(db, "users", userId));
    
    if (userDoc.exists()) {
      return userDoc.data() as UserProfile;
    }
    
    return null;
  } catch (error) {
    console.error("Error fetching user profile: ", error);
    throw error;
  }
};
