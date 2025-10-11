import { NextRequest, NextResponse } from 'next/server';
import { ServerPDFGenerator } from '@/lib/server-pdf-generator';
import { Receipt, Laboratory } from '@/lib/types';

export async function POST(request: NextRequest) {
  try {
    const { receipt, laboratory } = await request.json();

    if (!receipt || !laboratory) {
      return NextResponse.json(
        { error: 'Receipt and laboratory data are required' },
        { status: 400 }
      );
    }

    // Generate PDF using server-side generator
    const pdfBuffer = await ServerPDFGenerator.generateReceiptPDF(receipt, laboratory);

    // Return PDF as response
    return new NextResponse(pdfBuffer as any, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="receipt_${receipt.receiptId}.pdf"`,
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