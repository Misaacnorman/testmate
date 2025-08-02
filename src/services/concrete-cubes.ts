
'use server';

import { db } from '@/lib/firebase';
import { ConcreteCube, ConcreteCubeSet } from '@/types/concrete-cube';
import { collection, getDocs, addDoc, doc, updateDoc, DocumentData, writeBatch } from 'firebase/firestore';
import { Timestamp } from 'firebase/firestore';
import { format } from 'date-fns';

const concreteCubesCollection = collection(db, 'concreteCubes');

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

export async function getConcreteCubes(): Promise<ConcreteCube[]> {
    const snapshot = await getDocs(concreteCubesCollection);
    return snapshot.docs.map(doc => fromFirestore<ConcreteCube>(doc));
}

export async function getConcreteCubeSets(): Promise<ConcreteCubeSet[]> {
    const samples = await getConcreteCubes();
    const sets: { [key: string]: ConcreteCubeSet } = {};

    samples.forEach(sample => {
        const setKey = `${sample.sampleReceiptNumber}-${sample.castingDate}-${sample.testingDate}-${sample.areaOfUse}-${sample.class}`;

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

export async function addConcreteCube(data: Omit<ConcreteCube, 'id'>): Promise<ConcreteCube> {
    const docRef = await addDoc(concreteCubesCollection, data);
    return { id: docRef.id, ...data } as ConcreteCube;
}

export async function updateConcreteCubeSet(itemSet: ConcreteCubeSet): Promise<void> {
    const batch = writeBatch(db);
    const { docIds, sampleIds, ...setData } = itemSet;

    docIds.forEach(docId => {
        const docRef = doc(db, 'concreteCubes', docId);
        const dataToUpdate = { ...setData };
        delete (dataToUpdate as any).id;
        batch.update(docRef, dataToUpdate);
    });
    
    await batch.commit();
}
    

