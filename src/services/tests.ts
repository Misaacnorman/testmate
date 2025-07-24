'use server';

import { db } from '@/lib/firebase';
import { Test } from '@/types/test';
import { collection, getDocs, addDoc, doc, deleteDoc } from 'firebase/firestore';

const testsCollection = collection(db, 'tests');

export async function getTests(): Promise<Test[]> {
    const snapshot = await getDocs(testsCollection);
    return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    } as Test));
}

export async function addTest(test: Omit<Test, 'id'>): Promise<Test> {
    const docRef = await addDoc(testsCollection, test);
    return {
        id: docRef.id,
        ...test
    };
}

export async function deleteTest(testId: string): Promise<void> {
    const testDoc = doc(db, 'tests', testId);
    await deleteDoc(testDoc);
}
