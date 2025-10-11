import { NextRequest, NextResponse } from 'next/server';
import { HTMLPDFGenerator } from '@/lib/html-pdf-generator';

export async function GET() {
  try {
    console.log('Testing PDF generation...');
    
    // Create simple test data
    const testData = {
      logoUrl: 'https://via.placeholder.com/50x50/0066cc/ffffff?text=LOGO',
      companyName: 'Test Company Ltd',
      companyAddress: '123 Test Street',
      companyEmail: 'test@company.com',
      certificateNo: 'TEST-001',
      dateOfIssue: '10/10/2025',
      version: '01',
      clientName: 'Test Client',
      clientAddress: '456 Client Road',
      clientContact: '0756398710',
      projectTitle: 'Test Project',
      conditionAtReceipt: 'Satisfactory',
      dateOfReceipt: '10/10/2025',
      samplingReport: 'N/A',
      natureOfTest: 'Compressive strength test',
      testedBy: 'Test Engineer',
      testMethods: 'BS EN 12390-3:2019',
      testLocation: 'Test Laboratory',
      attachments: 'None',
      sampleType: 'Nominal size 150 x 150 x 150 mm',
      classOfConcrete: 'C25',
      designCompressiveStrength: '25 MPa',
      testingAge: '7 Days',
      areaOfUse: 'Structural',
      compressiveTestingMachineId: 'TEST-001',
      curingCondition: 'Tested as Received',
      curingPeriod: 'N/A',
      facilityTemperature: '24 Degrees Celsius',
      typeOfFailure: 'Satisfactory',
      testResults: [
        {
          sampleNumber: 1,
          dimensions: { length: 150.0, width: 150.0, height: 150.0 },
          crossSectionalArea: 22500,
          weightOfSample: 7.94,
          densityOfSample: 2350,
          failureLoad: 525.0,
          correctedFailureLoad: 521.7,
          compressiveStrength: 23.2
        }
      ],
      dateOfCasting: '09/01/2025',
      dateOfTesting: '16/01/2025',
      averageCompressiveStrength: 23.2,
      engineerName: 'Test Engineer',
      managerName: 'Test Manager'
    };

    console.log('Test data created:', testData);
    
    const pdfGenerator = HTMLPDFGenerator.getInstance();
    console.log('PDF generator instance created');
    
    const pdfBuffer = await pdfGenerator.generateConcreteCertificatePDF(testData);
    console.log('PDF generated successfully, size:', pdfBuffer.length);
    
    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="test-certificate.pdf"',
        'Content-Length': pdfBuffer.length.toString(),
      },
    });
  } catch (error) {
    console.error('Error in test PDF generation:', error);
    return NextResponse.json(
      { 
        error: 'Failed to generate test PDF',
        details: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}
