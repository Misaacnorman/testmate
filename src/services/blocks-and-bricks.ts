
'use server';

import { db } from '@/lib/firebase';
import { BlockAndBrick } from '@/types/block-and-brick';
import { collection, getDocs } from 'firebase/firestore';

const blocksAndBricksCollection = collection(db, 'blocksAndBricks');

const sampleBlocksAndBricks: BlockAndBrick[] = [
    {
        id: "1",
        dateReceived: "2024-05-01",
        client: "Constructo Corp",
        project: "Downtown Tower",
        castingDate: "2024-04-20",
        testingDate: "2024-05-18",
        ageDays: 28,
        areaOfUse: "External Wall",
        sampleId: "B-001",
        sampleType: "Hollow Block",
        dimensions: { length: 400, width: 200, height: 200 },
        dimensionsOfHoles: {
            holeA: { no: 2, l: 150, w: 80 },
            holeB: { no: 0, l: 0, w: 0 },
            notch: { no: 0, l: 0, w: 0 },
        },
        weightKg: 18.5,
        machineUsed: "Tinius Olsen",
        loadKN: 150,
        modeOfFailure: "Shear",
        recordedTemperature: "22°C",
        certificateNumber: "CERT-BB-001",
        comment: "Standard test.",
        technician: "Alice Johnson",
        dateOfIssue: "2024-05-20",
        issueIdSerialNo: "IS-001",
        takenBy: "Bob",
        date: "2024-05-20",
        contact: "123-456-7890",
        sampleReceiptNo: "SR-001"
    },
    {
        id: "2",
        dateReceived: "2024-05-02",
        client: "Future Homes",
        project: "Greenwood Villas",
        castingDate: "2024-04-15",
        testingDate: "2024-05-13",
        ageDays: 28,
        areaOfUse: "Pavement",
        sampleId: "BR-001",
        sampleType: "Solid Brick",
        dimensions: { length: 230, width: 110, height: 75 },
        dimensionsOfHoles: {
            holeA: { no: 0, l: 0, w: 0 },
            holeB: { no: 0, l: 0, w: 0 },
            notch: { no: 0, l: 0, w: 0 },
        },
        weightKg: 3.2,
        machineUsed: "Controls Group",
        loadKN: 80,
        modeOfFailure: "Crushing",
        recordedTemperature: "23°C",
        certificateNumber: "CERT-BB-002",
        comment: "Meets specifications.",
        technician: "Charlie Davis",
        dateOfIssue: "2024-05-15",
        issueIdSerialNo: "IS-002",
        takenBy: "Dave",
        date: "2024-05-15",
        contact: "098-765-4321",
        sampleReceiptNo: "SR-002"
    }
];


export async function getBlocksAndBricks(): Promise<BlockAndBrick[]> {
    return Promise.resolve(sampleBlocksAndBricks);
}
