
"use client";

import React from 'react';
import { onAuthStateChanged, User, signOut as firebaseSignOut } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { Loader2 } from 'lucide-react';
import { Laboratory, User as AppUser, ThemeColors, Role } from '@/lib/types';

interface AuthContextType {
  user: AppUser | null;
  laboratoryId: string | null;
  laboratory: Laboratory | null;
  loading: boolean;
  signOut: () => Promise<void>;
  refresh: () => Promise<void>;
  permissions: string[];
}

const AuthContext = React.createContext<AuthContextType>({
  user: null,
  laboratoryId: null,
  laboratory: null,
  loading: true,
  signOut: async () => {},
  refresh: async () => {},
  permissions: [],
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<AppUser | null>(null);
  const [laboratoryId, setLaboratoryId] = React.useState<string | null>(null);
  const [laboratory, setLaboratory] = React.useState<Laboratory | null>(null);
  const [permissions, setPermissions] = React.useState<string[]>([]);
  const [loading, setLoading] = React.useState(true);

  const fetchUserData = React.useCallback(async (currentUser: User | null, retryCount = 0) => {
    if (currentUser) {
      try {
        const userDocRef = doc(db, 'users', currentUser.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          const userData = userDoc.data() as AppUser;
          setUser(userData);
          const labId = userData?.laboratoryId;
          setLaboratoryId(labId);

          // Fetch permissions based on role
          if (userData.roleId) {
            const roleDocRef = doc(db, 'roles', userData.roleId);
            const roleDoc = await getDoc(roleDocRef);
            if (roleDoc.exists()) {
              const roleData = roleDoc.data() as Role;
              const basePermissions = roleData.permissions || [];
              const grantedPermissions = userData.grantedPermissions || [];
              const revokedPermissions = new Set(userData.revokedPermissions || []);
              
              const finalPermissions = [...new Set([...basePermissions, ...grantedPermissions])]
                .filter(p => !revokedPermissions.has(p));

              setPermissions(finalPermissions);

            } else {
              setPermissions([]);
            }
          } else {
             // Handle users with no role but with individual permissions
            const grantedPermissions = userData.grantedPermissions || [];
            const revokedPermissions = new Set(userData.revokedPermissions || []);
            const finalPermissions = grantedPermissions.filter(p => !revokedPermissions.has(p));
            setPermissions(finalPermissions);
          }

          if (labId) {
              const labDocRef = doc(db, 'laboratories', labId);
              const labDoc = await getDoc(labDocRef);
              if (labDoc.exists()) {
                  const labData = labDoc.data() as Laboratory;
                  setLaboratory(labData);
              } else {
                  setLaboratory(null);
              }
          }
        } else {
          // If user document doesn't exist and this is a retry, wait and try again
          if (retryCount < 3) {
            setTimeout(() => {
              fetchUserData(currentUser, retryCount + 1);
            }, (retryCount + 1) * 1000);
            return;
          }
          
          // After retries, fallback to auth user
          setUser({
            uid: currentUser.uid,
            email: currentUser.email || undefined,
            name: currentUser.displayName || undefined,
            photoURL: currentUser.photoURL || undefined,
            status: 'active',
            createdAt: new Date().toISOString(),
            laboratoryId: '',
          });
          setLaboratoryId(null);
          setLaboratory(null);
          setPermissions([]);
        }
      } catch (e) {
          console.error("Failed to fetch user/lab data", e);
          
          // Set fallback user data but don't show error to user
          // This prevents infinite error loops in the UI
          setUser({
            uid: currentUser.uid,
            email: currentUser.email || undefined,
            name: currentUser.displayName || undefined,
            photoURL: currentUser.photoURL || undefined,
            status: 'active',
            createdAt: new Date().toISOString(),
            laboratoryId: '',
          }); // Fallback to auth user
          setLaboratoryId(null);
          setLaboratory(null);
          setPermissions([]);
      }
    } else {
      setUser(null);
      setLaboratoryId(null);
      setLaboratory(null);
      setPermissions([]);
    }
  }, []);


  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
      await fetchUserData(authUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [fetchUserData]);
  
  const signOut = async () => {
    setLoading(true);
    await firebaseSignOut(auth);
    setUser(null);
    setLaboratoryId(null);
    setLaboratory(null);
    setPermissions([]);
    setLoading(false);
  };

  const refresh = React.useCallback(async () => {
    setLoading(true);
    if (auth.currentUser) {
      await auth.currentUser.reload();
      const freshUser = auth.currentUser;
      await fetchUserData(freshUser);
    }
    setLoading(false);
  }, [fetchUserData]);


  return (
    <AuthContext.Provider value={{ user, laboratoryId, laboratory, loading, signOut, refresh, permissions }}>
      {children}
    </AuthContext.Provider>
  );
}
AuthProvider.displayName = "AuthProvider";

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
