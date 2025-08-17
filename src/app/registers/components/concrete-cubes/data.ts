
'use server';

import { collection, getDocs, orderBy, query, writeBatch, doc, where } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import type { ConcreteCubeSample, GroupedConcreteCubeSample } from '@/lib/types';
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

export async function updateSampleSetDetails(receiptId: string, setNumber: number, data: Partial<GroupedConcreteCubeSample>): Promise<void> {
    const q = query(registerCollection, where('receiptId', '==', receiptId), where('setNumber', '==', setNumber));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
        throw new Error(`No samples found for receiptId ${receiptId} and setNumber ${setNumber}.`);
    }

    const batch = writeBatch(db);
    
    // These are fields that are shared across all samples in the set
    const sharedUpdateData: any = {};
    const updatableSharedFields = ['clientName', 'projectTitle', 'castingDate', 'testingDate', 'age', 'areaOfUse', 'class', 'machineUsed', 'recordedTemp', 'certificateNumber', 'comment', 'technician', 'dateOfIssue', 'issueId', 'takenBy', 'dateTaken', 'contact'];

    updatableSharedFields.forEach(field => {
        if (data.hasOwnProperty(field)) {
            sharedUpdateData[field] = (data as any)[field];
        }
    });

    snapshot.docs.forEach(document => {
        const sampleId = document.id;
        const individualSampleData = data.samples?.find(s => s.id === sampleId);
        
        const updateDataForDoc = { ...sharedUpdateData };

        // These are fields that are unique to each sample
        if (individualSampleData) {
            const updatableIndividualFields = ['length', 'width', 'height', 'weight', 'load', 'modeOfFailure', 'sampleSerialNumber'];
            updatableIndividualFields.forEach(field => {
                if (individualSampleData.hasOwnProperty(field)) {
                    updateDataForDoc[field] = (individualSampleData as any)[field];
                }
            });
        }
        
        if (Object.keys(updateDataForDoc).length > 0) {
            batch.update(document.ref, updateDataForDoc);
        }
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

export async function updateCubeTestResults(receiptId: string, setNumber: number, data: Partial<GroupedConcreteCubeSample>): Promise<void> {
    const q = query(registerCollection, where('receiptId', '==', receiptId), where('setNumber', '==', setNumber));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
        throw new Error(`No samples found for receiptId ${receiptId} and setNumber ${setNumber}.`);
    }

    const batch = writeBatch(db);

    const sharedData = {
      machineUsed: data.machineUsed,
      recordedTemp: data.recordedTemp,
    };

    snapshot.docs.forEach(doc => {
        const sampleId = doc.id;
        const sampleData = data.samples?.find(s => s.id === sampleId);
        
        if (sampleData) {
            const updatePayload = {
                ...sharedData,
                length: sampleData.length,
                width: sampleData.width,
                height: sampleData.height,
                weight: sampleData.weight,
                load: sampleData.load,
                modeOfFailure: sampleData.modeOfFailure,
            };
            batch.update(doc.ref, updatePayload);
        }
    });

    await batch.commit();
}

export async function issueCertificateForCubeTest(receiptId: string, setNumber: number, data: any): Promise<void> {
    const q = query(registerCollection, where('receiptId', '==', receiptId), where('setNumber', '==', setNumber));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
        throw new Error(`No samples found for receiptId ${receiptId} and setNumber ${setNumber}.`);
    }

    const batch = writeBatch(db);
    
    snapshot.docs.forEach(doc => {
        batch.update(doc.ref, data);
    });

    await batch.commit();
}

