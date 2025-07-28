
'use server';

import { db } from '@/lib/firebase';
import { BlockAndBrick } from '@/types/block-and-brick';
import { collection, getDocs, addDoc } from 'firebase/firestore';
import { fromFirestore } from './receipts';

const blocksAndBricksCollection = collection(db, 'blocksAndBricks');

export async function getBlocksAndBricks(): Promise<BlockAndBrick[]> {
    const snapshot = await getDocs(blocksAndBricksCollection);
    return snapshot.docs.map(doc => fromFirestore<BlockAndBrick>(doc));
}

export async function addBlockAndBrick(data: Omit<BlockAndBrick, 'id'>): Promise<BlockAndBrick> {
    const docRef = await addDoc(blocksAndBricksCollection, data);
    return { id: docRef.id, ...data } as BlockAndBrick;
}
