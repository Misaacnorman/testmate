
'use server';

import { db } from '@/lib/firebase';
import { BlockAndBrick } from '@/types/block-and-brick';
import { collection, getDocs, addDoc, doc, updateDoc, DocumentData, QueryDocumentSnapshot } from 'firebase/firestore';
import { Timestamp } from 'firebase/firestore';
import { format } from 'date-fns';

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

export async function addBlockAndBrick(data: Omit<BlockAndBrick, 'id'>): Promise<BlockAndBrick> {
    const docRef = await addDoc(blocksAndBricksCollection, data);
    return { id: docRef.id, ...data } as BlockAndBrick;
}

export async function updateBlockAndBrick(item: BlockAndBrick): Promise<void> {
    const itemDoc = doc(db, 'blocksAndBricks', item.id);
    const { id, ...itemData } = item;
    await updateDoc(itemDoc, itemData);
}
