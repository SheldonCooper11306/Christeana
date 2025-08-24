import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDzHZt4LV1Te2bkX2yud-DOURQ_-n3RGpw",
  authDomain: "eana-birthday.firebaseapp.com",
  databaseURL: "https://eana-birthday-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "eana-birthday",
  storageBucket: "eana-birthday.firebasestorage.app",
  messagingSenderId: "740038878500",
  appId: "1:740038878500:web:6e31e0ba182c955facbfb1",
  measurementId: "G-VS7RYRE6NC"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const analytics = getAnalytics(app);

export default app;
