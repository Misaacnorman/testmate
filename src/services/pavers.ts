
'use server';

import { db } from '@/lib/firebase';
import { Paver } from '@/types/paver';
import { collection, getDocs, addDoc } from 'firebase/firestore';

const paversCollection = collection(db, 'pavers');

export async function getPavers(): Promise<Paver[]> {
    const snapshot = await getDocs(paversCollection);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Paver));
}


export async function addPaver(data: Omit<Paver, 'id'>): Promise<Paver> {
    const docRef = await addDoc(paversCollection, data);
    return { id: docRef.id, ...data } as Paver;
}
