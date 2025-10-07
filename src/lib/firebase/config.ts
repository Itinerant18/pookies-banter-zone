
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD_AUsKNSR3APTQjHWsTE0DSqrstr_MEmk",
  authDomain: "pookies-banter-zone-updated.firebaseapp.com",
  databaseURL: "https://pookies-banter-zone-updated-default-rtdb.firebaseio.com",
  projectId: "pookies-banter-zone-updated",
  storageBucket: "pookies-banter-zone-updated.firebasestorage.app",
  messagingSenderId: "33052111801",
  appId: "1:33052111801:web:59a0a12c86e80cc4777c68",
  measurementId: "G-300M5RK4H1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { app, auth, db, storage };
