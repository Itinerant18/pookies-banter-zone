
import { User, updateProfile } from 'firebase/auth';
import { doc, getDoc, updateDoc, setDoc } from 'firebase/firestore';
import { db } from '../config';
import { UserProfile } from './types';
import { isUsernameAvailable } from './username';

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
