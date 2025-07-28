
'use server';

import { db } from '@/lib/firebase';
import { WaterAbsorption } from '@/types/water-absorption';
import { collection, getDocs, addDoc } from 'firebase/firestore';
import { fromFirestore } from './receipts';

const waterAbsorptionsCollection = collection(db, 'waterAbsorptions');


export async function getWaterAbsorptions(): Promise<WaterAbsorption[]> {
    const snapshot = await getDocs(waterAbsorptionsCollection);
    return snapshot.docs.map(doc => fromFirestore<WaterAbsorption>(doc));
}

export async function addWaterAbsorption(data: Omit<WaterAbsorption, 'id'>): Promise<WaterAbsorption> {
    const docRef = await addDoc(waterAbsorptionsCollection, data);
    return { id: docRef.id, ...data } as WaterAbsorption;
}
