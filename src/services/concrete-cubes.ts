
'use server';

import { db } from '@/lib/firebase';
import { ConcreteCube } from '@/types/concrete-cube';
import { collection, getDocs } from 'firebase/firestore';

const concreteCubesCollection = collection(db, 'concreteCubes');

const sampleCubes: ConcreteCube[] = [
    {
        id: "CUBE001",
        dateReceived: "2024-01-15",
        client: "Mega Constructions",
        project: "City Mall",
        castingDate: "2024-01-01",
        testingDate: "2024-01-29",
        class: "C30/37",
        ageDays: 28,
        areaOfUse: "Foundation",
        sampleId: "F1-A",
        dimensions: { length: 150, width: 150, height: 150 },
        weightKg: 8.5,
        machineUsed: "Tinius Olsen",
        loadKN: 350.5,
        modeOfFailure: "Explosive",
        recordedTemperature: "23°C",
        certificateNumber: "CERT-2024-001",
        comment: "Exceeded strength requirements.",
        technician: "John Doe",
        dateOfIssue: "2024-02-01",
        issueIdSerialNo: "ID-001",
        takenBy: "Site Engineer",
        date: "2024-01-29",
        contact: "123456789",
        sampleReceiptNumber: "SRN-001"
    },
    {
        id: "CUBE002",
        dateReceived: "2024-02-20",
        client: "Urban Developers",
        project: "Sky High Apartments",
        castingDate: "2024-02-13",
        testingDate: "2024-02-20",
        class: "C25/30",
        ageDays: 7,
        areaOfUse: "Column - L1",
        sampleId: "C1-B",
        dimensions: { length: 150, width: 150, height: 150 },
        weightKg: 8.6,
        machineUsed: "Controls Group",
        loadKN: 280.0,
        modeOfFailure: "Typical",
        recordedTemperature: "22°C",
        certificateNumber: "CERT-2024-002",
        comment: "Passed 7-day strength test.",
        technician: "Jane Smith",
        dateOfIssue: "2024-02-22",
        issueIdSerialNo: "ID-002",
        takenBy: "Foreman",
        date: "2024-02-20",
        contact: "987654321",
        sampleReceiptNumber: "SRN-002"
    },
];

export async function getConcreteCubes(): Promise<ConcreteCube[]> {
    return Promise.resolve(sampleCubes);
}
