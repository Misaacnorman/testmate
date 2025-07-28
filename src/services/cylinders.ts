
'use server';

import { db } from '@/lib/firebase';
import { Cylinder } from '@/types/cylinder';
import { collection, getDocs, addDoc } from 'firebase/firestore';

const cylindersCollection = collection(db, 'cylinders');

const sampleCylinders: Cylinder[] = [
    {
        id: "CYL001",
        dateReceived: "2024-05-10",
        client: "InfraWorks Inc.",
        project: "Highway 101 Bridge",
        castingDate: "2024-04-12",
        testingDate: "2024-05-10",
        class: "C40/50",
        ageDays: 28,
        areaOfUse: "Bridge Deck",
        sampleId: "BD-01",
        dimensions: { diameter: 150, height: 300 },
        weightKg: 12.5,
        machineUsed: "ELE International",
        loadKN: 850.0,
        modeOfFailure: "Cone and Shear",
        recordedTemperature: "21°C",
        certificateNumber: "CERT-CYL-001",
        comment: "High strength concrete, performing as expected.",
        technician: "Emily White",
        dateOfIssue: "2024-05-12",
        issueIdSerialNo: "IS-CYL-001",
        takenBy: "QA/QC Inspector",
        date: "2024-05-10",
        contact: "555-1234",
        sampleReceiptNo: "SR-CYL-001"
    },
    {
        id: "CYL002",
        dateReceived: "2024-05-11",
        client: "Residential Builders",
        project: "Sunset Homes",
        castingDate: "2024-05-04",
        testingDate: "2024-05-11",
        class: "C20/25",
        ageDays: 7,
        areaOfUse: "Driveway",
        sampleId: "DW-02",
        dimensions: { diameter: 150, height: 300 },
        weightKg: 12.2,
        machineUsed: "Tinius Olsen",
        loadKN: 450.7,
        modeOfFailure: "Typical Cone",
        recordedTemperature: "23°C",
        certificateNumber: "CERT-CYL-002",
        comment: "7-day test satisfactory.",
        technician: "Michael Brown",
        dateOfIssue: "2024-05-13",
        issueIdSerialNo: "IS-CYL-002",
        takenBy: "Site Supervisor",
        date: "2024-05-11",
        contact: "555-5678",
        sampleReceiptNo: "SR-CYL-002"
    }
];

export async function getCylinders(): Promise<Cylinder[]> {
    // This is a temporary measure to keep the UI populated.
    // In a real scenario, you'd fetch from Firestore like this:
    // const snapshot = await getDocs(cylindersCollection);
    // return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Cylinder));
    return Promise.resolve(sampleCylinders);
}


export async function addCylinder(data: Omit<Cylinder, 'id'>): Promise<Cylinder> {
    // For now, we add to the local sample data.
    // Replace with Firestore logic in production.
    const newEntry: Cylinder = {
        id: `CYL-${Date.now()}`,
        ...data,
    };
    sampleCylinders.push(newEntry);
    // const docRef = await addDoc(cylindersCollection, data);
    // return { id: docRef.id, ...data };
    return Promise.resolve(newEntry);
}

    