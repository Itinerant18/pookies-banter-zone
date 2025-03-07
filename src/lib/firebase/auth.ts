
import { 
  GoogleAuthProvider, 
  signInWithPopup, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  updateProfile,
  browserSessionPersistence,
  browserLocalPersistence,
  setPersistence
} from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp, query, collection, where, getDocs } from 'firebase/firestore';
import { auth, db } from './config';
import { isUsernameAvailable, setUserOnline, setUserOffline } from './profile';

const googleProvider = new GoogleAuthProvider();

/**
 * Sets the persistence mode for Firebase Auth
 * @param rememberMe Whether to persist the session beyond a browser restart
 */
export const setAuthPersistence = async (rememberMe: boolean = true) => {
  try {
    const persistenceType = rememberMe ? browserLocalPersistence : browserSessionPersistence;
    await setPersistence(auth, persistenceType);
  } catch (error) {
    console.error("Error setting auth persistence:", error);
    // Don't throw here - this is a non-critical operation
  }
};

export const signInWithGoogle = async (rememberMe: boolean = true) => {
  try {
    // Set persistence before login
    await setAuthPersistence(rememberMe);
    
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
        lastActive: serverTimestamp(),
        status: "online"
      });
    } else {
      // Update user status using our new utility
      await setUserOnline();
    }
    
    return user;
  } catch (error) {
    console.error("Error signing in with Google: ", error);
    throw error;
  }
};

export const registerWithEmail = async (email: string, password: string, displayName: string, rememberMe: boolean = true) => {
  try {
    // Set persistence before registration
    await setAuthPersistence(rememberMe);
    
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
      lastActive: serverTimestamp(),
      status: "online"
    });
    
    return user;
  } catch (error) {
    console.error("Error registering with email: ", error);
    throw error;
  }
};

export const loginWithEmail = async (email: string, password: string, rememberMe: boolean = true) => {
  try {
    // Set persistence before login
    await setAuthPersistence(rememberMe);
    
    const result = await signInWithEmailAndPassword(auth, email, password);
    const user = result.user;
    
    // Update user status using our new utility
    await setUserOnline();
    
    return user;
  } catch (error) {
    console.error("Error logging in with email: ", error);
    throw error;
  }
};

export const logoutUser = async () => {
  try {
    // Update status before signing out
    await setUserOffline();
    
    // Sign out after status update
    await signOut(auth);
    
    return true;
  } catch (error) {
    console.error("Error signing out: ", error);
    throw error;
  }
};

