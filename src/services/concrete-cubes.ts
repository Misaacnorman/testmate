
'use server';

import { db } from '@/lib/firebase';
import { ConcreteCube } from '@/types/concrete-cube';
import { collection, getDocs } from 'firebase/firestore';

const concreteCubesCollection = collection(db, 'concreteCubes');

export async function getConcreteCubes(): Promise<ConcreteCube[]> {
    // For now, this will return an empty array.
    // In the future, we would fetch from Firestore and map the data.
    /*
    const snapshot = await getDocs(concreteCubesCollection);
    return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    } as ConcreteCube));
    */
    
    return Promise.resolve([]);
}
