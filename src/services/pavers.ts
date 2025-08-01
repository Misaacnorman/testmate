
'use server';

import { db } from '@/lib/firebase';
import { Paver } from '@/types/paver';
import { collection, getDocs, addDoc, doc, updateDoc, deleteDoc, DocumentData } from 'firebase/firestore';
import { Timestamp } from 'firebase/firestore';
import { format } from 'date-fns';

const paversCollection = collection(db, 'pavers');

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

export async function deletePaver(paverId: string): Promise<void> {
    const paverDoc = doc(db, 'pavers', paverId);
    await deleteDoc(paverDoc);
}
