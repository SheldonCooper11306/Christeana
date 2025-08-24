import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

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

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
