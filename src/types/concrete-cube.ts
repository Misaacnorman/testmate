
export type ConcreteCube = {
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
        length: number;
        width: number;
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
    date: string; // This is the date for 'Taken By'
    contact: string;
    sampleReceiptNumber: string;
};

// Represents a set of samples with common properties, for UI display
export type ConcreteCubeSet = {
    id: string; // Composite key for the set
    samples: ConcreteCube[];
    // Common properties for quick access
    client: string;
    project: string;
    dateReceived: string;
    castingDate: string;
    testingDate: string;
    class: string;
    areaOfUse: string;
};
