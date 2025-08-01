
'use server';

import { db } from '@/lib/firebase';
import { Cylinder } from '@/types/cylinder';
import { collection, getDocs, addDoc, doc, updateDoc, DocumentData } from 'firebase/firestore';
import { Timestamp } from 'firebase/firestore';
import { format } from 'date-fns';

const cylindersCollection = collection(db, 'cylinders');

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


export async function getCylinders(): Promise<Cylinder[]> {
    const snapshot = await getDocs(cylindersCollection);
    return snapshot.docs.map(doc => fromFirestore<Cylinder>(doc));
}


export async function addCylinder(data: Omit<Cylinder, 'id'>): Promise<Cylinder> {
    const docRef = await addDoc(cylindersCollection, data);
    return { id: docRef.id, ...data } as Cylinder;
}

export async function updateCylinder(item: Cylinder): Promise<void> {
    const itemDoc = doc(db, 'cylinders', item.id);
    const { id, ...itemData } = item;
    await updateDoc(itemDoc, itemData);
}
