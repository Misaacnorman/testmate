
'use server';

import { collection, getDocs, orderBy, query, writeBatch, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import type { ConcreteCubeSample } from '@/lib/types';
import { fromFirestore } from '@/lib/utils';

const registerCollection = collection(db, 'concrete-cubes-register');

export async function getConcreteCubes(): Promise<ConcreteCubeSample[]> {
  // Simulate network delay for a better UX
  await new Promise(resolve => setTimeout(resolve, 500));
  try {
    const q = query(registerCollection, orderBy('receivedAt', 'desc'));
    const snapshot = await getDocs(q);
    if (snapshot.empty) {
        console.log("No documents found in concrete-cubes-register.");
        return [];
    }
    return snapshot.docs.map(doc => fromFirestore<ConcreteCubeSample>({ id: doc.id, ...doc.data() }));
  } catch(e) {
    console.error("Error fetching from concrete-cubes-register: ", e);
    // If collection doesn't exist, it will throw. Return empty array in that case.
    return [];
  }
}


export async function updateCubeTestResults(updatedSamples: ConcreteCubeSample[]): Promise<void> {
    const batch = writeBatch(db);

    updatedSamples.forEach(sample => {
        const docRef = doc(db, 'concrete-cubes-register', sample.id);
        const { id, ...sampleData } = sample; // Exclude original id from the data to be written
        batch.update(docRef, sampleData);
    });

    await batch.commit();
}
