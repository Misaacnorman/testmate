
'use server';

import { db } from '@/lib/firebase';
import { Project } from '@/types/project';
import { collection, getDocs, addDoc, doc, updateDoc, DocumentData, deleteDoc } from 'firebase/firestore';
import { Timestamp } from 'firebase/firestore';

const projectsCollection = collection(db, 'projects');

const fromFirestore = <T extends { id: string }>(doc: DocumentData): T => {
    const data = doc.data();
    const convertedData: { [key: string]: any } = { id: doc.id };

    for (const key in data) {
        if (Object.prototype.hasOwnProperty.call(data, key)) {
            const value = data[key];
            if (value instanceof Timestamp) {
                convertedData[key] = value.toDate();
            } else if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
                // Recursively convert nested objects, but not arrays for now
                const nestedData = { ...value };
                for(const nestedKey in nestedData) {
                    if (nestedData[nestedKey] instanceof Timestamp) {
                        nestedData[nestedKey] = nestedData[nestedKey].toDate();
                    }
                }
                 convertedData[key] = nestedData;
            } else {
                convertedData[key] = value;
            }
        }
    }
    return convertedData as T;
};


export async function getProjects(): Promise<Project[]> {
    const snapshot = await getDocs(projectsCollection);
    return snapshot.docs.map(doc => fromFirestore<Project>(doc));
}

export async function addProject(data: Omit<Project, 'id'>): Promise<Project> {
    const docRef = await addDoc(projectsCollection, data);
    return { id: docRef.id, ...data } as Project;
}

export async function updateProject(project: Project): Promise<void> {
    const projectDoc = doc(db, 'projects', project.id);
    const { id, ...projectData } = project;
    await updateDoc(projectDoc, projectData);
}

export async function deleteProject(projectId: string): Promise<void> {
    const projectDoc = doc(db, 'projects', projectId);
    await deleteDoc(projectDoc);
}
