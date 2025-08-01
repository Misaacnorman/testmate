
'use server';

import { db } from '@/lib/firebase';
import { WaterAbsorption } from '@/types/water-absorption';
import { collection, getDocs, addDoc, doc, updateDoc, DocumentData } from 'firebase/firestore';
import { Timestamp } from 'firebase/firestore';
import { format } from 'date-fns';

const waterAbsorptionsCollection = collection(db, 'waterAbsorptions');

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


export async function getWaterAbsorptions(): Promise<WaterAbsorption[]> {
    const snapshot = await getDocs(waterAbsorptionsCollection);
    return snapshot.docs.map(doc => fromFirestore<WaterAbsorption>(doc));
}

export async function addWaterAbsorption(data: Omit<WaterAbsorption, 'id'>): Promise<WaterAbsorption> {
    const docRef = await addDoc(waterAbsorptionsCollection, data);
    return { id: docRef.id, ...data } as WaterAbsorption;
}

export async function updateWaterAbsorption(item: WaterAbsorption): Promise<void> {
    const itemDoc = doc(db, 'waterAbsorptions', item.id);
    const { id, ...itemData } = item;
    await updateDoc(itemDoc, itemData);
}
