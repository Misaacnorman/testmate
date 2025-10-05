

import { CertificateStatus } from "@/lib/types";

// CertificateData.ts
export interface CertificateData {
  certificateNo: string;
  dateOfIssue: string;
  status: CertificateStatus;
  version: string;
  clientName: string;
  clientAddress: string;
  projectTitle: string;
  sampleDescription: string;
  conditionAtReceipt: string;
  dateOfReceipt: string;
  samplingReport: string;
  testedBy: string;
  sampleTypeSize: string;
  curingCondition: string;
  classOfConcrete: string;
  designCompressiveStrength: string;
  testingAge: string;
  typeOfFailure: string;
  areaOfUse: string;
  testMethod: string;
  testLocation: string;
  compressiveTestingMachineId: string;
  dateOfCasting: string;
  dateOfTesting: string;
  curingPeriodAtFacility: string;
  facilityTemperature: string;
  clientContact: string;
  clientRepresentative: string;
  remarks: string[];
  checkedBy: string;
  approvedByEngineer: { name: string; signatureURL?: string };
  approvedByManager: { name: string; signatureURL?: string };
  testResults: TestResult[];
  averageCompressiveStrength?: number; // Optional if calculable
}

export interface TestResult {
  sampleNumber: string;
  length: number;
  width: number;
  height: number;
  weight: number;
  failureLoad: number;
  correctedFailureLoad: number;
  density: number;
  compressiveStrength: number;
  crossSectionalArea: number;
}

// Helper function to calculate average compressive strength
export function calculateAverageCompressiveStrength(results: TestResult[]): number | null {
  if (results.length === 0) return null;
  
  const sum = results.reduce((acc, result) => acc + result.compressiveStrength, 0);
  return sum / results.length;
}

// Helper function to check if results exceed repeatability condition (example logic)
export function exceedsRepeatabilityCondition(results: TestResult[], threshold: number = 9): boolean {
  if (results.length < 2) return false;
  
  const average = calculateAverageCompressiveStrength(results);
  if (average === null) return false;
  
  // Check if any result deviates more than the threshold percentage from the average
  return results.some(result => 
    Math.abs((result.compressiveStrength - average) / average) * 100 > threshold
  );
}

    
