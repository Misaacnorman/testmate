
'use server';

import { db } from '@/lib/firebase';
import { ConcreteCube } from '@/types/concrete-cube';
import { collection, getDocs, addDoc } from 'firebase/firestore';
import { fromFirestore } from './receipts';

const concreteCubesCollection = collection(db, 'concreteCubes');

export async function getConcreteCubes(): Promise<ConcreteCube[]> {
    const snapshot = await getDocs(concreteCubesCollection);
    return snapshot.docs.map(doc => fromFirestore<ConcreteCube>(doc));
}

export async function addConcreteCube(data: Omit<ConcreteCube, 'id'>): Promise<ConcreteCube> {
    const docRef = await addDoc(concreteCubesCollection, data);
    return { id: docRef.id, ...data } as ConcreteCube;
}
