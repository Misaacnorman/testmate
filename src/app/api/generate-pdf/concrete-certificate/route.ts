import { NextRequest, NextResponse } from 'next/server';
import { HTMLPDFGenerator, CertificateData } from '@/lib/html-pdf-generator';

export async function POST(request: NextRequest) {
  try {
    console.log('PDF generation request received');
    const data: CertificateData = await request.json();
    console.log('Data received:', JSON.stringify(data, null, 2));
    
    const pdfGenerator = HTMLPDFGenerator.getInstance();
    console.log('Generating PDF...');
    const pdfBuffer = await pdfGenerator.generateConcreteCertificatePDF(data);
    console.log('PDF generated successfully, size:', pdfBuffer.length);
    
    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="concrete-certificate-${data.certificateNo}.pdf"`,
        'Content-Length': pdfBuffer.length.toString(),
      },
    });
  } catch (error) {
    console.error('Error generating PDF:', error);
    return NextResponse.json(
      { 
        error: 'Failed to generate PDF',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
