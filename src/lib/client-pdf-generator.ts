"use client";

import { Receipt, Laboratory } from "@/lib/types";

export class ClientPDFGenerator {
  private static findContentElement(): HTMLElement | null {
    // Try multiple selectors to find the content element
    const selectors = [
      '.print-content .w-\\[210mm\\]',
      '.print-content > div',
      '[class*="210mm"]',
      '.print-content',
      '[class*="print"]',
      '.bg-gray-100 .bg-white',
      '.shadow-lg',
      '.bg-white[class*="210"]',
      '.bg-white[class*="mm"]'
    ];

    for (const selector of selectors) {
      const element = document.querySelector(selector);
      if (element) {
        console.log('Found content element with selector:', selector, element);
        return element as HTMLElement;
      }
    }

    // If no specific selector works, try to find any element that looks like content
    const allElements = document.querySelectorAll('div');
    for (const element of allElements) {
      const classList = element.classList.toString();
      if (classList.includes('210mm') || 
          classList.includes('print') || 
          (classList.includes('bg-white') && classList.includes('shadow'))) {
        console.log('Found content element by class inspection:', element);
        return element as HTMLElement;
      }
    }

    return null;
  }

  static async generateReceiptPDF(receipt: Receipt, laboratory: Laboratory): Promise<Blob> {
    const receiptElement = this.findContentElement();
    
    if (!receiptElement) {
      console.error('Receipt content not found. Available elements:', {
        printContent: document.querySelector('.print-content'),
        w210mm: document.querySelector('[class*="210mm"]'),
        bgWhite: document.querySelector('.bg-white'),
        shadowLg: document.querySelector('.shadow-lg'),
        allDivs: document.querySelectorAll('div').length
      });
      throw new Error('Receipt content not found in DOM');
    }

    try {
      // Use html2canvas to convert the actual rendered receipt to canvas
      const { default: html2canvas } = await import('html2canvas');
      const { default: jsPDF } = await import('jspdf');
      
      const canvas = await html2canvas(receiptElement as HTMLElement, {
        width: 794,
        height: 1123, // A4 height
        scale: 2, // Higher resolution
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        logging: false, // Disable console logging
      });

      // Convert canvas to image data
      const imgData = canvas.toDataURL('image/png');
      
      // Create PDF with jsPDF
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      // Add image to PDF
      pdf.addImage(imgData, 'PNG', 0, 0, 210, 297); // A4 dimensions in mm

      // Return PDF as blob
      return pdf.output('blob');
    } catch (error) {
      console.error('Receipt PDF generation error:', error);
      throw error;
    }
  }

  static async generateCertificatePDF(certificateData: any, laboratory: Laboratory, certificateType: string): Promise<Blob> {
    const certificateElement = this.findContentElement();
    
    if (!certificateElement) {
      console.error('Certificate content not found. Available elements:', {
        printContent: document.querySelector('.print-content'),
        w210mm: document.querySelector('[class*="210mm"]'),
        bgWhite: document.querySelector('.bg-white'),
        shadowLg: document.querySelector('.shadow-lg'),
        allDivs: document.querySelectorAll('div').length
      });
      throw new Error('Certificate content not found in DOM');
    }

    try {
      // Use html2canvas to convert the actual rendered certificate to canvas
      const { default: html2canvas } = await import('html2canvas');
      const { default: jsPDF } = await import('jspdf');
      
      const canvas = await html2canvas(certificateElement as HTMLElement, {
        width: 794,
        height: 1123, // A4 height
        scale: 2, // Higher resolution
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        logging: false, // Disable console logging
      });

      // Convert canvas to image data
      const imgData = canvas.toDataURL('image/png');
      
      // Create PDF with jsPDF
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      // Add image to PDF
      pdf.addImage(imgData, 'PNG', 0, 0, 210, 297); // A4 dimensions in mm

      // Return PDF as blob
      return pdf.output('blob');
    } catch (error) {
      console.error('Certificate PDF generation error:', error);
      throw error;
    }
  }
}
