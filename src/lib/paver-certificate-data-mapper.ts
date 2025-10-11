import { type Receipt, type User, type Laboratory } from './types';

// Helper function to generate sample count text
function getSampleCountText(count: number): string {
  if (count === 1) return 'One (01)';
  if (count === 2) return 'Two (02)';
  if (count === 3) return 'Three (03)';
  if (count === 4) return 'Four (04)';
  if (count === 5) return 'Five (05)';
  if (count === 6) return 'Six (06)';
  if (count === 7) return 'Seven (07)';
  if (count === 8) return 'Eight (08)';
  if (count === 9) return 'Nine (09)';
  if (count === 10) return 'Ten (10)';
  return `${count} samples`;
}

export interface PaverCertificateTemplateData {
  // Company info
  logoUrl: string;
  companyName: string;
  companyAddress: string;
  companyEmail: string;
  
  // Certificate info
  certificateNo: string;
  dateOfIssue: string;
  version: string;
  
  // Client info
  clientName: string;
  clientAddress: string;
  clientContact: string;
  projectTitle: string;
  conditionAtReceipt: string;
  dateOfReceipt: string;
  samplingReport: string;
  natureOfTest: string;
  testedBy: string;
  testMethods: string;
  testLocation: string;
  attachments: string;
  sampleCountText: string;
  
  // Test results
  paverType: string;
  methodOfCompaction: string;
  testingAge: string;
  numberOfPaversPerSqm: string;
  calculatedArea: string;
  areaOfUse: string;
  compressiveTestingMachineId: string;
  curingCondition: string;
  facilityTemperature: string;
  typeOfFailure: string;
  paverThickness: string;
  areaUsedForStrength: string;
  
  // Test data
  testResults: Array<{
    sampleNumber: number;
    thickness: number;
    correctionFactor: number;
    computedPlanArea: number;
    weightOfSample: number;
    densityOfSample: number;
    failureLoad: number;
    correctedFailureLoad: number;
    compressiveStrength: number;
  }>;
  dateOfCasting: string;
  dateOfTesting: string;
  averageCompressiveStrength: number;
  
  // Signatures
  engineerName: string;
  managerName: string;
}

export interface PaverCertificateComponentData {
  certificateData: {
    receiptId: string;
    [key: string]: any;
  };
  laboratory: Laboratory | null;
  laboratoryId: string;
  user: User | null;
  receipt: Receipt | null;
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
    paverType: string;
    methodOfCompaction: string;
    testingAge: string;
    numberOfPaversPerSqm: number | null;
    calculatedArea?: number;
    areaUsedForStrength: string;
    areaOfUse: string;
    compressiveTestingMachineId: string;
    curingCondition: string;
    facilityTemperature: string;
    typeOfFailure: string;
    paverThickness: string;
    testResults: Array<{
      sampleNumber: string;
      measuredThickness: number;
      correctionFactor: number;
      computedPlanArea: number;
      weightOfSample: number;
      densityOfSample: number;
      failureLoad: number;
      correctedFailureLoad: number;
      compressiveStrength: number;
    }>;
    dateOfCasting: string;
    dateOfTesting: string;
    averageCompressiveStrength: number;
    checkedBy: { name: string; signatureURL?: string };
    approvedBy: { name: string; signatureURL?: string };
    remarks: string[];
  };
}

export function mapPaverCertificateData(componentData: PaverCertificateComponentData): PaverCertificateTemplateData {
  console.log('DEBUG: mapPaverCertificateData called!');
  console.log('DEBUG: componentData =', componentData);
  
  const { laboratory, mappedData, approvers } = componentData;
  
  console.log('DEBUG: mappedData =', mappedData);
  console.log('DEBUG: mappedData.testResults =', mappedData?.testResults);
  
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
    sampleCountText: getSampleCountText(mappedData.testResults.length),
    
    // Test results
    paverType: mappedData.paverType,
    methodOfCompaction: mappedData.methodOfCompaction,
    testingAge: mappedData.testingAge,
    numberOfPaversPerSqm: mappedData.numberOfPaversPerSqm ? `${mappedData.numberOfPaversPerSqm}` : 'N/A',
    calculatedArea: mappedData.calculatedArea ? `(Optional)` : '',
    areaOfUse: mappedData.areaOfUse,
    compressiveTestingMachineId: mappedData.compressiveTestingMachineId,
    curingCondition: mappedData.curingCondition,
    facilityTemperature: mappedData.facilityTemperature,
    typeOfFailure: mappedData.typeOfFailure,
    paverThickness: mappedData.paverThickness, // This shows the full string like "80 mm Plain"
    areaUsedForStrength: mappedData.areaUsedForStrength,
    
    // Test data - transform the test results to match template structure
    testResults: mappedData.testResults.map(result => {
      console.log('DEBUG: Data mapper - processing result:', result);
      console.log('DEBUG: Data mapper - result.measuredThickness =', result.measuredThickness);
      // Calculate density correctly: density = weight / (thickness * computedPlanArea)
      // Convert thickness from mm to m for SI units: thickness(mm) / 1000 = thickness(m)
      // density = weight(kg) / (thickness(m) * area(m²))
      const thicknessInMeters = (result.measuredThickness || 0) / 1000; // Convert mm to m
      const areaInSquareMeters = (result.computedPlanArea || 0) / 1000000; // Convert mm² to m²
      const calculatedDensity = thicknessInMeters > 0 && areaInSquareMeters > 0 
        ? (result.weightOfSample || 0) / (thicknessInMeters * areaInSquareMeters)
        : 0;
      
      console.log('Paver density calculation:', {
        measuredThickness: result.measuredThickness,
        thicknessInMeters,
        computedPlanArea: result.computedPlanArea,
        areaInSquareMeters,
        weightOfSample: result.weightOfSample,
        calculatedDensity
      });
      
      console.log('DEBUG: Data mapper - result.measuredThickness =', result.measuredThickness);
      console.log('DEBUG: Data mapper - mappedData.paverThickness =', mappedData.paverThickness);
      
      return {
        sampleNumber: parseInt(result.sampleNumber),
        thickness: result.measuredThickness || 0, // This should match the extracted thickness
        correctionFactor: result.correctionFactor,
        computedPlanArea: Math.round(result.computedPlanArea || 0), // Round to 0 decimal places
        weightOfSample: result.weightOfSample,
        densityOfSample: Math.round(calculatedDensity), // Round to 0 decimal places
        failureLoad: result.failureLoad,
        correctedFailureLoad: result.correctedFailureLoad,
        compressiveStrength: Math.round(result.compressiveStrength * 10) / 10, // Round to 1 decimal place
      };
    }),
    dateOfCasting: mappedData.dateOfCasting,
    dateOfTesting: mappedData.dateOfTesting,
    averageCompressiveStrength: mappedData.averageCompressiveStrength,
    
    // Signatures
    engineerName: mappedData.checkedBy?.name || approvers.engineer?.name || approvers.engineer?.email || '',
    managerName: mappedData.approvedBy?.name || approvers.manager?.name || approvers.manager?.email || 'N/A',
  };
}
