
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithPopup, GoogleAuthProvider, createUserWithEmailAndPassword, signInWithEmailAndPassword as signInWithEmail, signOut, updateProfile, User } from 'firebase/auth';
import { getFirestore, collection, doc, setDoc, getDoc, getDocs, query, where, onSnapshot, addDoc, updateDoc, serverTimestamp, orderBy, limit } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

// Firebase configuration - updated with valid config
const firebaseConfig = {
  apiKey: "AIzaSyCLP5GN7OR14sz0FdRNxjEe2XdfzHfmIV8",
  authDomain: "dating-a8002.firebaseapp.com",
  projectId: "dating-a8002",
  storageBucket: "dating-a8002.appspot.com", // Fixed storage bucket URL
  messagingSenderId: "291771680647",
  appId: "1:291771680647:web:82daa6194e025ec4a4b522",
  measurementId: "G-ZZBQ16W7TB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);
const googleProvider = new GoogleAuthProvider();

// Authentication Functions
export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    
    // Check if user exists in users collection
    const userDoc = await getDoc(doc(db, "users", user.uid));
    
    if (!userDoc.exists()) {
      // Create user document if doesn't exist
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        name: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
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
    
    // Create user document
    await setDoc(doc(db, "users", user.uid), {
      uid: user.uid,
      name: displayName,
      email: user.email,
      photoURL: null,
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
    const result = await signInWithEmail(auth, email, password);
    const user = result.user;
    
    // Update user status
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
      // Update user status before signing out
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

// Profile Functions
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

// Chat Functions
export const findRandomUser = async (currentUserId: string) => {
  try {
    console.log("Starting to find random user, current user ID:", currentUserId);
    
    // First, make sure we're populating users collection
    // Check if the current user exists in the users collection
    const currentUserDoc = await getDoc(doc(db, "users", currentUserId));
    if (!currentUserDoc.exists()) {
      // Create user document if it doesn't exist
      const currentUser = auth.currentUser;
      if (currentUser) {
        await setDoc(doc(db, "users", currentUserId), {
          uid: currentUserId,
          name: currentUser.displayName || "Anonymous",
          email: currentUser.email,
          photoURL: currentUser.photoURL,
          createdAt: serverTimestamp(),
          status: "online"
        });
        console.log("Created user document for current user");
      }
    }
    
    // Get all users except the current user
    const usersQuery = query(
      collection(db, "users"),
      where("uid", "!=", currentUserId)
    );
    
    console.log("Executing query to find users");
    const snapshot = await getDocs(usersQuery);
    
    if (snapshot.empty) {
      console.log("No users found");
      return null;
    }
    
    // Get random user from results
    const users = snapshot.docs.map(doc => doc.data());
    console.log(`Found ${users.length} users:`, users);
    
    const randomUser = users[Math.floor(Math.random() * users.length)];
    console.log("Selected random user:", randomUser);
    
    return randomUser;
  } catch (error) {
    console.error("Error finding random user: ", error);
    throw error;
  }
};

export const createChatRoom = async (user1Id: string, user2Id: string) => {
  try {
    // Sort IDs to ensure consistent chat room IDs
    const members = [user1Id, user2Id].sort();
    
    // Create or get chat room
    const chatRoomDoc = await addDoc(collection(db, "chatRooms"), {
      members,
      createdAt: serverTimestamp(),
      lastMessage: null,
      lastMessageTime: serverTimestamp()
    });
    
    return chatRoomDoc.id;
  } catch (error) {
    console.error("Error creating chat room: ", error);
    throw error;
  }
};

export const sendMessage = async (chatRoomId: string, senderId: string, message: string) => {
  try {
    // Add message to messages collection
    const messageData = {
      chatRoomId,
      senderId,
      message,
      timestamp: serverTimestamp()
    };
    
    await addDoc(collection(db, "messages"), messageData);
    
    // Update chat room with last message
    await updateDoc(doc(db, "chatRooms", chatRoomId), {
      lastMessage: message,
      lastMessageTime: serverTimestamp()
    });
  } catch (error) {
    console.error("Error sending message: ", error);
    throw error;
  }
};

export const subscribeToMessages = (chatRoomId: string, callback: (messages: any[]) => void) => {
  // Create query for messages in this chat room, ordered by timestamp
  const messagesQuery = query(
    collection(db, "messages"),
    where("chatRoomId", "==", chatRoomId),
    orderBy("timestamp", "asc")
  );
  
  // Listen for updates
  return onSnapshot(messagesQuery, (snapshot) => {
    const messages = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    callback(messages);
  });
};

export { auth, db, storage };
