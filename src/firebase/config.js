import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDzHZt4LV1Te2bkX2yud-DOURQ_-n3RGpw",
  authDomain: "eana-birthday.firebaseapp.com",
  databaseURL: "https://eana-birthday-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "eana-birthday",
  storageBucket: "eana-birthday.firebasestorage.app",
  messagingSenderId: "740038878500",
  appId: "1:740038878500:web:3a61eaf70b130824acbfb1",
  measurementId: "G-X65799YE0S"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;
