
'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import {
  getAuth,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  User,
} from 'firebase/auth';
import { app, db } from '@/lib/firebase/config';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';


interface AuthContextType {
  user: User | null;
  loading: boolean;
  signup: (email: string, password: string, profileData?: { displayName?: string; photoURL?: string; }, roleId?: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);
const auth = getAuth(app);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signup = async (email: string, password: string, profileData?: { displayName?: string; photoURL?: string; }, roleId?: string) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const authUser = userCredential.user;
    if (authUser) {
      // 1. Update auth profile
      if (profileData) {
        await updateProfile(authUser, profileData);
      }
      
      // 2. Create user document in Firestore
      const userRef = doc(db, "users", authUser.uid);
      await setDoc(userRef, {
        id: authUser.uid,
        displayName: profileData?.displayName || '',
        email: authUser.email,
        role: roleId || '', // Save the selected role ID
        createdAt: serverTimestamp(),
        overrides: { add: [], remove: [] },
      });

      // Manually update the user state as updateProfile doesn't trigger onAuthStateChanged immediately
      setUser({ ...authUser, ...profileData });
    }
  };

  const login = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const logout = async () => {
    await signOut(auth);
  };

  const value = {
    user,
    loading,
    signup,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
