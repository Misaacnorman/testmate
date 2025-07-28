
'use server';

import { db } from '@/lib/firebase';
import { Cylinder } from '@/types/cylinder';
import { collection, getDocs, addDoc, DocumentData } from 'firebase/firestore';
import { Timestamp } from 'firebase/firestore';

const cylindersCollection = collection(db, 'cylinders');

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


export async function getCylinders(): Promise<Cylinder[]> {
    const snapshot = await getDocs(cylindersCollection);
    return snapshot.docs.map(doc => fromFirestore<Cylinder>(doc));
}


export async function addCylinder(data: Omit<Cylinder, 'id'>): Promise<Cylinder> {
    const docRef = await addDoc(cylindersCollection, data);
    return { id: docRef.id, ...data } as Cylinder;
}
