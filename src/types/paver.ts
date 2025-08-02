
export type Paver = {
    id: string;
    dateReceived: string;
    client: string;
    project: string;
    castingDate: string;
    testingDate: string;
    ageDays: number;
    areaOfUse: string;
    sampleId: string;
    paverType: string;
    dimensions: {
        length: number;
        width: number;
        height: number;
    };
    paversPerSqMetre: number;
    calculatedArea: number;
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
export type PaverSet = Omit<Paver, 'id' | 'sampleId'> & {
    id: string; // Composite key for the set
    sampleIds: string[];
    docIds: string[]; // Firestore document IDs for each sample in the set
};
