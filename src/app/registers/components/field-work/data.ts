
'use server';

import { collection, getDocs, orderBy, query, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import type { FieldWorkInstruction } from '@/lib/types';
import { fromFirestore } from '@/lib/utils';


const registerCollection = collection(db, 'fieldWorkInstructions');

export async function getFieldWorkInstructions(): Promise<FieldWorkInstruction[]> {
  await new Promise(resolve => setTimeout(resolve, 500));
  try {
    const q = query(registerCollection, orderBy('date', 'desc'));
    const snapshot = await getDocs(q);
    if (snapshot.empty) {
        return [];
    }
    return snapshot.docs.map(doc => fromFirestore<FieldWorkInstruction>({ id: doc.id, ...doc.data() }));
  } catch(e) {
    console.error("Error fetching from fieldWorkInstructions: ", e);
    return [];
  }
}


export async function createFieldWorkInstruction(data: Omit<FieldWorkInstruction, 'id'>): Promise<void> {
    await addDoc(registerCollection, {
        ...data,
        createdAt: serverTimestamp()
    });
}
