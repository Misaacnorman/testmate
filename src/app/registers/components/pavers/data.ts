'use server';

import { collection, getDocs, orderBy, query, writeBatch, doc, where } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import type { PaverSample, GroupedPaverSample } from '@/lib/types';
import { fromFirestore } from '@/lib/utils';

const registerCollection = collection(db, 'pavers-register');

export async function getPavers(): Promise<PaverSample[]> {
  // Simulate network delay for a better UX
  await new Promise(resolve => setTimeout(resolve, 500));
  try {
    const q = query(registerCollection, orderBy('receivedAt', 'desc'));
    const snapshot = await getDocs(q);
    if (snapshot.empty) {
        console.log("No documents found in pavers-register.");
        return [];
    }
    return snapshot.docs.map(doc => fromFirestore<PaverSample>({ id: doc.id, ...doc.data() }));
  } catch(e) {
    console.error("Error fetching from pavers-register: ", e);
    // If collection doesn't exist, it will throw. Return empty array in that case.
    return [];
  }
}

export async function updateSampleSetDetails(receiptId: string, testId: string, setNumber: number, data: Partial<GroupedPaverSample>): Promise<void> {
    const q = query(registerCollection, where('receiptId', '==', receiptId), where('testId', '==', testId), where('setNumber', '==', setNumber));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
        throw new Error(`No samples found for receiptId ${receiptId}, testId ${testId}, and setNumber ${setNumber}.`);
    }

    const batch = writeBatch(db);
    
    // These are fields that are shared across all samples in the set
    const sharedUpdateData: any = {};
    const updatableSharedFields = ['clientName', 'projectTitle', 'castingDate', 'testingDate', 'age', 'areaOfUse', 'paverType', 'machineUsed', 'recordedTemp', 'certificateNumber', 'comment', 'technician', 'dateOfIssue', 'issueId', 'takenBy', 'dateTaken', 'contact', 'paversPerSqM'];

    updatableSharedFields.forEach(field => {
        if (data.hasOwnProperty(field)) {
            const value = (data as any)[field];
            sharedUpdateData[field] = value === undefined ? null : value;
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
                    const value = (individualSampleData as any)[field];
                    updateDataForDoc[field] = value === undefined ? null : value;
                }
            });
        }
        
        if (Object.keys(updateDataForDoc).length > 0) {
            batch.update(document.ref, updateDataForDoc);
        }
    });

    await batch.commit();
}


export async function deletePaverTestGroup(receiptId: string, testId: string, setNumber: number): Promise<void> {
    const q = query(registerCollection, where('receiptId', '==', receiptId), where('testId', '==', testId), where('setNumber', '==', setNumber));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
        console.warn(`No samples found for receiptId ${receiptId}, testId ${testId}, and setNumber ${setNumber} to delete.`);
        return;
    }

    const batch = writeBatch(db);
    snapshot.docs.forEach(document => {
        batch.delete(document.ref);
    });

    await batch.commit();
}

export async function updatePaverTestResults(receiptId: string, testId: string, setNumber: number, data: Partial<GroupedPaverSample>): Promise<void> {
    const q = query(registerCollection, where('receiptId', '==', receiptId), where('testId', '==', testId), where('setNumber', '==', setNumber));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
        throw new Error(`No samples found for receiptId ${receiptId}, testId ${testId} and setNumber ${setNumber}.`);
    }

    const batch = writeBatch(db);

    const sharedData = {
      machineUsed: data.machineUsed,
      recordedTemp: data.recordedTemp === undefined ? null : data.recordedTemp,
      paversPerSqM: data.paversPerSqM,
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
             for (const key in updatePayload) {
                if (updatePayload[key as keyof typeof updatePayload] === undefined) {
                    (updatePayload as any)[key] = null;
                }
            }
            batch.update(doc.ref, updatePayload);
        }
    });

    await batch.commit();
}

export async function issueCertificateForPaverTest(receiptId: string, testId: string, setNumber: number, data: any): Promise<void> {
    const q = query(registerCollection, where('receiptId', '==', receiptId), where('testId', '==', testId), where('setNumber', '==', setNumber));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
        throw new Error(`No samples found for receiptId ${receiptId}, testId ${testId} and setNumber ${setNumber}.`);
    }

    const batch = writeBatch(db);
    
     for (const key in data) {
        if (data[key] === undefined) {
            data[key] = null;
        }
    }

    snapshot.docs.forEach(doc => {
        batch.update(doc.ref, data);
    });

    await batch.commit();
}
