
import { collection, doc, getDoc, getDocs, query, where, addDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from './config';

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
        await addDoc(collection(db, "users"), {
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
