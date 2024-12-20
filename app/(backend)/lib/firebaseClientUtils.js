// lib/firebaseClientUtils.js

import { ref, get } from "firebase/database";
import { realtimeDb } from "./firebase"; // Make sure the realtimeDb is correctly exported from firebase.js

// Utility function to get a user by ID from Firebase Realtime Database
export const getUserFromFirebase = async (userId) => {
  try {
    // Get the reference to the user's data in the Firebase Realtime Database
    const userRef = ref(realtimeDb, 'users/' + userId);
    const snapshot = await get(userRef);
    
    if (snapshot.exists()) {
      return snapshot.val(); // Return the user data if exists
    } else {
      throw new Error('User not found');
    }
  } catch (error) {
    console.error("Error fetching user from Firebase:", error);
    throw error;
  }
}
