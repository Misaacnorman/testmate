
'use server';

import { db } from '@/lib/firebase';
import { Paver } from '@/types/paver';
import { collection, getDocs, addDoc, doc, updateDoc, DocumentData } from 'firebase/firestore';
import { Timestamp } from 'firebase/firestore';

const paversCollection = collection(db, 'pavers');

const fromFirestore = <T extends { id: string }>(doc: DocumentData): T => {
    const data = doc.data();
    const convertedData: { [key: string]: any } = { id: doc.id };

    for (const key in data) {
        if (Object.prototype.hasOwnProperty.call(data, key)) {
            const value = data[key];
            if (value instanceof Timestamp) {
                convertedData[key] = value.toDate();
            } else if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
                // Recursively convert nested objects, but not arrays for now
                const nestedData = { ...value };
                for(const nestedKey in nestedData) {
                    if (nestedData[nestedKey] instanceof Timestamp) {
                        nestedData[nestedKey] = nestedData[nestedKey].toDate();
                    }
                }
                 convertedData[key] = nestedData;
            } else {
                convertedData[key] = value;
            }
        }
    }
    return convertedData as T;
};


export async function getPavers(): Promise<Paver[]> {
    const snapshot = await getDocs(paversCollection);
    return snapshot.docs.map(doc => fromFirestore<Paver>(doc));
}


export async function addPaver(data: Omit<Paver, 'id'>): Promise<Paver> {
    const docRef = await addDoc(paversCollection, data);
    return { id: docRef.id, ...data } as Paver;
}

export async function updatePaver(item: Paver): Promise<void> {
    const itemDoc = doc(db, 'pavers', item.id);
    const { id, ...itemData } = item;
    await updateDoc(itemDoc, itemData);
}
