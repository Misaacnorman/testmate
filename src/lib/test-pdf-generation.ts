// Test file to verify PDF generation works
import { HTMLPDFGenerator, CertificateData } from './html-pdf-generator';

export async function testConcreteCertificatePDF() {
  const testData: CertificateData = {
    // Company info
    logoUrl: 'https://via.placeholder.com/60x60/0066cc/ffffff?text=LOGO',
    companyName: 'TECLAB LIMITED',
    companyAddress: 'Plot 15 Mapera Road',
    companyEmail: 'teclab@teclabafrica.com',
    
    // Certificate info
    certificateNo: 'TEST-001',
    dateOfIssue: '10/10/2025',
    version: '01',
    
    // Client info
    clientName: 'Test Client Ltd',
    clientAddress: '123 Test Street',
    clientContact: '0756398710',
    projectTitle: 'Test Building Project',
    sampleDescription: 'Three (03) concrete cubes were delivered to the laboratory for testing',
    conditionAtReceipt: 'Satisfactory',
    dateOfReceipt: '10/10/2025',
    samplingReport: 'N/A',
    natureOfTest: 'Compressive strength of test specimens',
    testedBy: 'Test Engineer',
    testMethods: 'BS 1881: Part 116: 1983',
    testLocation: 'Plot 15 Mapera Road',
    attachments: 'None',
    
    // Test results
    cubeType: 'Standard Cube',
    methodOfCompaction: 'Not Specified',
    testingAge: '28 Days',
    numberOfCubesPerBatch: '3',
    calculatedArea: '22500',
    areaOfUse: 'Structural',
    curingCondition: 'Tested as Received',
    facilityTemperature: '25 Degrees Celsius',
    typeOfFailure: 'Satisfactory',
    cubeThickness: '150 mm',
    areaUsedForStrength: 'Computed Plan Area from cubes per sqm',
    compressiveTestingMachineId: '01',
    
    // Test data
    testResults: [
      {
        sampleNumber: 1,
        measuredThickness: 150.0,
        correctionFactor: 1.0,
        computedPlanArea: 22500,
        weightOfSample: 8.5,
        densityOfSample: 2400,
        failureLoad: 450.0,
        correctedFailureLoad: 450.0,
        compressiveStrength: 20.0
      },
      {
        sampleNumber: 2,
        measuredThickness: 150.0,
        correctionFactor: 1.0,
        computedPlanArea: 22500,
        weightOfSample: 8.7,
        densityOfSample: 2450,
        failureLoad: 480.0,
        correctedFailureLoad: 480.0,
        compressiveStrength: 21.3
      },
      {
        sampleNumber: 3,
        measuredThickness: 150.0,
        correctionFactor: 1.0,
        computedPlanArea: 22500,
        weightOfSample: 8.6,
        densityOfSample: 2420,
        failureLoad: 465.0,
        correctedFailureLoad: 465.0,
        compressiveStrength: 20.7
      }
    ],
    dateOfCasting: '15/09/2025',
    dateOfTesting: '10/10/2025',
    averageCompressiveStrength: 20.7,
    
    // Signatures
    engineerName: 'Test Engineer',
    managerName: 'Test Manager',
    
    // Remarks
    remarks: `
      <ul>
        <li>This certificate is issued for the specific samples tested and does not necessarily represent the quality of the entire batch.</li>
        <li>The test results are based on the samples as received and tested under standard laboratory conditions.</li>
        <li>This certificate is valid only for the samples tested and should not be used for any other purpose.</li>
        <li>The test was conducted in accordance with the specified standard and laboratory procedures.</li>
        <li>For any queries regarding this certificate, please contact the laboratory within 30 days of issue.</li>
      </ul>
    `
  };

  try {
    const pdfGenerator = HTMLPDFGenerator.getInstance();
    const pdfBuffer = await pdfGenerator.generateConcreteCertificatePDF(testData);
    
    console.log('PDF generated successfully!');
    console.log('PDF size:', pdfBuffer.length, 'bytes');
    
    // Save to file for testing
    const fs = require('fs');
    const path = require('path');
    const outputPath = path.join(process.cwd(), 'test-concrete-certificate.pdf');
    fs.writeFileSync(outputPath, pdfBuffer);
    console.log('PDF saved to:', outputPath);
    
    return pdfBuffer;
  } catch (error) {
    console.error('Error generating test PDF:', error);
    throw error;
  }
}
