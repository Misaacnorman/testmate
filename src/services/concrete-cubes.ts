
'use server';

import { db } from '@/lib/firebase';
import { ConcreteCube } from '@/types/concrete-cube';
import { collection, getDocs, addDoc, doc, updateDoc, DocumentData } from 'firebase/firestore';
import { Timestamp } from 'firebase/firestore';

const concreteCubesCollection = collection(db, 'concreteCubes');

const fromFirestore = <T extends { id: string }>(doc: DocumentData): T => {
    const data = doc.data();
    const convertedData: { [key: string]: any } = { id: doc.id };

    for (const key in data) {
        if (Object.prototype.hasOwnProperty.call(data, key)) {
            const value = data[key];
            if (value instanceof Timestamp) {
                convertedData[key] = value.toDate();
            } else if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
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

export async function getConcreteCubes(): Promise<ConcreteCube[]> {
    const snapshot = await getDocs(concreteCubesCollection);
    return snapshot.docs.map(doc => fromFirestore<ConcreteCube>(doc));
}

export async function addConcreteCube(data: Omit<ConcreteCube, 'id'>): Promise<ConcreteCube> {
    const docRef = await addDoc(concreteCubesCollection, data);
    return { id: docRef.id, ...data } as ConcreteCube;
}

export async function updateConcreteCube(cube: ConcreteCube): Promise<void> {
    const cubeDoc = doc(db, 'concreteCubes', cube.id);
    const { id, ...cubeData } = cube;
    await updateDoc(cubeDoc, cubeData);
}

    