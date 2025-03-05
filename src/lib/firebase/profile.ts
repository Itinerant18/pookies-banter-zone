
import { User, updateProfile } from 'firebase/auth';
import { doc, getDoc, updateDoc, setDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage } from './config';

export interface UserProfile {
  name?: string;
  photoURL?: string | null;
  age?: number;
  gender?: string;
  bio?: string;
  interests?: string[];
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

export const updateUserProfile = async (user: User, data: { displayName?: string, photoURL?: string | null }) => {
  try {
    // Update auth profile
    await updateProfile(user, data);
    
    // Update firestore profile
    const updateData: any = {};
    if (data.displayName) updateData.name = data.displayName;
    if (data.photoURL !== undefined) updateData.photoURL = data.photoURL;
    
    await updateDoc(doc(db, "users", user.uid), updateData);
  } catch (error) {
    console.error("Error updating profile: ", error);
    throw error;
  }
};

export const updateCompleteUserProfile = async (user: User, profileData: UserProfile) => {
  try {
    // Update firestore profile with all fields
    await updateDoc(doc(db, "users", user.uid), {
      ...profileData
    });
    
    // If there's a name change, update auth profile as well
    if (profileData.name && profileData.name !== user.displayName) {
      await updateProfile(user, {
        displayName: profileData.name
      });
    }
    
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
