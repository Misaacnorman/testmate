'use server';

import { db } from '@/lib/firebase';
import { Test } from '@/types/test';
import { collection, getDocs, addDoc, doc, deleteDoc, DocumentData, QueryDocumentSnapshot, updateDoc } from 'firebase/firestore';

const testsCollection = collection(db, 'tests');

// The data in Firestore is still using the old format. This function converts it to the new format.
// We will remove this once the data is migrated.
function fromFirestore(doc: QueryDocumentSnapshot<DocumentData>): Test {
    const data = doc.data();
    return {
        id: doc.id,
        materialCategory: data.materialCategory || data['MATERIAL CATEGORY'] || '',
        testCode: data.testCode || data['TEST CODE'] || '',
        materialTest: data.materialTest || data['MATERIAL TEST'] || '',
        testMethods: data.testMethods || data['TEST METHOD(S)'] || '',
        accreditation: data.accreditation || data['ACCREDITATION'] || '',
        unit: data.unit || data['UNIT'] || '',
        amountUGX: data.amountUGX || data['AMOUNT (UGX)'] || 0,
        amountUSD: data.amountUSD || data['AMOUNT (USD)'] || 0,
        leadTimeDays: data.leadTimeDays || data['LEAD TIME (DAYS)'] || 0,
    };
}


export async function getTests(): Promise<Test[]> {
    const snapshot = await getDocs(testsCollection);
    return snapshot.docs.map(fromFirestore);
}

export async function addTest(test: Omit<Test, 'id'>): Promise<Test> {
    const docRef = await addDoc(testsCollection, test);
    return {
        id: docRef.id,
        ...test
    };
}

export async function updateTest(test: Test): Promise<void> {
    const testDoc = doc(db, 'tests', test.id);
    const { id, ...testData } = test;
    await updateDoc(testDoc, testData);
}

export async function deleteTest(testId: string): Promise<void> {
    const testDoc = doc(db, 'tests', testId);
    await deleteDoc(testDoc);
}
