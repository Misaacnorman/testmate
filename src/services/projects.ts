
'use server';

import { db } from '@/lib/firebase';
import { Project } from '@/types/project';
import { collection, getDocs, addDoc, doc, updateDoc, DocumentData, deleteDoc } from 'firebase/firestore';
import { Timestamp } from 'firebase/firestore';
import { format } from 'date-fns';

const projectsCollection = collection(db, 'projects');

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
