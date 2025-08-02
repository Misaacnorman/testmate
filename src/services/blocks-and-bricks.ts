
'use server';

import { db } from '@/lib/firebase';
import { BlockAndBrick, BlockAndBrickSet } from '@/types/block-and-brick';
import { collection, getDocs, addDoc, doc, updateDoc, DocumentData, QueryDocumentSnapshot, writeBatch } from 'firebase/firestore';
import { Timestamp } from 'firebase/firestore';
import { format } from 'date-fns';

const blocksAndBricksCollection = collection(db, 'blocksAndBricks');

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

export async function getBlocksAndBricks(): Promise<BlockAndBrick[]> {
    const snapshot = await getDocs(blocksAndBricksCollection);
    return snapshot.docs.map(doc => fromFirestore<BlockAndBrick>(doc));
}

export async function getBlocksAndBricksSets(): Promise<BlockAndBrickSet[]> {
    const samples = await getBlocksAndBricks();
    const sets: { [key: string]: BlockAndBrickSet } = {};

    samples.forEach(sample => {
        const setKey = `${sample.sampleReceiptNo}-${sample.castingDate}-${sample.testingDate}-${sample.areaOfUse}-${sample.sampleType}`;

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

export async function addBlockAndBrick(data: Omit<BlockAndBrick, 'id'>): Promise<BlockAndBrick> {
    const docRef = await addDoc(blocksAndBricksCollection, data);
    return { id: docRef.id, ...data } as BlockAndBrick;
}

export async function updateBlockAndBrickSet(itemSet: BlockAndBrickSet): Promise<void> {
    const batch = writeBatch(db);
    const { docIds, sampleIds, ...setData } = itemSet;

    docIds.forEach(docId => {
        const docRef = doc(db, 'blocksAndBricks', docId);
        // Create a copy of the set data for each doc, since updateDoc modifies the object
        const dataToUpdate = { ...setData };
        delete (dataToUpdate as any).id; // Remove the composite key before writing
        batch.update(docRef, dataToUpdate);
    });

    await batch.commit();
}
