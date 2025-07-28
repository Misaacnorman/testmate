
'use server';

import { db } from '@/lib/firebase';
import { Cylinder } from '@/types/cylinder';
import { collection, getDocs, addDoc } from 'firebase/firestore';
import { fromFirestore } from './receipts';

const cylindersCollection = collection(db, 'cylinders');

export async function getCylinders(): Promise<Cylinder[]> {
    const snapshot = await getDocs(cylindersCollection);
    return snapshot.docs.map(doc => fromFirestore<Cylinder>(doc));
}


export async function addCylinder(data: Omit<Cylinder, 'id'>): Promise<Cylinder> {
    const docRef = await addDoc(cylindersCollection, data);
    return { id: docRef.id, ...data } as Cylinder;
}
