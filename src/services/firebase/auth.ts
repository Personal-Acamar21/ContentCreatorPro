import {
  signInAnonymously,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User
} from 'firebase/auth';
import { auth } from '../../lib/firebase';

export async function signInAnonymous() {
  try {
    const userCredential = await signInAnonymously(auth);
    return userCredential.user;
  } catch (error: any) {
    // Handle specific error cases
    if (error.code === 'auth/configuration-not-found') {
      console.warn('Anonymous authentication is not enabled. Using local mode.');
      return null;
    }
    console.error('Error signing in anonymously:', error);
    throw error;
  }
}

export async function signOut() {
  try {
    await firebaseSignOut(auth);
  } catch (error) {
    console.error('Error signing out:', error);
    throw error;
  }
}

export function onAuthChange(callback: (user: User | null) => void) {
  return onAuthStateChanged(auth, callback);
}