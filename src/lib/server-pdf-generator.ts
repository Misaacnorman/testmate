import puppeteer, { Browser, Page } from 'puppeteer';
import { Receipt, Laboratory } from './types';

export class ServerPDFGenerator {
  private static browser: Browser | null = null;

  private static async getBrowser(): Promise<Browser> {
    if (!this.browser) {
      this.browser = await puppeteer.launch({
        headless: true,
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-accelerated-2d-canvas',
          '--no-first-run',
          '--no-zygote',
          '--disable-gpu'
        ]
      });
    }
    return this.browser;
  }

  static async generateReceiptPDF(receipt: Receipt, laboratory: Laboratory): Promise<Buffer> {
    const browser = await this.getBrowser();
    const page: Page = await browser.newPage();

    try {
      // Set viewport for consistent rendering
      await page.setViewport({ width: 794, height: 1123, deviceScaleFactor: 2 });

      // Generate HTML for the receipt
      const html = this.generateReceiptHTML(receipt, laboratory);
      
      // Set content and wait for fonts/images to load
      await page.setContent(html, { waitUntil: 'networkidle0' });

      // Generate PDF
      const pdfBuffer = await page.pdf({
        format: 'A4',
        printBackground: true,
        margin: {
          top: '0.5in',
          right: '0.5in',
          bottom: '0.5in',
          left: '0.5in'
        }
      });

      return Buffer.from(pdfBuffer);
    } finally {
      await page.close();
    }
  }

  static async generateCertificatePDF(certificateData: any, laboratory: Laboratory, certificateType: string): Promise<Buffer> {
    const browser = await this.getBrowser();
    const page: Page = await browser.newPage();

    try {
      // Set viewport for consistent rendering
      await page.setViewport({ width: 794, height: 1123, deviceScaleFactor: 2 });

      // Generate HTML for the certificate
      const html = this.generateCertificateHTML(certificateData, laboratory, certificateType);
      
      // Set content and wait for fonts/images to load
      await page.setContent(html, { waitUntil: 'networkidle0' });

      // Generate PDF
      const pdfBuffer = await page.pdf({
        format: 'A4',
        printBackground: true,
        margin: {
          top: '0.5in',
          right: '0.5in',
          bottom: '0.5in',
          left: '0.5in'
        }
      });

      return Buffer.from(pdfBuffer);
    } finally {
      await page.close();
    }
  }

  private static generateReceiptHTML(receipt: Receipt, laboratory: Laboratory): string {
    const formatDate = (dateString: string) => {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    };

    const getTransmittalModes = () => {
      const modes = [];
      if (receipt.formData.transmittalModes?.email) modes.push("Email");
      if (receipt.formData.transmittalModes?.whatsapp) modes.push("WhatsApp");
      if (receipt.formData.transmittalModes?.hardcopy) modes.push("Hardcopy");
      return modes.join(", ");
    };

    const testsByCategory = Object.values(receipt.selectedCategories).reduce((acc: any, cat: any) => {
      const categoryName = cat.categoryName.toUpperCase();
      if (!acc[categoryName]) {
        acc[categoryName] = { notes: cat.notes, details: cat.details, tests: [] };
      }
      acc[categoryName].tests.push(...Object.values(cat.tests));
      return acc;
    }, {} as Record<string, { notes: string; details: string; tests: any[] }>);

    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Sample Receipt ${receipt.receiptId}</title>
          <style>
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            
            body {
              font-family: 'Arial', sans-serif;
              font-size: 12px;
              line-height: 1.4;
              color: #000;
              background: white;
            }
            
            .container {
              max-width: 100%;
              margin: 0 auto;
              padding: 20px;
            }
            
            .header {
              display: flex;
              justify-content: space-between;
              align-items: flex-start;
              padding-bottom: 20px;
              border-bottom: 2px solid #000;
              margin-bottom: 20px;
            }
            
            .logo-section {
              display: flex;
              align-items: center;
              gap: 16px;
            }
            
            .logo-section img {
              height: 64px;
              width: auto;
            }
            
            .company-info h1 {
              font-size: 18px;
              font-weight: bold;
              margin: 0 0 4px 0;
              text-transform: uppercase;
            }
            
            .company-info p {
              margin: 0;
              color: #666;
              font-size: 11px;
            }
            
            .receipt-info {
              text-align: right;
            }
            
            .receipt-info h2 {
              font-size: 14px;
              font-weight: bold;
              color: #2563eb;
              margin: 0 0 8px 0;
            }
            
            .receipt-info p {
              margin: 0;
              font-size: 11px;
            }
            
            .details-grid {
              display: grid;
              grid-template-columns: 1fr 1fr 1fr;
              gap: 32px;
              margin-bottom: 20px;
            }
            
            .detail-section h3 {
              font-size: 10px;
              font-weight: bold;
              text-transform: uppercase;
              letter-spacing: 1px;
              color: #666;
              margin: 0 0 8px 0;
            }
            
            .detail-section p {
              margin: 0 0 4px 0;
              font-size: 11px;
            }
            
            .tests-section h3 {
              font-size: 12px;
              font-weight: bold;
              text-transform: uppercase;
              letter-spacing: 1px;
              color: #666;
              margin: 0 0 8px 0;
            }
            
            .tests-table {
              width: 100%;
              border-collapse: collapse;
              border: 1px solid #000;
              font-size: 10px;
            }
            
            .tests-table th {
              padding: 8px;
              text-align: left;
              font-weight: bold;
              border: 1px solid #000;
              background-color: #f5f5f5;
            }
            
            .tests-table td {
              padding: 8px;
              border: 1px solid #000;
              vertical-align: top;
            }
            
            .category-row {
              background-color: #e5e5e5;
              font-weight: bold;
              color: #666;
            }
            
            .notes-section {
              margin-top: 20px;
            }
            
            .notes-section h3 {
              font-size: 12px;
              font-weight: bold;
              text-transform: uppercase;
              letter-spacing: 1px;
              color: #666;
              margin: 0 0 8px 0;
            }
            
            .notes-box {
              border: 1px solid #000;
              border-radius: 4px;
              padding: 12px;
              background-color: #f5f5f5;
              font-size: 10px;
            }
            
            .footer {
              text-align: center;
              font-size: 10px;
              color: #666;
              margin-top: 20px;
              padding-top: 20px;
              border-top: 1px solid #000;
            }
            
            .footer p {
              margin: 0 0 4px 0;
            }
            
            .footer .company-name {
              font-weight: bold;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <!-- Header -->
            <div class="header">
              <div class="logo-section">
                ${laboratory.logo ? `<img src="${laboratory.logo}" alt="Company Logo" />` : ''}
                <div class="company-info">
                  <h1>${laboratory.name}</h1>
                  <p>${laboratory.address}</p>
                  <p>${laboratory.email}</p>
                </div>
              </div>
              <div class="receipt-info">
                <h2>SAMPLE RECEIPT</h2>
                <p><strong>ID:</strong> ${receipt.receiptId}</p>
                <p><strong>Date:</strong> ${formatDate(receipt.date)}</p>
              </div>
            </div>

            <!-- Details Grid -->
            <div class="details-grid">
              <div class="detail-section">
                <h3>Client Details</h3>
                <p><strong>Name:</strong> ${receipt.formData.clientName}</p>
                <p><strong>Contact:</strong> ${receipt.formData.clientContact}</p>
                <p><strong>Address:</strong> ${receipt.formData.clientAddress}</p>
                <p><strong>Project:</strong> ${receipt.formData.projectTitle}</p>
              </div>
              <div class="detail-section">
                <h3>Billing Details</h3>
                <p>${receipt.formData.isBillingClientSame === 'yes' ? 'Billed to client' : receipt.formData.billingClientName}</p>
              </div>
              <div class="detail-section">
                <h3>Delivery & Reporting</h3>
                <p><strong>${receipt.formData.deliveryMode === 'deliveredBy' ? 'Delivered by:' : 'Picked by:'}</strong> ${receipt.formData.deliveryPerson} (${receipt.formData.delivererContact})</p>
                <p><strong>Received By:</strong> ${receipt.formData.receivedBy}</p>
                <p><strong>Results via:</strong> ${getTransmittalModes()}</p>
              </div>
            </div>

            <!-- Tests Section -->
            <div class="tests-section">
              <h3>Tests to be Performed</h3>
              <table class="tests-table">
                <thead>
                  <tr>
                    <th>Material Category</th>
                    <th>Qty</th>
                    <th>Material Test</th>
                    <th>Test Method(s)</th>
                    <th style="width: 36%;">Sample Details</th>
                  </tr>
                </thead>
                <tbody>
                  ${Object.entries(testsByCategory).map(([categoryName, data]) => `
                    <tr class="category-row">
                      <td colspan="5">${categoryName}</td>
                    </tr>
                    ${(data as any).tests.map((test: any, index: number) => {
                      const categoryData = Object.values(receipt.step4Data).find((c: any) => c.categoryName === test.materialCategory);
                      const specialDetails = (categoryData as any)?.tests[test.id];
                      
                      return `
                        <tr>
                          <td>${index === 0 ? '' : ''}</td>
                          <td style="text-align: center;">${test.quantity}</td>
                          <td>${test.materialTest}</td>
                          <td>${test.testMethod || '-'}</td>
                          <td>
                            ${specialDetails ? `
                              <div style="margin-bottom: 8px;">
                                ${(specialDetails as any).sets.map((set: any) => {
                                  const castingDate = set.castingDate ? new Date(set.castingDate).toLocaleDateString() : '';
                                  const testingDate = set.testingDate ? new Date(set.testingDate).toLocaleDateString() : '';
                                  return `
                                    <div style="margin-bottom: 4px;">
                                      <p style="font-weight: bold; margin: 0;">Set ${set.id} (Qty: ${set.sampleCount})</p>
                                      <ul style="margin: 2px 0 0 16px; padding: 0;">
                                        ${castingDate ? `<li>Casting: ${castingDate}</li>` : ''}
                                        ${testingDate ? `<li>Testing: ${testingDate}</li>` : ''}
                                        ${set.age != null ? `<li>Age: ${set.age}</li>` : ''}
                                        ${set.class ? `<li>Class: ${set.class === 'Other' ? set.customClass : set.class}</li>` : ''}
                                        ${set.sampleType ? `<li>Sample Type: ${set.sampleType === 'Other' ? set.customSampleType : set.sampleType}</li>` : ''}
                                        ${set.paverType ? `<li>Paver Type: ${set.paverType === 'Other' ? set.customPaverType : set.paverType}</li>` : ''}
                                        ${set.areaOfUse ? `<li>Area of Use: ${set.areaOfUse}</li>` : ''}
                                        <li>IDs: ${set.sampleIds.join(', ')}</li>
                                      </ul>
                                    </div>
                                  `;
                                }).join('')}
                              </div>
                            ` : ((data as any).details || '-')}
                          </td>
                        </tr>
                      `;
                    }).join('')}
                  `).join('')}
                </tbody>
              </table>
            </div>

            <!-- Notes Section -->
            <div class="notes-section">
              <h3>Notes</h3>
              <div class="notes-box">
                ${Object.entries(testsByCategory)
                  .filter(([, data]) => (data as any).notes.trim() !== '')
                  .map(([categoryName, data]) => `
                    <div style="margin-bottom: 8px;">
                      <p style="font-weight: bold; margin: 0;">${categoryName}:</p>
                      <p style="margin: 0; color: #666; white-space: pre-wrap;">${(data as any).notes}</p>
                    </div>
                  `).join('')}
                ${Object.values(testsByCategory).every(data => !(data as any).notes.trim()) ? 
                  '<p style="margin: 0; color: #666;">No notes provided.</p>' : ''}
              </div>
            </div>

            <!-- Footer -->
            <div class="footer">
              <p class="company-name">${laboratory.name} | ${laboratory.address}</p>
              <p>${laboratory.email}</p>
              <p style="margin: 16px 0 0 0;">This is a system-generated receipt and does not require a signature.</p>
            </div>
          </div>
        </body>
      </html>
    `;
  }

  private static generateCertificateHTML(certificateData: any, laboratory: Laboratory, certificateType: string): string {
    const formatDate = (dateValue: any): string => {
      if (!dateValue) return 'N/A';
      try {
        let date: Date;
        if (dateValue && typeof dateValue.seconds === 'number') {
          date = dateValue.toDate();
        } else {
          date = new Date(dateValue);
        }
        if (isNaN(date.getTime())) return 'N/A';
        return date.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        });
      } catch {
        return 'N/A';
      }
    };

    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Test Certificate ${certificateData.certificateNo}</title>
          <style>
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            
            body {
              font-family: 'Arial', sans-serif;
              font-size: 12px;
              line-height: 1.4;
              color: #000;
              background: white;
            }
            
            .container {
              max-width: 100%;
              margin: 0 auto;
              padding: 20px;
            }
            
            .header {
              text-align: center;
              margin-bottom: 30px;
              border-bottom: 2px solid #000;
              padding-bottom: 20px;
            }
            
            .header img {
              max-height: 60px;
              margin-bottom: 10px;
            }
            
            .header h1 {
              font-size: 24px;
              font-weight: bold;
              margin: 0 0 8px 0;
              text-transform: uppercase;
              letter-spacing: 1px;
            }
            
            .header p {
              font-size: 14px;
              margin: 0 0 4px 0;
              color: #666;
            }
            
            .certificate-title {
              text-align: center;
              margin-bottom: 30px;
            }
            
            .certificate-title h2 {
              font-size: 20px;
              font-weight: bold;
              margin: 0 0 8px 0;
              text-transform: uppercase;
              letter-spacing: 1px;
            }
            
            .certificate-title p {
              font-size: 14px;
              margin: 0;
              color: #666;
            }
            
            .details-table {
              width: 100%;
              border-collapse: collapse;
              margin-bottom: 20px;
            }
            
            .details-table td {
              padding: 8px;
              border: 1px solid #000;
            }
            
            .details-table td:first-child {
              font-weight: bold;
              width: 30%;
            }
            
            .test-results h3 {
              font-size: 14px;
              font-weight: bold;
              margin: 0 0 12px 0;
              text-transform: uppercase;
              letter-spacing: 1px;
            }
            
            .test-results-table {
              width: 100%;
              border-collapse: collapse;
              margin-bottom: 20px;
            }
            
            .test-results-table th,
            .test-results-table td {
              padding: 8px;
              border: 1px solid #000;
              text-align: left;
            }
            
            .test-results-table th {
              font-weight: bold;
              background-color: #f5f5f5;
            }
            
            .remarks-section h3 {
              font-size: 14px;
              font-weight: bold;
              margin: 0 0 12px 0;
              text-transform: uppercase;
              letter-spacing: 1px;
            }
            
            .remarks-box {
              border: 1px solid #000;
              border-radius: 4px;
              padding: 12px;
              background-color: #f5f5f5;
            }
            
            .signatures {
              margin-top: 40px;
            }
            
            .signature-row {
              display: flex;
              justify-content: space-between;
              margin-bottom: 20px;
            }
            
            .signature-box {
              text-align: center;
              width: 45%;
            }
            
            .signature-line {
              border-bottom: 1px solid #000;
              height: 40px;
              margin-bottom: 8px;
            }
            
            .signature-box p {
              font-size: 11px;
              margin: 0;
            }
            
            .signature-box .label {
              font-weight: bold;
            }
            
            .signature-box .name {
              font-size: 10px;
              color: #666;
            }
            
            .footer {
              text-align: center;
              font-size: 10px;
              color: #666;
              margin-top: 30px;
              padding-top: 20px;
              border-top: 1px solid #000;
            }
            
            .footer p {
              margin: 0 0 4px 0;
            }
            
            .footer .company-name {
              font-weight: bold;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <!-- Header -->
            <div class="header">
              ${laboratory.logo ? `<img src="${laboratory.logo}" alt="Laboratory Logo" />` : ''}
              <h1>${laboratory.name}</h1>
              <p>${laboratory.address}</p>
              <p>${laboratory.email}</p>
            </div>

            <!-- Certificate Title -->
            <div class="certificate-title">
              <h2>Test Certificate</h2>
              <p>Certificate No: ${certificateData.certificateNo || 'N/A'}</p>
            </div>

            <!-- Certificate Details -->
            <table class="details-table">
              <tr>
                <td>Date of Issue:</td>
                <td>${formatDate(certificateData.dateOfIssue)}</td>
              </tr>
              <tr>
                <td>Client Name:</td>
                <td>${certificateData.clientName || 'N/A'}</td>
              </tr>
              <tr>
                <td>Project Title:</td>
                <td>${certificateData.projectTitle || 'N/A'}</td>
              </tr>
              <tr>
                <td>Sample Description:</td>
                <td>${certificateData.sampleDescription || 'N/A'}</td>
              </tr>
              <tr>
                <td>Date of Testing:</td>
                <td>${formatDate(certificateData.dateOfTesting)}</td>
              </tr>
              <tr>
                <td>Status:</td>
                <td>${certificateData.status || 'N/A'}</td>
              </tr>
            </table>

            <!-- Test Results Section -->
            ${certificateData.testResults && certificateData.testResults.length > 0 ? `
              <div class="test-results">
                <h3>Test Results</h3>
                <table class="test-results-table">
                  <thead>
                    <tr>
                      <th>Sample No.</th>
                      <th>Length (mm)</th>
                      <th>Width (mm)</th>
                      <th>Height (mm)</th>
                      <th>Area (mm²)</th>
                      <th>Load (kN)</th>
                      <th>Strength (N/mm²)</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${certificateData.testResults.map((result: any) => `
                      <tr>
                        <td>${result.sampleNumber || 'N/A'}</td>
                        <td>${result.length || 'N/A'}</td>
                        <td>${result.width || 'N/A'}</td>
                        <td>${result.height || 'N/A'}</td>
                        <td>${result.area || 'N/A'}</td>
                        <td>${result.load || 'N/A'}</td>
                        <td>${result.strength || 'N/A'}</td>
                      </tr>
                    `).join('')}
                  </tbody>
                </table>
                ${certificateData.averageCompressiveStrength ? `
                  <div style="margin-top: 12px; text-align: right;">
                    <p style="font-weight: bold; margin: 0;">Average Compressive Strength: ${certificateData.averageCompressiveStrength} N/mm²</p>
                  </div>
                ` : ''}
              </div>
            ` : ''}

            <!-- Remarks Section -->
            ${certificateData.remarks && certificateData.remarks.length > 0 ? `
              <div class="remarks-section">
                <h3>Remarks</h3>
                <div class="remarks-box">
                  ${certificateData.remarks.map((remark: string) => `<p style="margin: 0 0 8px 0; font-size: 11px;">• ${remark}</p>`).join('')}
                </div>
              </div>
            ` : ''}

            <!-- Signatures Section -->
            <div class="signatures">
              <div class="signature-row">
                <div class="signature-box">
                  <div class="signature-line"></div>
                  <p class="label">Tested By</p>
                  <p class="name">${certificateData.testedBy || 'N/A'}</p>
                </div>
                <div class="signature-box">
                  <div class="signature-line"></div>
                  <p class="label">Checked By</p>
                  <p class="name">${certificateData.checkedBy || 'N/A'}</p>
                </div>
              </div>
              <div class="signature-row">
                <div class="signature-box">
                  <div class="signature-line"></div>
                  <p class="label">Approved By Engineer</p>
                  <p class="name">${certificateData.approvedByEngineer?.name || 'N/A'}</p>
                </div>
                <div class="signature-box">
                  <div class="signature-line"></div>
                  <p class="label">Approved By Manager</p>
                  <p class="name">${certificateData.approvedByManager?.name || 'N/A'}</p>
                </div>
              </div>
            </div>

            <!-- Footer -->
            <div class="footer">
              <p class="company-name">${laboratory.name} | ${laboratory.address}</p>
              <p>${laboratory.email}</p>
              <p style="margin: 16px 0 0 0;">This certificate is valid only for the samples tested and the conditions specified.</p>
            </div>
          </div>
        </body>
      </html>
    `;
  }

  static async closeBrowser(): Promise<void> {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
    }
  }
}
