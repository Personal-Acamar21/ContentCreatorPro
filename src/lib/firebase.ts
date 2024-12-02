import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, enableIndexedDbPersistence } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAnalytics, isSupported } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: "AIzaSyAtYXkluPBNtGWntHilhDv1ZHqeUHNRdI4",
  authDomain: "content-studio-fcdaa.firebaseapp.com",
  projectId: "content-studio-fcdaa",
  storageBucket: "content-studio-fcdaa.firebasestorage.app",
  messagingSenderId: "85291123666",
  appId: "1:85291123666:web:7ba311bb8167ff6d057e0b",
  measurementId: "G-K40CWM33MT"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Enable offline persistence
enableIndexedDbPersistence(db)
  .catch((err) => {
    if (err.code === 'failed-precondition') {
      console.warn('Multiple tabs open, persistence can only be enabled in one tab at a time.');
    } else if (err.code === 'unimplemented') {
      console.warn('The current browser does not support persistence.');
    }
  });

// Initialize analytics only in browser environment
let analytics = null;
if (typeof window !== 'undefined') {
  isSupported().then(yes => yes && (analytics = getAnalytics(app)));
}
export { analytics };

export default app;