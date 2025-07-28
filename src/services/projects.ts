
'use server';

import { db } from '@/lib/firebase';
import { Project } from '@/types/project';
import { collection, getDocs } from 'firebase/firestore';

const projectsCollection = collection(db, 'projects');

export async function getProjects(): Promise<Project[]> {
    // For now, this will return an empty array as we don't have data.
    // In the future, we would fetch from Firestore like this:
    /*
    const snapshot = await getDocs(projectsCollection);
    return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    } as Project));
    */
    
    return Promise.resolve([]);
}
