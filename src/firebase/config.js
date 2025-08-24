import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDzHZt4LV1Te2bkX2yud-DOURQ_-n3RGpw",
  authDomain: "eana-birthday.firebaseapp.com",
  databaseURL: "https://eana-birthday-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "eana-birthday",
  storageBucket: "eana-birthday.firebasestorage.app",
  messagingSenderId: "740038878500",
  appId: "1:740038878500:web:e9c374e580845267acbfb1",
  measurementId: "G-0902GDP6JW"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const analytics = getAnalytics(app);

export default app;
