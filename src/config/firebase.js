// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAtYoNSoGkqrv9fqG4DvZ7BJ2JIT1eCRBI",
  authDomain: "smart-ai-quiz-generator.firebaseapp.com",
  projectId: "smart-ai-quiz-generator",
  storageBucket: "smart-ai-quiz-generator.firebasestorage.app",
  messagingSenderId: "1061064657740",
  appId: "1:1061064657740:web:7aca5a3fe633e2b0e25de9",
  measurementId: "G-SRK39Y79QY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);