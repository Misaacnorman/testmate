
'use server';

import { collection, getDocs, doc, updateDoc, setDoc, deleteDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import type { User, Group } from '@/lib/types';
import { fromFirestore } from '@/lib/utils';

const usersCollection = collection(db, 'users');
const groupsCollection = collection(db, 'groups');

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

export async function getGroups(): Promise<Group[]> {
  await new Promise(resolve => setTimeout(resolve, 500));
  try {
    const snapshot = await getDocs(groupsCollection);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Group));
  } catch (e) {
    console.error("Error fetching groups: ", e);
    return [];
  }
}

export async function updateUser(userId: string, data: Partial<User>): Promise<void> {
  const userRef = doc(db, 'users', userId);
  await updateDoc(userRef, data);
}

export async function createGroup(data: Omit<Group, 'id'>): Promise<void> {
    const id = data.name.toLowerCase().replace(/\s+/g, '-');
    const groupRef = doc(db, 'groups', id);
    await setDoc(groupRef, { ...data, id });
}

export async function updateGroup(groupId: string, data: Partial<Group>): Promise<void> {
    const groupRef = doc(db, 'groups', groupId);
    await updateDoc(groupRef, data);
}

export async function deleteGroup(groupId: string): Promise<void> {
    const groupRef = doc(db, 'groups', groupId);
    await deleteDoc(groupRef);
}
