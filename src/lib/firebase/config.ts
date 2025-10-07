import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
 
// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA86gH3SQKPTLFZHKgH_rJwJpKm9yhQ9vU",
  authDomain: "pookies-bunter-zone-ak-up.firebaseapp.com",
  projectId: "pookies-bunter-zone-ak-up",
  storageBucket: "pookies-bunter-zone-ak-up.firebasestorage.app",
  messagingSenderId: "841500116943",
  appId: "1:841500116943:web:9cfb5994f2f8b7e5e474ba",
  measurementId: "G-GESWL04QL9"
};
 
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);
 
export { app, auth, db, storage };
