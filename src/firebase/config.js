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
  appId: "1:740038878500:web:caa379a373e73bcdacbfb1",
  measurementId: "G-9WG3R7KP80"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const analytics = getAnalytics(app);

export default app;
