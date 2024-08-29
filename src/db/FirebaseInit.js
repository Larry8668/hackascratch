// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_VERCEL_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_VERCEL_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_VERCEL_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_VERCEL_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_VERCEL_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_VERCEL_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
const db = getFirestore(app);

// Initialize FireAuth
const auth = getAuth(app);

// Initialize Storage
const storage = getStorage(app);

export { db, auth, storage };
