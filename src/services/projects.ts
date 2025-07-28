
'use server';

import { db } from '@/lib/firebase';
import { Project } from '@/types/project';
import { collection, getDocs, addDoc } from 'firebase/firestore';
import { fromFirestore } from './receipts';

const projectsCollection = collection(db, 'projects');


export async function getProjects(): Promise<Project[]> {
    const snapshot = await getDocs(projectsCollection);
    return snapshot.docs.map(doc => fromFirestore<Project>(doc));
}

export async function addProject(data: Omit<Project, 'id'>): Promise<Project> {
    const docRef = await addDoc(projectsCollection, data);
    return { id: docRef.id, ...data } as Project;
}
