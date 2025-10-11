import { NextRequest, NextResponse } from 'next/server';
import { HTMLPDFGenerator, PaverCertificateData } from '@/lib/html-pdf-generator';

export async function POST(request: NextRequest) {
  try {
    console.log('Paver PDF generation request received');
    const data: PaverCertificateData = await request.json();
    console.log('Data received:', JSON.stringify(data, null, 2));
    
    const pdfGenerator = HTMLPDFGenerator.getInstance();
    console.log('Generating PDF...');
    const pdfBuffer = await pdfGenerator.generatePaverCertificatePDF(data);
    console.log('PDF generated successfully, size:', pdfBuffer.length);
    
    if (pdfBuffer.length === 0) {
      console.error('ERROR: PDF buffer is empty!');
      return NextResponse.json(
        { 
          error: 'PDF generation failed - empty buffer',
          details: 'The PDF generator returned an empty buffer'
        },
        { status: 500 }
      );
    }
    
    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="paver-certificate-${data.certificateNo}.pdf"`,
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
