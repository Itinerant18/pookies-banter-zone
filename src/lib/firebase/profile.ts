
import { User, updateProfile } from 'firebase/auth';
import { doc, getDoc, updateDoc, setDoc, query, collection, where, getDocs } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage } from './config';

export interface UserProfile {
  name?: string;
  photoURL?: string | null;
  age?: number;
  gender?: string;
  bio?: string;
  interests?: string[];
  notificationsEnabled?: boolean;
  darkModeEnabled?: boolean;
  username?: string;
}

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

export const updateUserProfile = async (user: User, data: { displayName?: string, photoURL?: string | null }) => {
  try {
    console.log("Updating auth profile with:", data);

    await updateProfile(user, data);
    

    const updateData: any = {};
    if (data.displayName) updateData.name = data.displayName;
    if (data.photoURL !== undefined) updateData.photoURL = data.photoURL;
    
    console.log("Updating Firestore profile with:", updateData);
    await updateDoc(doc(db, "users", user.uid), updateData);
    
    console.log("Profile updated successfully");
  } catch (error) {
    console.error("Error updating profile: ", error);
    throw error;
  }
};

export const updateCompleteUserProfile = async (user: User, profileData: UserProfile) => {
  try {
    console.log("Updating complete profile with data:", profileData);
    

    if (profileData.username) {
      const isAvailable = await isUsernameAvailable(profileData.username, user.uid);
      if (!isAvailable) {
        throw new Error("Username is already taken or invalid");
      }
    }
    

    const userDoc = await getDoc(doc(db, "users", user.uid));
    
    if (userDoc.exists()) {

      await updateDoc(doc(db, "users", user.uid), {
        ...profileData
      });
    } else {

      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        ...profileData,
        createdAt: new Date()
      });
    }
    
    // If there's a name change, update auth profile as well
    if (profileData.name && profileData.name !== user.displayName) {
      await updateProfile(user, {
        displayName: profileData.name
      });
    }
    
    console.log("Complete profile updated successfully");
    return true;
  } catch (error) {
    console.error("Error updating complete profile: ", error);
    throw error;
  }
};

export const uploadUserPhoto = async (user: User, file: File) => {
  try {
    const storageRef = ref(storage, `profile_photos/${user.uid}`);
    await uploadBytes(storageRef, file);
    
    const photoURL = await getDownloadURL(storageRef);
    
    // Update profile with new photo URL
    await updateUserProfile(user, { photoURL });
    
    return photoURL;
  } catch (error) {
    console.error("Error uploading photo: ", error);
    throw error;
  }
};

export const deleteUserPhoto = async (user: User) => {
  try {
    const storageRef = ref(storage, `profile_photos/${user.uid}`);
    
    // Delete from storage
    try {
      await deleteObject(storageRef);
    } catch (error) {
      console.warn("Photo might not exist in storage", error);
    }
    
    // Remove photo URL from profile
    await updateUserProfile(user, { photoURL: null });
    
    return true;
  } catch (error) {
    console.error("Error deleting photo: ", error);
    throw error;
  }
};

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
