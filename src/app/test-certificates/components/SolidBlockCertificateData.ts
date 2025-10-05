
import { CertificateStatus } from "@/lib/types";

export interface SolidBlockCertificateData {
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
  compressiveTestingMachineId: string;
  typeOfFailure: string;
  dateOfCasting: string;
  dateOfTesting: string;

  remarks: string[];
  checkedBy: { name: string; signatureURL?: string; };
  approvedBy: { name: string; signatureURL?: string; };
  clientRepresentative: string;
  
  testResults: SolidBlockTestResult[];
  averageCompressiveStrength?: number;
  status: CertificateStatus;
}

export interface SolidBlockTestResult {
  sampleNumber: string;
  length: number;
  width: number;
  height: number;
  crossSectionalArea: number;
  weight: number;
  density: number;
  failureLoad: number;
  correctedFailureLoad: number;
  compressiveStrength: number;
}

// Helper function to calculate average compressive strength
export function calculateAverageCompressiveStrength(results: SolidBlockTestResult[]): number | null {
  if (results.length === 0) return null;
  
  const sum = results.reduce((acc, result) => acc + result.compressiveStrength, 0);
  return sum / results.length;
}

// Helper function to check if results exceed repeatability condition (example logic)
export function exceedsRepeatabilityCondition(results: SolidBlockTestResult[], threshold: number = 9): boolean {
  if (results.length < 2) return false;
  
  const average = calculateAverageCompressiveStrength(results);
  if (average === null) return false;
  
  // Check if any result deviates more than the threshold percentage from the average
  return results.some(result => 
    Math.abs((result.compressiveStrength - average) / average) * 100 > threshold
  );
}


export function getSampleCountText(count: number) {
    const numbers = ['Zero', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve'];
    const countText = numbers[count] || count.toString();
    return `${countText} (${String(count).padStart(2, '0')})`;
}

    