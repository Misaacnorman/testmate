
'use server';

import { collection, getDocs, orderBy, query, writeBatch, doc, where } from 'firebase/firestore';
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
        if (!sample.id) return;
        const docRef = doc(db, 'concrete-cubes-register', sample.id);
        
        const updateData: Partial<ConcreteCubeSample> = {};

        // Only update fields that have a value to avoid overwriting with undefined/null
        if (sample.length) updateData.length = sample.length;
        if (sample.width) updateData.width = sample.width;
        if (sample.height) updateData.height = sample.height;
        if (sample.weight) updateData.weight = sample.weight;
        if (sample.load) updateData.load = sample.load;
        if (sample.machineUsed) updateData.machineUsed = sample.machineUsed;
        if (sample.modeOfFailure) updateData.modeOfFailure = sample.modeOfFailure;
        if (sample.recordedTemp) updateData.recordedTemp = sample.recordedTemp;

        // Make sure to update the shared machineUsed value on all samples in the set
        if (updatedSamples[0].machineUsed) {
            updateData.machineUsed = updatedSamples[0].machineUsed;
        }

        batch.update(docRef, updateData);
    });

    await batch.commit();
}


export async function deleteCubeTestGroup(receiptId: string, setNumber: number): Promise<void> {
    const q = query(registerCollection, where('receiptId', '==', receiptId), where('setNumber', '==', setNumber));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
        console.warn(`No samples found for receiptId ${receiptId} and setNumber ${setNumber} to delete.`);
        return;
    }

    const batch = writeBatch(db);
    snapshot.docs.forEach(document => {
        batch.delete(document.ref);
    });

    await batch.commit();
}
