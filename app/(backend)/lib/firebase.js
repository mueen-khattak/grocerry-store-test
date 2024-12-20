import { initializeApp, getApps, getApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getStorage } from "firebase/storage";
import { getDatabase } from "firebase/database"; // Import Firebase Realtime Database
import { getAuth } from "firebase/auth"; // Import Firebase Auth

// Firebase configuration (ensure to keep sensitive info in .env.local)
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};


// Initialize Firebase only once in the app
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Initialize Firestore, Storage, Realtime Database, and Auth
const storage = getStorage(app);
const realtimeDb = getDatabase(app); // Initialize Firebase Realtime Database
const auth = getAuth(app); // Initialize Firebase Auth

// Initialize Analytics on the client-side only (check if supported)
if (typeof window !== "undefined" && process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID) {
  isSupported().then((yes) => {
    if (yes) {
      getAnalytics(app);
    }
  });
}

// Export the initialized services
export { app, storage, realtimeDb, auth }; // Export the auth instance
