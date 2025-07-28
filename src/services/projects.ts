
'use server';

import { db } from '@/lib/firebase';
import { Project } from '@/types/project';
import { collection, getDocs, addDoc } from 'firebase/firestore';

const projectsCollection = collection(db, 'projects');


export async function getProjects(): Promise<Project[]> {
    const snapshot = await getDocs(projectsCollection);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Project));
}

export async function addProject(data: Omit<Project, 'id'>): Promise<Project> {
    const docRef = await addDoc(projectsCollection, data);
    return { id: docRef.id, ...data } as Project;
}
