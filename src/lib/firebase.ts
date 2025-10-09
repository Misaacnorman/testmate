
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";
import { getAuth, connectAuthEmulator } from "firebase/auth";


const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyCIYjuuANK-6hz8fM_R8jedKp9FpU2Ww4s",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "testmate-lims.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "testmate-lims",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "testmate-lims.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "308193198087",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:308193198087:web:3a77f543d40ad53fd0eaa2",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "G-5C3E7X61Q5",
};

// Initialize Firebase
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// Connect to local emulators during development when available
const shouldUseEmulators =
  process.env.NODE_ENV !== 'production' &&
  process.env.NEXT_PUBLIC_USE_EMULATORS === 'true' &&
  (typeof window !== 'undefined' && window.location?.hostname === 'localhost');

if (shouldUseEmulators) {
  try {
    // Defaults: Firestore 8080, Auth 9099
    connectFirestoreEmulator(db, 'localhost', 8080);
    connectAuthEmulator(auth, 'http://localhost:9099', { disableWarnings: true });
    // eslint-disable-next-line no-console
    console.info('[firebase] Connected to local emulators');
  } catch {
    // ignore if already connected
  }
}

export { db, auth };
