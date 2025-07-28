
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
