
export type BlockAndBrick = {
    id: string; // Firestore document ID
    dateReceived: string;
    client: string;
    project: string;
    castingDate: string;
    testingDate: string;
    ageDays: number;
    areaOfUse: string;
    sampleId: string;
    sampleType: string;
    dimensions: {
        length: number;
        width: number;
        height: number;
    };
    dimensionsOfHoles: {
        holeA: {
            no: number;
            l: number;
            w: number;
        };
        holeB: {
            no: number;
            l: number;
            w: number;
        };
        notch: {
            no: number;
            l: number;
            w: number;
        };
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
export type BlockAndBrickSet = Omit<BlockAndBrick, 'id' | 'sampleId'> & {
    id: string; // Composite key for the set
    sampleIds: string[];
    docIds: string[]; // Firestore document IDs for each sample in the set
};
