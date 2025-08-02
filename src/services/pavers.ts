
'use server';

import { db } from '@/lib/firebase';
import { Paver, PaverSet } from '@/types/paver';
import { collection, getDocs, addDoc, doc, updateDoc, deleteDoc, DocumentData, writeBatch } from 'firebase/firestore';
import { Timestamp } from 'firebase/firestore';
import { format } from 'date-fns';

const paversCollection = collection(db, 'pavers');

const fromFirestore = <T extends { id: string }>(doc: DocumentData): T => {
    const data = doc.data();
    
    const convertTimestamps = (obj: any): any => {
        if (obj === null || typeof obj !== 'object') {
            return obj;
        }

        if (obj instanceof Timestamp) {
            return format(obj.toDate(), 'yyyy-MM-dd');
        }

        if (Array.isArray(obj)) {
            return obj.map(convertTimestamps);
        }

        const newObj: { [key: string]: any } = {};
        for (const key in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, key)) {
                newObj[key] = convertTimestamps(obj[key]);
            }
        }
        return newObj;
    };

    const convertedData = convertTimestamps(data);
    convertedData.id = doc.id;
    
    return convertedData as T;
};


export async function getPavers(): Promise<Paver[]> {
    const snapshot = await getDocs(paversCollection);
    return snapshot.docs.map(doc => fromFirestore<Paver>(doc));
}

export async function getPaverSets(): Promise<PaverSet[]> {
    const samples = await getPavers();
    const sets: { [key: string]: PaverSet } = {};

    samples.forEach(sample => {
        const setKey = `${sample.sampleReceiptNo}-${sample.castingDate}-${sample.testingDate}-${sample.areaOfUse}-${sample.paverType}`;

        if (!sets[setKey]) {
            sets[setKey] = {
                ...sample,
                id: setKey, 
                sampleIds: [sample.sampleId],
                docIds: [sample.id]
            };
        } else {
            sets[setKey].sampleIds.push(sample.sampleId);
            sets[setKey].docIds.push(sample.id);
        }
    });

    return Object.values(sets);
}


export async function addPaver(data: Omit<Paver, 'id'>): Promise<Paver> {
    const docRef = await addDoc(paversCollection, data);
    return { id: docRef.id, ...data } as Paver;
}

export async function updatePaverSet(itemSet: PaverSet): Promise<void> {
    const batch = writeBatch(db);
    const { docIds, sampleIds, ...setData } = itemSet;

    docIds.forEach(docId => {
        const docRef = doc(db, 'pavers', docId);
        const dataToUpdate = { ...setData };
        delete (dataToUpdate as any).id;
        batch.update(docRef, dataToUpdate);
    });
    
    await batch.commit();
}


export async function deletePaver(paverId: string): Promise<void> {
    const paverDoc = doc(db, 'pavers', paverId);
    await deleteDoc(paverDoc);
}

export async function deletePaverSet(docIds: string[]): Promise<void> {
    const batch = writeBatch(db);
    docIds.forEach(docId => {
        const docRef = doc(db, 'pavers', docId);
        batch.delete(docRef);
    });
    await batch.commit();
}
