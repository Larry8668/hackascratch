// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_VERCELFIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_VERCELFIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_VERCELFIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_VERCELFIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_VERCELFIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_VERCELFIREBASE_APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
const db = getFirestore(app);

// Initialize Firestore
const auth = getAuth(app);

export { db, auth };