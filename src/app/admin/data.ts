
'use server';

import { collection, getDocs, doc, updateDoc, setDoc, deleteDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import type { User, Role } from '@/lib/types';
import { fromFirestore } from '@/lib/utils';

const usersCollection = collection(db, 'users');
const rolesCollection = collection(db, 'roles');

export async function getUsers(): Promise<User[]> {
  await new Promise(resolve => setTimeout(resolve, 500));
  try {
    const snapshot = await getDocs(usersCollection);
    return snapshot.docs.map(doc => fromFirestore<User>({ id: doc.id, ...doc.data() }));
  } catch (e) {
    console.error("Error fetching users: ", e);
    return [];
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
