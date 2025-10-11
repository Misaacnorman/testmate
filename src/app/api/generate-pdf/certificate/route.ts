import { NextRequest, NextResponse } from 'next/server';
import { ServerPDFGenerator } from '@/lib/server-pdf-generator';
import { Laboratory } from '@/lib/types';

export async function POST(request: NextRequest) {
  try {
    const { certificateData, laboratory, certificateType } = await request.json();

    if (!certificateData || !laboratory || !certificateType) {
      return NextResponse.json(
        { error: 'Certificate data, laboratory, and certificate type are required' },
        { status: 400 }
      );
    }

    // Generate PDF using server-side generator
    const pdfBuffer = await ServerPDFGenerator.generateCertificatePDF(certificateData, laboratory, certificateType);

    // Return PDF as response
    return new NextResponse(pdfBuffer as any, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="certificate_${certificateData.certificateNo}.pdf"`,
        'Content-Length': pdfBuffer.length.toString(),
      },
    });
  } catch (error) {
    console.error('PDF generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate PDF' },
      { status: 500 }
    );
  }
}
