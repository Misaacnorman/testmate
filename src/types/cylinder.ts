
export type Cylinder = {
    id: string;
    dateReceived: string;
    client: string;
    project: string;
    castingDate: string;
    testingDate: string;
    class: string;
    ageDays: number;
    areaOfUse: string;
    sampleId: string;
    dimensions: {
        diameter: number;
        height: number;
    };
    weightKg: number;
    machineUsed: string;
    loadKN: number;
    modeOfFailure: string;
    recordedTemperature: string;
    certificateNumber: string;
    comment: string;
    technician: string;
    dateOfIssue: string;
    issueIdSerialNo: string;
    takenBy: string;
    date: string; 
    contact: string;
    sampleReceiptNo: string;
};

// Represents a set of samples with common properties, for UI display
export type CylinderSet = Omit<Cylinder, 'id' | 'sampleId'> & {
    id: string; // Composite key for the set
    sampleIds: string[];
    docIds: string[]; // Firestore document IDs for each sample in the set
};
