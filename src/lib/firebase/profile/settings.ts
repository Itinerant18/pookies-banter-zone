
import { User } from 'firebase/auth';
import { doc, getDoc, updateDoc, setDoc } from 'firebase/firestore';
import { db } from '../config';

export const updateUserSettings = async (user: User, settings: {
  notificationsEnabled?: boolean;
  darkModeEnabled?: boolean;
}) => {
  try {
    console.log("Updating user settings:", settings);
    
    const userDoc = await getDoc(doc(db, "users", user.uid));
    
    if (userDoc.exists()) {
      await updateDoc(doc(db, "users", user.uid), {
        ...settings
      });
    } else {
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        ...settings,
        createdAt: new Date()
      });
    }
    
    console.log("User settings updated successfully");
    return true;
  } catch (error) {
    console.error("Error updating user settings: ", error);
    throw error;
  }
};
