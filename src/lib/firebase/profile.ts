
import { User, updateProfile } from 'firebase/auth';
import { doc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from './config';

export const updateUserProfile = async (user: User, data: { displayName?: string, photoURL?: string }) => {
  try {
    // Update auth profile
    await updateProfile(user, data);
    
    // Update firestore profile
    const updateData: any = {};
    if (data.displayName) updateData.name = data.displayName;
    if (data.photoURL) updateData.photoURL = data.photoURL;
    
    await updateDoc(doc(db, "users", user.uid), updateData);
  } catch (error) {
    console.error("Error updating profile: ", error);
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
