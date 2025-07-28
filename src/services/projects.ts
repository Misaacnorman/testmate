
'use server';

import { db } from '@/lib/firebase';
import { Project } from '@/types/project';
import { collection, getDocs, addDoc } from 'firebase/firestore';

const projectsCollection = collection(db, 'projects');

const sampleProjects: Project[] = [
    {
        id: "PROJ001",
        date: "2024-01-05",
        projectId: { big: "BP-2024-01", small: "SP-2024-01" },
        client: "Global Corp",
        project: "Headquarters Expansion",
        engineerInCharge: "Alice Williams",
        fieldWork: {
            details: "10 field density tests, 5 soil samples",
            technician: "Bob Brown",
            startDate: "2024-01-10",
            endDate: "2024-01-12",
            remarks: "Weather conditions were optimal."
        },
        labWork: {
            details: "Sieve analysis, Atterberg limits",
            technician: "Charlie Green",
            startDate: "2024-01-15",
            agreedDeliveryDate: "2024-01-25",
            signatureAgreed: "A.W.",
            actualDeliveryDate: "2024-01-24",
            signatureActual: "C.G.",
            remarks: "All tests completed ahead of schedule."
        },
        dispatch: {
            acknowledgement: "Received by client's representative.",
            issuedBy: "Diana Prince",
            deliveredTo: "Mr. Smith",
            contact: "555-0101",
            dateTime: "2024-01-25 10:00 AM"
        }
    },
    {
        id: "PROJ002",
        date: "2024-02-10",
        projectId: { big: "BP-2024-02", small: "SP-2024-05" },
        client: "Innovatech",
        project: "New Research Facility",
        engineerInCharge: "Frank Miller",
        fieldWork: {
            details: "20 concrete core samples",
            technician: "Grace Lee",
            startDate: "2024-02-15",
            endDate: "2024-02-18",
            remarks: "Difficult drilling conditions in some areas."
        },
        labWork: {
            details: "Compressive strength test on all 20 cores",
            technician: "Henry Wilson",
            startDate: "2024-02-20",
            agreedDeliveryDate: "2024-03-05",
            signatureAgreed: "F.M.",
            actualDeliveryDate: "2024-03-05",
            signatureActual: "H.W.",
            remarks: "Results vary, detailed report attached."
        },
        dispatch: {
            acknowledgement: "Emailed and confirmed receipt.",
            issuedBy: "Ivy Chen",
            deliveredTo: "Dr. Evans",
            contact: "555-0102",
            dateTime: "2024-03-05 03:30 PM"
        }
    }
];

export async function getProjects(): Promise<Project[]> {
    // This is a temporary measure to keep the UI populated.
    // In a real scenario, you'd fetch from Firestore like this:
    // const snapshot = await getDocs(projectsCollection);
    // return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Project));
    return Promise.resolve(sampleProjects);
}

export async function addProject(data: Omit<Project, 'id'>): Promise<Project> {
    // For now, we add to the local sample data.
    // Replace with Firestore logic in production.
    const newProject: Project = {
        id: `PROJ-${Date.now()}`,
        ...data,
    };
    sampleProjects.push(newProject);
    // const docRef = await addDoc(projectsCollection, data);
    // return { id: docRef.id, ...data };
    return Promise.resolve(newProject);
}

    