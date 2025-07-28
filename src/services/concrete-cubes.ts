
'use server';

import { db } from '@/lib/firebase';
import { ConcreteCube } from '@/types/concrete-cube';
import { collection, getDocs, addDoc } from 'firebase/firestore';

const concreteCubesCollection = collection(db, 'concreteCubes');

export async function getConcreteCubes(): Promise<ConcreteCube[]> {
    const snapshot = await getDocs(concreteCubesCollection);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ConcreteCube));
}

export async function addConcreteCube(data: Omit<ConcreteCube, 'id'>): Promise<ConcreteCube> {
    const docRef = await addDoc(concreteCubesCollection, data);
    return { id: docRef.id, ...data } as ConcreteCube;
}
