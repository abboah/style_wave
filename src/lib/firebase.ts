import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyB5sr0iHXn3n0uCiZz52BO9HYlnHrboB8g',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'style-wave.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'style-wave',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'style-wave.firebasestorage.app',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '206009928428',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:206009928428:web:1527d68718d249cc9673c9',
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
