
import { 
  GoogleAuthProvider, 
  signInWithPopup, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  updateProfile
} from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc, serverTimestamp, query, collection, where, getDocs } from 'firebase/firestore';
import { auth, db } from './config';
import { isUsernameAvailable } from './profile';

const googleProvider = new GoogleAuthProvider();

export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    
    // Check if user exists in users collection
    const userDoc = await getDoc(doc(db, "users", user.uid));
    
    if (!userDoc.exists()) {
      // Create user document if doesn't exist
      // Generate a default username based on their name or email
      let defaultUsername = '';
      if (user.displayName) {
        defaultUsername = user.displayName.toLowerCase().replace(/\s+/g, '_');
      } else if (user.email) {
        defaultUsername = user.email.split('@')[0];
      }
      
      // Make sure username is unique
      let username = defaultUsername;
      let count = 1;
      let isAvailable = await isUsernameAvailable(username);
      
      while (!isAvailable && count < 100) {
        username = `${defaultUsername}${count}`;
        isAvailable = await isUsernameAvailable(username);
        count++;
      }
      
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        name: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
        username: isAvailable ? username : null, // Set username if available, otherwise null
        createdAt: serverTimestamp(),
        status: "online"
      });
    } else {
      // Update user status
      await updateDoc(doc(db, "users", user.uid), {
        status: "online"
      });
    }
    
    return user;
  } catch (error) {
    console.error("Error signing in with Google: ", error);
    throw error;
  }
};

export const registerWithEmail = async (email: string, password: string, displayName: string) => {
  try {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    const user = result.user;
    
    // Update profile with display name
    await updateProfile(user, { displayName });
    
    // Generate default username from display name
    const defaultUsername = displayName.toLowerCase().replace(/\s+/g, '_');
    
    // Make sure username is unique
    let username = defaultUsername;
    let count = 1;
    let isAvailable = await isUsernameAvailable(username);
    
    while (!isAvailable && count < 100) {
      username = `${defaultUsername}${count}`;
      isAvailable = await isUsernameAvailable(username);
      count++;
    }
    
    // Create user document
    await setDoc(doc(db, "users", user.uid), {
      uid: user.uid,
      name: displayName,
      email: user.email,
      photoURL: null,
      username: isAvailable ? username : null, // Set username if available, otherwise null
      createdAt: serverTimestamp(),
      status: "online"
    });
    
    return user;
  } catch (error) {
    console.error("Error registering with email: ", error);
    throw error;
  }
};

export const loginWithEmail = async (email: string, password: string) => {
  try {
    const result = await signInWithEmailAndPassword(auth, email, password);
    const user = result.user;
    

    await updateDoc(doc(db, "users", user.uid), {
      status: "online"
    });
    
    return user;
  } catch (error) {
    console.error("Error logging in with email: ", error);
    throw error;
  }
};

export const logoutUser = async () => {
  try {
    const user = auth.currentUser;
    
    if (user) {

      await updateDoc(doc(db, "users", user.uid), {
        status: "offline"
      });
    }
    
    await signOut(auth);
  } catch (error) {
    console.error("Error signing out: ", error);
    throw error;
  }
};
