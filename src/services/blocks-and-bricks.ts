
'use server';

import { db } from '@/lib/firebase';
import { BlockAndBrick } from '@/types/block-and-brick';
import { collection, getDocs } from 'firebase/firestore';

const blocksAndBricksCollection = collection(db, 'blocksAndBricks');

export async function getBlocksAndBricks(): Promise<BlockAndBrick[]> {
    // For now, this will return an empty array.
    // In the future, we would fetch from Firestore and map the data.
    /*
    const snapshot = await getDocs(blocksAndBricksCollection);
    return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    } as BlockAndBrick));
    */
    
    return Promise.resolve([]);
}
