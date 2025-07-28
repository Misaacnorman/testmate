
'use server';

import { db } from '@/lib/firebase';
import { Paver } from '@/types/paver';
import { collection, getDocs } from 'firebase/firestore';

const paversCollection = collection(db, 'pavers');

export async function getPavers(): Promise<Paver[]> {
    // For now, this will return an empty array.
    // In the future, we would fetch from Firestore and map the data.
    /*
    const snapshot = await getDocs(paversCollection);
    return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    } as Paver));
    */
    
    return Promise.resolve([]);
}
