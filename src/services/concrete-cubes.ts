
'use server';

import { db } from '@/lib/firebase';
import { ConcreteCube, ConcreteCubeSet } from '@/types/concrete-cube';
import { collection, getDocs, addDoc, doc, updateDoc, DocumentData, writeBatch } from 'firebase/firestore';
import { Timestamp } from 'firebase/firestore';
import { format } from 'date-fns';

const concreteCubesCollection = collection(db, 'concreteCubes');

const fromFirestore = <T extends { id: string }>(doc: DocumentData): T => {
    const data = doc.data();
    
    const convertTimestamps = (obj: any): any => {
        if (obj === null || typeof obj !== 'object') {
            return obj;
        }

        if (obj instanceof Timestamp) {
            return format(obj.toDate(), 'yyyy-MM-dd');
        }

        if (Array.isArray(obj)) {
            return obj.map(convertTimestamps);
        }

        const newObj: { [key: string]: any } = {};
        for (const key in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, key)) {
                newObj[key] = convertTimestamps(obj[key]);
            }
        }
        return newObj;
    };

    const convertedData = convertTimestamps(data);
    convertedData.id = doc.id;
    
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

export async function updateConcreteCube(item: ConcreteCube): Promise<void> {
    const docRef = doc(db, 'concreteCubes', item.id);
    const { id, ...dataToUpdate } = item;
    await updateDoc(docRef, dataToUpdate);
}
