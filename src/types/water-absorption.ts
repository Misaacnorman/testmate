
export type WaterAbsorption = {
    id: string;
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
    ovenDriedWeightBeforeSoaking: number;
    weightAfterSoaking: number;
    weightOfWater: number;
    calculatedWaterAbsorption: number;
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
