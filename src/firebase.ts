import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut,
  onAuthStateChanged,
  User
} from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Static configuration matching our firebase-applet-config.json
const firebaseConfig = {
  apiKey: "AIzaSyCJEzLYQiQIwOY6NqEvWkLVgCVa19iEhOo",
  authDomain: "gen-lang-client-0153203507.firebaseapp.com",
  projectId: "gen-lang-client-0153203507",
  storageBucket: "gen-lang-client-0153203507.firebasestorage.app",
  messagingSenderId: "647210817241",
  appId: "1:647210817241:web:a8d88d3e80bf00429710c8"
};

// Initialize Firebase securely (prevent double initialization)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

// Custom parameters to force account selection with Google
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

/**
 * Handle Google Gmail Sign-In using Firebase Auth Popup
 */
export async function signInWithGoogle(): Promise<User> {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error: any) {
    console.error("Google Sign-In Error:", error);
    throw error;
  }
}

/**
 * Log out the current user session
 */
export async function logoutUser(): Promise<void> {
  try {
    await signOut(auth);
  } catch (error: any) {
    console.error("Sign-Out Error:", error);
    throw error;
  }
}

export { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  onAuthStateChanged 
};
export type { User };
