// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: "interior-ai-ba3fb.firebaseapp.com",
  projectId: "interior-ai-ba3fb",
  storageBucket: "interior-ai-ba3fb.firebasestorage.app",
  messagingSenderId: "902392995063",
  appId: "1:902392995063:web:042dadc3d531fef78647f2",
  measurementId: "G-5VVXJF09LZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
