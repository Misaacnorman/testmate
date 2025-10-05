
import { CertificateStatus } from "@/lib/types";

export interface WaterAbsorptionCertificateData {
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
  
  sampleType: string;
  methodOfCompaction: string;
  testingAge: string;
  areaOfUse: string;
  curingCondition: string;
  facilityTemperature: string;
  dateOfCasting: string;
  dateOfTesting: string;

  remarks: string[];
  checkedBy: { name: string; signatureURL?: string; };
  approvedBy: { name: string; signatureURL?: string; };
  clientRepresentative: string;
  
  testResults: WaterAbsorptionTestResult[];
  averageWaterAbsorption?: number;
  status: CertificateStatus;
}

export interface WaterAbsorptionTestResult {
  sampleNumber: string;
  length: number;
  width: number;
  height: number;
  crossSectionalArea: number;
  initialOvenWeight: number;
  weightAfterSoaking: number;
  massDifference: number;
  waterAbsorptionPercentage: number;
}

export function calculateAverageWaterAbsorption(results: WaterAbsorptionTestResult[]): number | null {
  if (results.length === 0) return null;
  const sum = results.reduce((acc, result) => acc + result.waterAbsorptionPercentage, 0);
  return sum / results.length;
}

export function getSampleCountText(count: number) {
    const numbers = ['Zero', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve'];
    const countText = numbers[count] || count.toString();
    return `${countText} (${String(count).padStart(2, '0')})`;
}

    