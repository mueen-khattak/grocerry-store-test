// lib/firebaseUtils.js
import { ref, onValue,  push, update, remove } from "firebase/database";
import { ref as storageRef, getDownloadURL, uploadBytesResumable, deleteObject } from "firebase/storage";
import { realtimeDb, storage } from "./firebase";











// Utility function to read data from Firebase Realtime Database
export const readDataFromRealtimeDB = (path) => {
  return new Promise((resolve, reject) => {
    const dbRef = ref(realtimeDb, path);
    onValue(dbRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        resolve(data);
      } else {
        resolve(null);
      }
    }, (error) => {
      reject(error);
    });
  });
};

// Utility function to write data to Firebase Realtime Database
export const writeDataToRealtimeDB = (path, data) => {
  return new Promise((resolve, reject) => {
    const dbRef = ref(realtimeDb, path);
    push(dbRef, data)
      .then((res) => resolve(res))
      .catch((error) => reject(error));
  });
};

// Utility function to update data in Firebase Realtime Database
export const updateDataInRealtimeDB = (path, data) => {
  return new Promise((resolve, reject) => {
    const dbRef = ref(realtimeDb, path);
    update(dbRef, data)
      .then(() => resolve("Data updated successfully"))
      .catch((error) => reject(error));
  });
};

// Utility function to delete data from Firebase Realtime Database
export const deleteDataFromRealtimeDB = (path) => {
  return new Promise((resolve, reject) => {
    const dbRef = ref(realtimeDb, path);
    remove(dbRef)
      .then(() => resolve("Data removed successfully"))
      .catch((error) => reject(error));
  });
};

// Utility function to upload file to Firebase Storage
export const uploadFileToStorage = (filePath, file) => {
  return new Promise((resolve, reject) => {
    const storageReference = storageRef(storage, filePath);
    const uploadTask = uploadBytesResumable(storageReference, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        // You can handle upload progress here
      },
      (error) => {
        reject(error);
      },
      async () => {
        try {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          resolve(downloadURL);
        } catch (error) {
          reject(error);
        }
      }
    );
  });
};

// Utility function to get file URL from Firebase Storage
export const getFileURLFromStorage = (filePath) => {
  return new Promise((resolve, reject) => {
    const storageReference = storageRef(storage, filePath);
    getDownloadURL(storageReference)
      .then((url) => resolve(url))
      .catch((error) => reject(error));
  });
};

// Utility function to delete file from Firebase Storage
export const deleteFileFromStorage = (filePath) => {
  return new Promise((resolve, reject) => {
    const storageReference = storageRef(storage, filePath);
    deleteObject(storageReference)
      .then(() => resolve("File deleted successfully"))
      .catch((error) => reject(error));
  });
};



// import { realtimeDb } from './firebase'; // Import the initialized Firebase Realtime Database instance
// import { ref, get } from 'firebase/database'; // Firebase Realtime Database functions

// Function to fetch all data at once
export const fetchAllData = async () => {
  try {
    const dbRefs = [
      'brands',
      'categories',
      'orders',
      'products',
      'products_Name_Variety',
      'products_Variety',
      'products_name',
      'returns',
      'reviews',
      'users',
    ];

    // Create a map of promises to fetch all data
    const dataPromises = dbRefs.map(async (path) => {
      const snapshot = await get(ref(realtimeDb, path));
      return { [path]: snapshot.exists() ? snapshot.val() : null };
    });

    // Resolve all promises and merge the data
    const data = await Promise.all(dataPromises);
    return Object.assign({}, ...data); // Merge all data objects into a single object
  } catch (error) {
    console.error('Error fetching data from Firebase:', error);
    throw error;
  }
};
