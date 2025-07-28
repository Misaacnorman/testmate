
'use server';

import { db } from '@/lib/firebase';
import { WaterAbsorption } from '@/types/water-absorption';
import { collection, getDocs, addDoc } from 'firebase/firestore';

const waterAbsorptionsCollection = collection(db, 'waterAbsorptions');

const sampleWaterAbsorptions: WaterAbsorption[] = [
    {
        id: "WA001",
        dateReceived: "2024-04-15",
        client: "Brick Masters Ltd.",
        project: "Heritage Building Restoration",
        castingDate: "N/A",
        testingDate: "2024-04-22",
        ageDays: 0,
        areaOfUse: "Facade",
        sampleId: "HB-01",
        sampleType: "Handmade Brick",
        dimensions: { length: 228, width: 108, height: 54 },
        ovenDriedWeightBeforeSoaking: 2.15,
        weightAfterSoaking: 2.45,
        weightOfWater: 0.30,
        calculatedWaterAbsorption: 13.95,
        certificateNumber: "CERT-WA-001",
        comment: "Absorption within historical specs.",
        technician: "Grace Hopper",
        dateOfIssue: "2024-04-23",
        issueIdSerialNo: "IS-WA-001",
        takenBy: "Architect",
        date: "2024-04-22",
        contact: "222-333-4444",
        sampleReceiptNo: "SR-WA-001"
    },
    {
        id: "WA002",
        dateReceived: "2024-04-16",
        client: "Modern Masonry",
        project: "Residential Block B",
        castingDate: "2024-03-10",
        testingDate: "2024-04-23",
        ageDays: 44,
        areaOfUse: "Internal Partition",
        sampleId: "CMU-05",
        sampleType: "Concrete Masonry Unit",
        dimensions: { length: 390, width: 190, height: 190 },
        ovenDriedWeightBeforeSoaking: 15.2,
        weightAfterSoaking: 16.0,
        weightOfWater: 0.8,
        calculatedWaterAbsorption: 5.26,
        certificateNumber: "CERT-WA-002",
        comment: "Low absorption, suitable for purpose.",
        technician: "Alan Turing",
        dateOfIssue: "2024-04-24",
        issueIdSerialNo: "IS-WA-002",
        takenBy: "Contractor",
        date: "2024-04-23",
        contact: "111-222-3333",
        sampleReceiptNo: "SR-WA-002"
    }
];

export async function getWaterAbsorptions(): Promise<WaterAbsorption[]> {
    // This is a temporary measure to keep the UI populated.
    // In a real scenario, you'd fetch from Firestore like this:
    // const snapshot = await getDocs(waterAbsorptionsCollection);
    // return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as WaterAbsorption));
    return Promise.resolve(sampleWaterAbsorptions);
}

export async function addWaterAbsorption(data: Omit<WaterAbsorption, 'id'>): Promise<WaterAbsorption> {
    // For now, we add to the local sample data.
    // Replace with Firestore logic in production.
    const newEntry: WaterAbsorption = {
        id: `WA-${Date.now()}`,
        ...data,
    };
    sampleWaterAbsorptions.push(newEntry);
    // const docRef = await addDoc(waterAbsorptionsCollection, data);
    // return { id: docRef.id, ...data };
    return Promise.resolve(newEntry);
}

    