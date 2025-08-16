
'use server';

import { collection, getDocs, writeBatch, doc, deleteDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import type { Test } from '@/lib/types';

const testsCollection = collection(db, 'tests');

export async function getTests(): Promise<Test[]> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));
  const snapshot = await getDocs(testsCollection);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Test));
}

export async function saveTests(newTests: Test[]): Promise<void> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    const batch = writeBatch(db);

    // Get all existing tests to delete them
    const snapshot = await getDocs(testsCollection);
    snapshot.docs.forEach(document => {
        batch.delete(document.ref);
    });

    // Add new tests
    newTests.forEach(test => {
        const docRef = doc(db, "tests", test.id);
        batch.set(docRef, test);
    });

    await batch.commit();
}


export default async function DataPage() {
    return null;
}
