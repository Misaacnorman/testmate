
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";


const firebaseConfig = {
  "projectId": "studio-9132961761-298d7",
  "appId": "1:698417597497:web:4c1fbbca324ce09b0811e8",
  "storageBucket": "studio-9132961761-298d7.firebasestorage.app",
  "apiKey": "AIzaSyCtUZ4XOlIFUx7QWwenSeUsdX3SIC6JNeM",
  "authDomain": "studio-9132961761-298d7.firebaseapp.com",
  "measurementId": "",
  "messagingSenderId": "698417597497"
};

// Initialize Firebase
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };
