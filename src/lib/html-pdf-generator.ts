import puppeteer, { Browser, Page } from 'puppeteer';
import fs from 'fs';
import path from 'path';

export interface CertificateData {
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
  
  // Test results
  sampleType: string;
  classOfConcrete: string;
  designCompressiveStrength: string;
  testingAge: string;
  areaOfUse: string;
  compressiveTestingMachineId: string;
  curingCondition: string;
  curingPeriod: string;
  facilityTemperature: string;
  typeOfFailure: string;
  
  // Test data
  testResults: Array<{
    sampleNumber: number;
    dimensions: {
      length: number;
      width: number;
      height: number;
    };
    crossSectionalArea: number;
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

export interface PaverCertificateData {
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

export class HTMLPDFGenerator {
  private static instance: HTMLPDFGenerator;
  private browser: Browser | null = null;

  private constructor() {}

  public static getInstance(): HTMLPDFGenerator {
    if (!HTMLPDFGenerator.instance) {
      HTMLPDFGenerator.instance = new HTMLPDFGenerator();
    }
    return HTMLPDFGenerator.instance;
  }

  private async getBrowser(): Promise<Browser> {
    if (!this.browser) {
      this.browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      });
    }
    return this.browser;
  }

  public async generateConcreteCertificatePDF(data: CertificateData): Promise<Buffer> {
    console.log('Starting PDF generation with data:', JSON.stringify(data, null, 2));
    
    const browser = await this.getBrowser();
    console.log('Browser instance obtained');
    
    const page = await browser.newPage();
    console.log('New page created');

    try {
      // Read the HTML template
      const templatePath = path.join(process.cwd(), 'src', 'templates', 'concrete-certificate.html');
      console.log('Template path:', templatePath);
      
      let htmlTemplate = fs.readFileSync(templatePath, 'utf8');
      console.log('Template loaded, length:', htmlTemplate.length);

      // Replace template variables with actual data
      htmlTemplate = this.populateTemplate(htmlTemplate, data);
      console.log('Template populated, length:', htmlTemplate.length);

      // Set the HTML content
      console.log('Setting page content...');
      await page.setContent(htmlTemplate, { waitUntil: 'networkidle0' });
      console.log('Page content set successfully');

      // Generate PDF
      console.log('Generating PDF...');
      const pdfBuffer = await page.pdf({
        format: 'A4',
        margin: {
          top: '0.5in',
          right: '0.5in',
          bottom: '0.5in',
          left: '0.5in'
        },
        printBackground: true,
        preferCSSPageSize: false
      });
      console.log('PDF generated, size:', pdfBuffer.length);

          return Buffer.from(pdfBuffer);
        } catch (error) {
          console.error('Error in PDF generation:', error);
          throw error;
        } finally {
          await page.close();
          console.log('Page closed');
        }
      }

      public async generatePaverCertificatePDF(data: PaverCertificateData): Promise<Buffer> {
        console.log('Starting Paver PDF generation with data:', JSON.stringify(data, null, 2));
        
        const browser = await this.getBrowser();
        console.log('Browser instance obtained');
        
        const page = await browser.newPage();
        console.log('New page created');

        try {
          // Read the HTML template
          const templatePath = path.join(process.cwd(), 'src', 'templates', 'paver-certificate.html');
          console.log('Template path:', templatePath);
          
          let htmlTemplate = fs.readFileSync(templatePath, 'utf8');
          console.log('Template loaded, length:', htmlTemplate.length);

          // Replace template variables with actual data
          htmlTemplate = this.populatePaverTemplate(htmlTemplate, data);
          console.log('Template populated, length:', htmlTemplate.length);

          // Set the HTML content
          console.log('Setting page content...');
          await page.setContent(htmlTemplate, { waitUntil: 'networkidle0' });
          console.log('Page content set successfully');

          // Generate PDF
          console.log('Generating PDF...');
          const pdfBuffer = await page.pdf({
            format: 'A4',
            margin: {
              top: '0.5in',
              right: '0.5in',
              bottom: '0.5in',
              left: '0.5in'
            },
            printBackground: true,
            preferCSSPageSize: false
          });
          console.log('PDF generated, size:', pdfBuffer.length);

          return Buffer.from(pdfBuffer);
        } catch (error) {
          console.error('Error in PDF generation:', error);
          throw error;
        } finally {
          await page.close();
          console.log('Page closed');
        }
      }

  private populateTemplate(template: string, data: CertificateData): string {
    // Replace basic variables
    let html = template
      .replace(/\{\{logoUrl\}\}/g, data.logoUrl || '')
      .replace(/\{\{companyName\}\}/g, data.companyName || '')
      .replace(/\{\{companyAddress\}\}/g, data.companyAddress || '')
      .replace(/\{\{companyEmail\}\}/g, data.companyEmail || '')
      .replace(/\{\{certificateNo\}\}/g, data.certificateNo || '')
      .replace(/\{\{dateOfIssue\}\}/g, data.dateOfIssue || '')
      .replace(/\{\{version\}\}/g, data.version || '01')
      .replace(/\{\{clientName\}\}/g, data.clientName || '')
      .replace(/\{\{clientAddress\}\}/g, data.clientAddress || '')
      .replace(/\{\{clientContact\}\}/g, data.clientContact || '')
      .replace(/\{\{projectTitle\}\}/g, data.projectTitle || '')
      .replace(/\{\{conditionAtReceipt\}\}/g, data.conditionAtReceipt || '')
      .replace(/\{\{dateOfReceipt\}\}/g, data.dateOfReceipt || '')
      .replace(/\{\{samplingReport\}\}/g, data.samplingReport || 'N/A')
      .replace(/\{\{natureOfTest\}\}/g, data.natureOfTest || '')
      .replace(/\{\{testedBy\}\}/g, data.testedBy || '')
      .replace(/\{\{testMethods\}\}/g, data.testMethods || '')
      .replace(/\{\{testLocation\}\}/g, data.testLocation || '')
      .replace(/\{\{attachments\}\}/g, data.attachments || 'None')
      .replace(/\{\{sampleType\}\}/g, data.sampleType || '')
      .replace(/\{\{classOfConcrete\}\}/g, data.classOfConcrete || '')
      .replace(/\{\{designCompressiveStrength\}\}/g, data.designCompressiveStrength || '')
      .replace(/\{\{testingAge\}\}/g, data.testingAge || '')
      .replace(/\{\{areaOfUse\}\}/g, data.areaOfUse || '')
      .replace(/\{\{compressiveTestingMachineId\}\}/g, data.compressiveTestingMachineId || '')
      .replace(/\{\{curingCondition\}\}/g, data.curingCondition || 'Tested as Received')
      .replace(/\{\{curingPeriod\}\}/g, data.curingPeriod || 'N/A')
      .replace(/\{\{facilityTemperature\}\}/g, data.facilityTemperature || '')
      .replace(/\{\{typeOfFailure\}\}/g, data.typeOfFailure || 'Satisfactory')
      .replace(/\{\{dateOfCasting\}\}/g, data.dateOfCasting || '')
      .replace(/\{\{dateOfTesting\}\}/g, data.dateOfTesting || '')
      .replace(/\{\{averageCompressiveStrength\}\}/g, data.averageCompressiveStrength?.toFixed(1) || '0.0')
      .replace(/\{\{engineerName\}\}/g, data.engineerName || '')
      .replace(/\{\{managerName\}\}/g, data.managerName || 'N/A');

    // Generate test results table rows with proper decimal precision
    const testResultsRows = data.testResults.map((result, index) => {
      const isFirstRow = index === 0;
      const rowSpan = data.testResults.length;
      
      return `
        <tr>
          ${isFirstRow ? `<td rowspan="${rowSpan}">${data.dateOfCasting}</td>` : ''}
          ${isFirstRow ? `<td rowspan="${rowSpan}">${data.dateOfTesting}</td>` : ''}
          <td>${result.sampleNumber}</td>
          <td>${result.dimensions.length.toFixed(1)}</td>
          <td>${result.dimensions.width.toFixed(1)}</td>
          <td>${result.dimensions.height.toFixed(1)}</td>
          <td>${result.crossSectionalArea}</td>
          <td>${result.weightOfSample.toFixed(2)}</td>
          <td>${result.densityOfSample}</td>
          <td>${result.failureLoad.toFixed(1)}</td>
          <td>${result.correctedFailureLoad.toFixed(1)}</td>
          <td>${result.compressiveStrength.toFixed(1)}</td>
        </tr>
      `;
    }).join('');

    html = html.replace(/\{\{testResultsRows\}\}/g, testResultsRows);

    return html;
  }

  private populatePaverTemplate(template: string, data: PaverCertificateData): string {
    // Replace basic variables
    let html = template
      .replace(/\{\{logoUrl\}\}/g, data.logoUrl || '')
      .replace(/\{\{companyName\}\}/g, data.companyName || '')
      .replace(/\{\{companyAddress\}\}/g, data.companyAddress || '')
      .replace(/\{\{companyEmail\}\}/g, data.companyEmail || '')
      .replace(/\{\{certificateNo\}\}/g, data.certificateNo || '')
      .replace(/\{\{dateOfIssue\}\}/g, data.dateOfIssue || '')
      .replace(/\{\{version\}\}/g, data.version || '01')
      .replace(/\{\{clientName\}\}/g, data.clientName || '')
      .replace(/\{\{clientAddress\}\}/g, data.clientAddress || '')
      .replace(/\{\{clientContact\}\}/g, data.clientContact || '')
      .replace(/\{\{projectTitle\}\}/g, data.projectTitle || '')
      .replace(/\{\{conditionAtReceipt\}\}/g, data.conditionAtReceipt || '')
      .replace(/\{\{dateOfReceipt\}\}/g, data.dateOfReceipt || '')
      .replace(/\{\{samplingReport\}\}/g, data.samplingReport || 'N/A')
      .replace(/\{\{natureOfTest\}\}/g, data.natureOfTest || '')
      .replace(/\{\{testedBy\}\}/g, data.testedBy || '')
      .replace(/\{\{testMethods\}\}/g, data.testMethods || '')
      .replace(/\{\{testLocation\}\}/g, data.testLocation || '')
      .replace(/\{\{attachments\}\}/g, data.attachments || 'None')
      .replace(/\{\{sampleCountText\}\}/g, data.sampleCountText || 'Two (02)')
      .replace(/\{\{paverType\}\}/g, data.paverType || '')
      .replace(/\{\{methodOfCompaction\}\}/g, data.methodOfCompaction || '')
      .replace(/\{\{testingAge\}\}/g, data.testingAge || '')
      .replace(/\{\{numberOfPaversPerSqm\}\}/g, data.numberOfPaversPerSqm || '')
      .replace(/\{\{calculatedArea\}\}/g, data.calculatedArea || '')
      .replace(/\{\{areaOfUse\}\}/g, data.areaOfUse || '')
      .replace(/\{\{compressiveTestingMachineId\}\}/g, data.compressiveTestingMachineId || '')
      .replace(/\{\{curingCondition\}\}/g, data.curingCondition || 'Tested as Received')
      .replace(/\{\{facilityTemperature\}\}/g, data.facilityTemperature || '')
      .replace(/\{\{typeOfFailure\}\}/g, data.typeOfFailure || 'Satisfactory')
      .replace(/\{\{paverThickness\}\}/g, data.paverThickness || '')
      .replace(/\{\{areaUsedForStrength\}\}/g, data.areaUsedForStrength || '')
      .replace(/\{\{dateOfCasting\}\}/g, data.dateOfCasting || '')
      .replace(/\{\{dateOfTesting\}\}/g, data.dateOfTesting || '')
      .replace(/\{\{averageCompressiveStrength\}\}/g, data.averageCompressiveStrength?.toFixed(1) || '0.0')
      .replace(/\{\{engineerName\}\}/g, data.engineerName || '')
      .replace(/\{\{managerName\}\}/g, data.managerName || 'N/A');

    // Generate test results table rows with proper decimal precision
    const testResultsRows = data.testResults.map((result, index) => {
      const isFirstRow = index === 0;
      const rowSpan = data.testResults.length;
      
      return `
        <tr>
          ${isFirstRow ? `<td rowspan="${rowSpan}">${data.dateOfCasting}</td>` : ''}
          ${isFirstRow ? `<td rowspan="${rowSpan}">${data.dateOfTesting}</td>` : ''}
          <td>${result.sampleNumber}</td>
          <td>${result.thickness.toFixed(1)}</td>
          <td>${result.correctionFactor.toFixed(2)}</td>
          <td>${Math.round(result.computedPlanArea)}</td>
          <td>${result.weightOfSample.toFixed(2)}</td>
          <td>${result.densityOfSample}</td>
          <td>${result.failureLoad.toFixed(1)}</td>
          <td>${result.correctedFailureLoad.toFixed(1)}</td>
          <td>${result.compressiveStrength.toFixed(1)}</td>
        </tr>
      `;
    }).join('');

    html = html.replace(/\{\{testResultsRows\}\}/g, testResultsRows);

    return html;
  }

  public async close(): Promise<void> {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
    }
  }
}
