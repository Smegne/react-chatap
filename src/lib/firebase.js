import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: "reactchat-59f8a.firebaseapp.com",
  projectId: "reactchat-59f8a",
  storageBucket: "reactchat-59f8a.appspot.com",
  messagingSenderId: "1048108658971",
  appId: "1:1048108658971:web:11a33a21498370298563be"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app); // Include app
export const db = getFirestore(app); // Include app
export const storage = getStorage(app); // Corrected from starage to storage
