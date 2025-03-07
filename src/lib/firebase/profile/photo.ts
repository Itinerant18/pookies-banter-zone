
import { User } from 'firebase/auth';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from '../config';
import { updateUserProfile } from './update';

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
