
'use server';

import { collection, getDocs, doc, updateDoc, setDoc, deleteDoc, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import type { User, Role } from '@/lib/types';
import { fromFirestore } from '@/lib/utils';
import { getAuth } from 'firebase-admin/auth';
import { initializeAdminApp } from '@/lib/firebase/admin-config';

// Initialize Firebase Admin SDK
initializeAdminApp();
const adminAuth = getAuth();

const usersCollection = collection(db, 'users');
const rolesCollection = collection(db, 'roles');

export async function getUsers(): Promise<User[]> {
  await new Promise(resolve => setTimeout(resolve, 500));
  try {
    const snapshot = await getDocs(usersCollection);
    const users = snapshot.docs.map(doc => fromFirestore<User>({ id: doc.id, ...doc.data() }));

    const authUsers = await adminAuth.listUsers();
    
    // Enrich with disabled status
    return users.map(user => {
      const authUser = authUsers.users.find(u => u.uid === user.id);
      return {
        ...user,
        disabled: authUser?.disabled || false,
      };
    });

  } catch (e) {
    console.error("Error fetching users: ", e);
    return [];
  }
}

export async function createUser(data: Omit<User, 'id' | 'createdAt' | 'status'>): Promise<void> {
    try {
        const authUser = await adminAuth.createUser({
            email: data.email,
            displayName: data.displayName,
            emailVerified: true, // Or send verification email
        });

        const userRef = doc(db, 'users', authUser.uid);
        await setDoc(userRef, {
            ...data,
            id: authUser.uid,
            createdAt: serverTimestamp(),
            overrides: { add: [], remove: [] },
        });

        // Send password reset email for initial setup
        const passwordResetLink = await adminAuth.generatePasswordResetLink(data.email);
        // Here you would typically use a service to email this link to the user.
        // For this app, we'll log it to the console as a demonstration.
        console.log(`Password reset link for ${data.email}: ${passwordResetLink}`);

    } catch (error) {
        console.error("Error creating user in backend: ", error);
        if (error.code === 'auth/email-already-exists') {
            throw new Error('A user with this email already exists.');
        }
        throw new Error('Failed to create user.');
    }
}

export async function getRoles(): Promise<Role[]> {
  await new Promise(resolve => setTimeout(resolve, 500));
  try {
    const snapshot = await getDocs(rolesCollection);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Role));
  } catch (e) {
    console.error("Error fetching roles: ", e);
    return [];
  }
}

export async function updateUser(userId: string, data: Partial<User>): Promise<void> {
  const userRef = doc(db, 'users', userId);
  await updateDoc(userRef, data);
}

export async function createRole(data: Omit<Role, 'id'>): Promise<void> {
    const id = data.name.toLowerCase().replace(/\s+/g, '-');
    const roleRef = doc(db, 'roles', id);
    await setDoc(roleRef, { ...data, id });
}

export async function updateRole(roleId: string, data: Partial<Role>): Promise<void> {
    const roleRef = doc(db, 'roles', roleId);
    await updateDoc(roleRef, data);
}

export async function deleteRole(roleId: string): Promise<void> {
    const roleRef = doc(db, 'roles', roleId);
    await deleteDoc(roleRef);
}

export async function updateUserStatus(userId: string, disabled: boolean): Promise<void> {
    await adminAuth.updateUser(userId, { disabled });
}
