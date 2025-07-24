import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  projectId: "testcentral",
  appId: "1:610781744463:web:0cdb442ec5be7e6c8a893a",
  storageBucket: "testcentral.firebasestorage.app",
  apiKey: "AIzaSyA6v-qKdek9cNP-cOuGkHdnbbfZ-xJZvWU",
  authDomain: "testcentral.firebaseapp.com",
  measurementId: "",
  messagingSenderId: "610781744463",
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);

export { app, db };
