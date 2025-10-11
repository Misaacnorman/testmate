import { CertificateData } from './html-pdf-generator';
import { type Receipt, type User, type CorrectionFactorMachine, type Laboratory } from './types';

export interface ConcreteCertificateComponentData {
  certificateData: {
    receiptId: string;
    [key: string]: any;
  };
  laboratory: Laboratory | null;
  laboratoryId: string;
  user: User | null;
  receipt: Receipt | null;
  machine: CorrectionFactorMachine | null;
  approvers: {
    engineer?: User;
    manager?: User;
  };
  mappedData: {
    certificateNo: string;
    clientName: string;
    clientAddress: string;
    clientContact: string;
    projectTitle: string;
    sampleDescription: string;
    conditionAtReceipt: string;
    dateOfReceipt: string;
    samplingReport: string;
    natureOfTest: string;
    testedBy: string;
    testMethods: string;
    testLocation: string;
    attachments: string;
    sampleTypeSize: string;
    classOfConcrete: string;
    designCompressiveStrength: string;
    testingAge: string;
    areaOfUse: string;
    compressiveTestingMachineId: string;
    curingCondition: string;
    curingPeriodAtFacility: string;
    facilityTemperature: string;
    typeOfFailure: string;
    testResults: Array<{
      sampleNumber: string;
      length: number;
      width: number;
      height: number;
      weight: number;
      failureLoad: number;
      correctedFailureLoad: number;
      compressiveStrength: number;
    }>;
    dateOfCasting: string;
    dateOfTesting: string;
    averageCompressiveStrength: number;
    checkedBy: string;
    approvedByEngineer: { name: string; signatureURL?: string };
    approvedByManager: { name: string; signatureURL?: string };
    remarks: string[];
  };
}

export function mapConcreteCertificateData(componentData: ConcreteCertificateComponentData): CertificateData {
  const { laboratory, mappedData, approvers } = componentData;
  
  return {
    // Company info
    logoUrl: laboratory?.logo || '',
    companyName: laboratory?.name || '',
    companyAddress: laboratory?.address || '',
    companyEmail: laboratory?.email || '',
    
    // Certificate info
    certificateNo: mappedData.certificateNo,
    dateOfIssue: mappedData.dateOfReceipt, // Using date of receipt as issue date
    version: '01', // This will be incremented on each print
    
    // Client info
    clientName: mappedData.clientName,
    clientAddress: mappedData.clientAddress,
    clientContact: mappedData.clientContact,
    projectTitle: mappedData.projectTitle,
    conditionAtReceipt: mappedData.conditionAtReceipt,
    dateOfReceipt: mappedData.dateOfReceipt,
    samplingReport: mappedData.samplingReport,
    natureOfTest: mappedData.natureOfTest,
    testedBy: mappedData.testedBy,
    testMethods: mappedData.testMethods,
    testLocation: mappedData.testLocation,
    attachments: mappedData.attachments,
    
    // Test results
    sampleType: mappedData.sampleTypeSize,
    classOfConcrete: mappedData.classOfConcrete,
    designCompressiveStrength: mappedData.designCompressiveStrength,
    testingAge: mappedData.testingAge,
    areaOfUse: mappedData.areaOfUse,
    compressiveTestingMachineId: mappedData.compressiveTestingMachineId,
    curingCondition: mappedData.curingCondition,
    curingPeriod: mappedData.curingPeriodAtFacility,
    facilityTemperature: mappedData.facilityTemperature,
    typeOfFailure: mappedData.typeOfFailure,
    
    // Test data - transform the test results to match template structure
    testResults: mappedData.testResults.map(result => ({
      sampleNumber: parseInt(result.sampleNumber),
      dimensions: {
        length: result.length,
        width: result.width,
        height: result.height,
      },
      crossSectionalArea: result.length * result.width, // Calculate area
      weightOfSample: result.weight,
      densityOfSample: Math.round((result.weight / (result.length * result.width * result.height)) * 1000000), // Calculate density
      failureLoad: result.failureLoad,
      correctedFailureLoad: result.correctedFailureLoad,
      compressiveStrength: result.compressiveStrength,
    })),
    dateOfCasting: mappedData.dateOfCasting,
    dateOfTesting: mappedData.dateOfTesting,
    averageCompressiveStrength: mappedData.averageCompressiveStrength,
    
    // Signatures
    engineerName: mappedData.approvedByEngineer?.name || approvers.engineer?.name || approvers.engineer?.email || '',
    managerName: mappedData.approvedByManager?.name || approvers.manager?.name || approvers.manager?.email || 'N/A',
  };
}
