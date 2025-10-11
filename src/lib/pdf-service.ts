"use client";

import { Receipt, Laboratory } from './types';

interface PDFGenerationResponse {
  success: boolean;
  pdfUrl?: string;
  metadata?: {
    generatedAt: string;
    fileSize: number;
    generatedBy: string;
    laboratorySnapshot: any;
  };
  error?: string;
}

export class PDFService {
  static async generateReceiptPDF(receipt: Receipt, laboratory: Laboratory): Promise<PDFGenerationResponse> {
    try {
      // Call server-side PDF generation API
      const response = await fetch('/api/generate-pdf/receipt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ receipt, laboratory }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate PDF');
      }

      // Get PDF blob from response
      const pdfBlob = await response.blob();
      
      // Create object URL for preview
      const pdfUrl = URL.createObjectURL(pdfBlob);
      
      // Create metadata
      const metadata = {
        generatedAt: new Date().toISOString(),
        fileSize: pdfBlob.size,
        generatedBy: 'server',
        laboratorySnapshot: {
          name: laboratory.name,
          address: laboratory.address || '',
          email: laboratory.email || '',
          logo: laboratory.logo || '',
          id: laboratory.id,
        },
      };

      return {
        success: true,
        pdfUrl,
        metadata,
      };
    } catch (error) {
      console.error('Server-side PDF generation failed, falling back to client-side:', error);
      
      // Fallback to client-side generation
      try {
        const { ClientPDFGenerator } = await import('./client-pdf-generator');
        const pdfBlob = await ClientPDFGenerator.generateReceiptPDF(receipt, laboratory);
        const pdfUrl = URL.createObjectURL(pdfBlob);
        
        const metadata = {
          generatedAt: new Date().toISOString(),
          fileSize: pdfBlob.size,
          generatedBy: 'client-fallback',
          laboratorySnapshot: {
            name: laboratory.name,
            address: laboratory.address || '',
            email: laboratory.email || '',
            logo: laboratory.logo || '',
            id: laboratory.id,
          },
        };

        return {
          success: true,
          pdfUrl,
          metadata,
        };
      } catch (fallbackError) {
        console.error('Client-side fallback also failed:', fallbackError);
        return {
          success: false,
          error: 'Both server-side and client-side PDF generation failed',
        };
      }
    }
  }

  static async generateCertificatePDF(certificateData: any, laboratory: Laboratory, certificateType: string): Promise<PDFGenerationResponse> {
    try {
      // Call server-side PDF generation API
      const response = await fetch('/api/generate-pdf/certificate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ certificateData, laboratory, certificateType }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate PDF');
      }

      // Get PDF blob from response
      const pdfBlob = await response.blob();
      
      // Create object URL for preview
      const pdfUrl = URL.createObjectURL(pdfBlob);
      
      // Create metadata
      const metadata = {
        generatedAt: new Date().toISOString(),
        fileSize: pdfBlob.size,
        generatedBy: 'server',
        laboratorySnapshot: {
          name: laboratory.name,
          address: laboratory.address || '',
          email: laboratory.email || '',
          logo: laboratory.logo || '',
          id: laboratory.id,
        },
      };

      return {
        success: true,
        pdfUrl,
        metadata,
      };
    } catch (error) {
      console.error('Server-side certificate PDF generation failed, falling back to client-side:', error);
      
      // Fallback to client-side generation
      try {
        const { ClientPDFGenerator } = await import('./client-pdf-generator');
        const pdfBlob = await ClientPDFGenerator.generateCertificatePDF(certificateData, laboratory, certificateType);
        const pdfUrl = URL.createObjectURL(pdfBlob);
        
        const metadata = {
          generatedAt: new Date().toISOString(),
          fileSize: pdfBlob.size,
          generatedBy: 'client-fallback',
          laboratorySnapshot: {
            name: laboratory.name,
            address: laboratory.address || '',
            email: laboratory.email || '',
            logo: laboratory.logo || '',
            id: laboratory.id,
          },
        };

        return {
          success: true,
          pdfUrl,
          metadata,
        };
      } catch (fallbackError) {
        console.error('Client-side fallback also failed:', fallbackError);
        return {
          success: false,
          error: 'Both server-side and client-side PDF generation failed',
        };
      }
    }
  }

  static downloadPDF(pdfUrl: string, fileName: string): void {
    const link = document.createElement('a');
    link.href = pdfUrl;
    link.download = fileName;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
