
'use server';

import { db } from '@/lib/firebase';
import { Paver } from '@/types/paver';
import { collection, getDocs, addDoc } from 'firebase/firestore';

const paversCollection = collection(db, 'pavers');

const samplePavers: Paver[] = [
    {
        id: "PAVER001",
        dateReceived: "2024-03-10",
        client: "City Landscaping",
        project: "Central Park Walkway",
        castingDate: "2024-02-10",
        testingDate: "2024-03-09",
        ageDays: 28,
        areaOfUse: "Pedestrian Walkway",
        sampleId: "PW-01",
        paverType: "Interlocking",
        dimensions: { length: 200, width: 100, height: 60 },
        paversPerSqMetre: 50,
        calculatedArea: 20000,
        weightKg: 2.5,
        machineUsed: "MATEST",
        loadKN: 55.0,
        modeOfFailure: "Splitting",
        recordedTemperature: "20°C",
        certificateNumber: "CERT-PV-001",
        comment: "Conforms to Class A requirements.",
        technician: "Sarah Green",
        dateOfIssue: "2024-03-11",
        issueIdSerialNo: "IS-PV-001",
        takenBy: "Landscape Architect",
        date: "2024-03-09",
        contact: "444-555-6666",
        sampleReceiptNo: "SR-PV-001"
    },
    {
        id: "PAVER002",
        dateReceived: "2024-03-12",
        client: "Industrial Complex Ltd.",
        project: "Warehouse Loading Bay",
        castingDate: "2024-02-12",
        testingDate: "2024-03-11",
        ageDays: 28,
        areaOfUse: "Heavy Duty Pavement",
        sampleId: "LB-02",
        paverType: "Heavy Duty",
        dimensions: { length: 220, width: 110, height: 80 },
        paversPerSqMetre: 41,
        calculatedArea: 24200,
        weightKg: 4.1,
        machineUsed: "MATEST",
        loadKN: 95.2,
        modeOfFailure: "Flexural",
        recordedTemperature: "21°C",
        certificateNumber: "CERT-PV-002",
        comment: "Suitable for heavy traffic.",
        technician: "David Black",
        dateOfIssue: "2024-03-13",
        issueIdSerialNo: "IS-PV-002",
        takenBy: "Project Manager",
        date: "2024-03-11",
        contact: "777-888-9999",
        sampleReceiptNo: "SR-PV-002"
    }
];

export async function getPavers(): Promise<Paver[]> {
    // This is a temporary measure to keep the UI populated.
    // In a real scenario, you'd fetch from Firestore like this:
    // const snapshot = await getDocs(paversCollection);
    // return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Paver));
    return Promise.resolve(samplePavers);
}


export async function addPaver(data: Omit<Paver, 'id'>): Promise<Paver> {
    // For now, we add to the local sample data.
    // Replace with Firestore logic in production.
    const newEntry: Paver = {
        id: `PAVER-${Date.now()}`,
        ...data,
    };
    samplePavers.push(newEntry);
    // const docRef = await addDoc(paversCollection, data);
    // return { id: docRef.id, ...data };
    return Promise.resolve(newEntry);
}

    