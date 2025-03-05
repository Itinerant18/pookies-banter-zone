
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCLP5GN7OR14sz0FdRNxjEe2XdfzHfmIV8",
  authDomain: "dating-a8002.firebaseapp.com",
  projectId: "dating-a8002",
  storageBucket: "dating-a8002.appspot.com",
  messagingSenderId: "291771680647",
  appId: "1:291771680647:web:82daa6194e025ec4a4b522",
  measurementId: "G-ZZBQ16W7TB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { app, auth, db, storage };
