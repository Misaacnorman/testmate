
'use server';

import { db } from '@/lib/firebase';
import { Cylinder } from '@/types/cylinder';
import { collection, getDocs } from 'firebase/firestore';

const cylindersCollection = collection(db, 'cylinders');

export async function getCylinders(): Promise<Cylinder[]> {
    // For now, this will return an empty array.
    // In the future, we would fetch from Firestore and map the data.
    /*
    const snapshot = await getDocs(cylindersCollection);
    return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    } as Cylinder));
    */
    
    return Promise.resolve([]);
}
