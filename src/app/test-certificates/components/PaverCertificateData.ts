
import { CertificateStatus } from "@/lib/types";

export interface PaverCertificateData {
    certificateNo: string;
    dateOfIssue: string;
    version: string;
    clientName: string;
    clientAddress: string;
    clientContact: string;
    projectTitle: string;
    sampleDescription: string;
    conditionAtReceipt: string;
    dateOfReceipt: string;
    natureOfTest: string;
    samplingReport: string;
    testMethods: string;
    testLocation: string;
    testedBy: string;
    attachments: string;
    paverType: string;
    methodOfCompaction: string;
    testingAge: string;
    numberOfPaversPerSqm: number | null;
    calculatedArea?: number;
    areaUsedForStrength: string;
    areaOfUse: string;
    curingCondition: string;
    facilityTemperature: string;
    typeOfFailure: string;
    paverThickness: string;
    compressiveTestingMachineId: string;
    dateOfCasting: string;
    dateOfTesting: string;
    remarks: string[];
    checkedBy: { name: string; signatureURL?: string; };
    approvedBy: { name: string; signatureURL?: string; };
    clientRepresentative: string;
    testResults: PaverTestResult[];
    averageCompressiveStrength?: number;
    status: CertificateStatus;
}
  
export interface PaverTestResult {
    sampleNumber: string;
    measuredThickness: number;
    correctionFactor: number;
    computedPlanArea: number;
    weightOfSample: number;
    densityOfSample: number;
    failureLoad: number;
    correctedFailureLoad: number;
    compressiveStrength: number;
}

export function getCorrectionFactor(thickness: string): number {
    switch (thickness) {
        case "60 mm Plain": return 1.00;
        case "60 mm Chamfered": return 1.06;
        case "65 mm Plain": return 1.00;
        case "65 mm Chamfered": return 1.06;
        case "80 mm Plain": return 1.12;
        case "80 mm Chamfered": return 1.18;
        case "100 mm Plain": return 1.18;
        case "100 mm Chamfered": return 1.24;
        default: return 1.00;
    }
}

export function calculateAverageCompressiveStrength(results: PaverTestResult[]): number | null {
    if (results.length === 0) return null;
    const sum = results.reduce((acc, result) => acc + result.compressiveStrength, 0);
    return sum / results.length;
}

export function getSampleCountText(count: number): string {
    const numbers = ['Zero', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten'];
    return count <= 10 ? `${numbers[count]} (${String(count).padStart(2, '0')})` : `${count} (${count})`;
}

    