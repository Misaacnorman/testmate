"use client";

import React, { useEffect, useRef } from 'react';
import { CertificateData } from '@/lib/html-pdf-generator';

interface CertificatePreviewProps {
  data: CertificateData;
}

export function CertificatePreview({ data }: CertificatePreviewProps) {
  const previewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (previewRef.current && data && data.testResults) {
      // Generate the HTML content using the same template as PDF
      const htmlContent = generateCertificateHTML(data);
      previewRef.current.innerHTML = htmlContent;
    }
  }, [data]);

  // Show loading state if data is not ready
  if (!data || !data.testResults) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-500">Loading certificate preview...</div>
      </div>
    );
  }

  return (
    <div 
      ref={previewRef}
      className="certificate-preview-container"
      style={{
        width: '100%',
        maxWidth: '210mm',
        margin: '0 auto',
        padding: '12px',
        background: 'white',
        fontFamily: 'Arial, sans-serif',
        fontSize: '11px',
        lineHeight: '1.3',
        color: '#000'
      }}
    />
  );
}

function generateCertificateHTML(data: CertificateData): string {
  // Generate test results table rows with proper decimal precision
  const testResults = data.testResults || [];
  const testResultsRows = testResults.map((result, index) => {
    const isFirstRow = index === 0;
    const rowSpan = testResults.length;
    
    return `
      <tr>
        ${isFirstRow ? `<td rowspan="${rowSpan}">${data.dateOfCasting || ''}</td>` : ''}
        ${isFirstRow ? `<td rowspan="${rowSpan}">${data.dateOfTesting || ''}</td>` : ''}
        <td>${result.sampleNumber || ''}</td>
        <td>${(result.dimensions?.length || 0).toFixed(1)}</td>
        <td>${(result.dimensions?.width || 0).toFixed(1)}</td>
        <td>${(result.dimensions?.height || 0).toFixed(1)}</td>
        <td>${result.crossSectionalArea || 0}</td>
        <td>${(result.weightOfSample || 0).toFixed(2)}</td>
        <td>${result.densityOfSample || 0}</td>
        <td>${(result.failureLoad || 0).toFixed(1)}</td>
        <td>${(result.correctedFailureLoad || 0).toFixed(1)}</td>
        <td>${(result.compressiveStrength || 0).toFixed(1)}</td>
      </tr>
    `;
  }).join('');

  return `
    <div class="certificate">
      <!-- Header -->
      <div class="header">
        <div class="company-info">
          ${data.logoUrl ? `<img src="${data.logoUrl}" alt="Company Logo" class="logo">` : ''}
          <div class="company-details">
            <h1>${data.companyName || ''}</h1>
            <p>${data.companyAddress || ''}</p>
            <p>${data.companyEmail || ''}</p>
          </div>
        </div>
        <div class="certificate-title">
          <h2>TEST CERTIFICATE</h2>
          <div class="certificate-details">
            <p><strong>Date of Issue:</strong> ${data.dateOfIssue || ''}</p>
            <p><strong>Page 1 of 1</strong></p>
          </div>
        </div>
      </div>

      <!-- Certificate Info -->
      <div class="certificate-info">
        <div class="certificate-info-grid">
          <div class="certificate-info-left">
            <div class="info-item">
              <span class="info-label"><strong>CERTIFICATE No.:</strong></span>
              <span class="info-value">${data.certificateNo}</span>
            </div>
            <div class="info-item">
              <span class="info-label"><strong>Version:</strong></span>
              <span class="info-value">${data.version}</span>
            </div>
          </div>
          <div class="certificate-info-right">
            <!-- Right side content will be populated by client info -->
          </div>
        </div>

        <!-- Client and Project Information - Sequential Layout -->
        <div class="client-info-grid">
          <div class="client-info-left">
            <div class="info-item">
              <span class="info-label"><strong>1. Client Name:</strong></span>
              <span class="info-value">${data.clientName || ''}</span>
            </div>
            <div class="info-item">
              <span class="info-label"><strong>2. Client Address:</strong></span>
              <span class="info-value">${data.clientAddress || ''}</span>
            </div>
            <div class="info-item">
              <span class="info-label"><strong>4. Project Title:</strong></span>
              <span class="info-value">${data.projectTitle || ''}</span>
            </div>
            <div class="info-item">
              <span class="info-label"><strong>5. Sample Description:</strong></span>
              <span class="info-value">Two (02) concrete cubes were delivered to the laboratory for testing</span>
            </div>
            <div class="info-item">
              <span class="info-label"><strong>6. Condition at receipt:</strong></span>
              <span class="info-value">${data.conditionAtReceipt || ''}</span>
            </div>
            <div class="info-item">
              <span class="info-label"><strong>8. Nature of test:</strong></span>
              <span class="info-value">Compressive strength of test specimens</span>
            </div>
            <div class="info-item">
              <span class="info-label"><strong>10. Test Method(s):</strong></span>
              <span class="info-value">BS EN 12390-3: 2019, BS EN 12390-1: 2019 & BS EN 12390-7: 2019</span>
            </div>
            <div class="info-item">
              <span class="info-label"><strong>11. Test Location:</strong></span>
              <span class="info-value">${data.testLocation || ''}</span>
            </div>
            <div class="info-item">
              <span class="info-label"><strong>13. Attachment(s):</strong></span>
              <span class="info-value">${data.attachments || ''}</span>
            </div>
            <div class="info-item">
              <span class="info-label"><strong>14. Results:</strong></span>
              <span class="info-value"></span>
            </div>
          </div>
          <div class="client-info-right">
            <div class="info-item">
              <span class="info-label"><strong>3. Client Contact:</strong></span>
              <span class="info-value">${data.clientContact || ''}</span>
            </div>
            <div class="info-item">
              <span class="info-label"><strong>7. Date of Receipt:</strong></span>
              <span class="info-value">${data.dateOfReceipt || ''}</span>
            </div>
            <div class="info-item">
              <span class="info-label"><strong>9. Sampling Report:</strong></span>
              <span class="info-value">${data.samplingReport || ''}</span>
            </div>
            <div class="info-item">
              <span class="info-label"><strong>12. Tested by:</strong></span>
              <span class="info-value">${data.testedBy || ''}</span>
            </div>
          </div>
        </div>

        <!-- Results line -->
        <div class="results-line"></div>
      </div>

      <!-- Test Results Section -->
      <div class="test-results-section">
        <div class="test-results-title">
          <strong>TEST RESULTS FOR CONCRETE CUBES</strong>
        </div>
        
        <!-- Test Results Summary -->
        <div class="test-results-grid">
          <div class="test-results-column">
            <div class="test-result-item">
              <span class="test-result-label">Sample type/ Size:</span>
              <span class="test-result-value">${data.sampleType || ''}</span>
            </div>
            <div class="test-result-item">
              <span class="test-result-label">Class of Concrete:</span>
              <span class="test-result-value">${data.classOfConcrete || ''}</span>
            </div>
            <div class="test-result-item">
              <span class="test-result-label">Design Compressive Strength:</span>
              <span class="test-result-value">${data.designCompressiveStrength || ''}</span>
            </div>
            <div class="test-result-item">
              <span class="test-result-label">Testing Age:</span>
              <span class="test-result-value">${data.testingAge || ''}</span>
            </div>
            <div class="test-result-item">
              <span class="test-result-label">Area of use:</span>
              <span class="test-result-value">${data.areaOfUse || ''}</span>
            </div>
            <div class="test-result-item">
              <span class="test-result-label">Compressive Testing Machine ID:</span>
              <span class="test-result-value">${data.compressiveTestingMachineId || ''}</span>
            </div>
          </div>
          <div class="test-results-column">
            <div class="test-result-item">
              <span class="test-result-label">Curing condition:</span>
              <span class="test-result-value">${data.curingCondition || ''}</span>
            </div>
            <div class="test-result-item">
              <span class="test-result-label">Curing Period at the Facility:</span>
              <span class="test-result-value">${data.curingPeriod || ''}</span>
            </div>
            <div class="test-result-item">
              <span class="test-result-label">Facility Temperature:</span>
              <span class="test-result-value">${data.facilityTemperature || ''}</span>
            </div>
            <div class="test-result-item">
              <span class="test-result-label">Type of Failure:</span>
              <span class="test-result-value">${data.typeOfFailure || ''}</span>
            </div>
          </div>
        </div>

        <!-- Detailed Results Table -->
        <table class="data-table">
          <thead>
            <tr>
              <th>DATE OF<br>CASTING</th>
              <th>DATE OF<br>TESTING</th>
              <th>SAMPLE<br>NUMBER</th>
              <th colspan="3">MEASURED SPECIMEN DIMENSIONS (mm)</th>
              <th>CROSS SECTIONAL<br>AREA (mm²)</th>
              <th>WEIGHT OF<br>SAMPLE (kg)</th>
              <th>DENSITY OF<br>SAMPLE (kg/m³)</th>
              <th>FAILURE<br>LOAD (kN)</th>
              <th>CORRECTED<br>FAILURE LOAD (kN)</th>
              <th>COMPRESSIVE<br>STRENGTH (N/mm²)</th>
            </tr>
            <tr>
              <th></th>
              <th></th>
              <th></th>
              <th>L</th>
              <th>W</th>
              <th>H</th>
              <th></th>
              <th></th>
              <th></th>
              <th></th>
              <th></th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            ${testResultsRows}
          </tbody>
          <tfoot>
            <tr class="average-row">
              <td colspan="11" class="average-label">Average Compressive Strength:</td>
              <td class="average-value">${data.averageCompressiveStrength?.toFixed(1) || '0.0'}</td>
            </tr>
          </tfoot>
        </table>
      </div>

      <!-- Remarks Section -->
      <div class="remarks-section">
        <div class="remarks-title">
          <strong>15. Remarks:</strong>
        </div>
        <div class="remarks-content">
          <ul>
            <li>15.1 This report relates only to the samples tested.</li>
            <li>15.2 All information about the specimen furnished by the client/ client representative.</li>
            <li>15.3 The test was carried out according to BS EN 12390:2019, Testing of hardened concrete - Part 3: Compressive strength of test specimens</li>
            <li>15.4 All tested samples will be discarded immediately after the test.</li>
          </ul>
        </div>
        <div class="end-of-report">
          <div class="end-line"></div>
          ...END OF REPORT...
        </div>
      </div>

      <!-- Signatures -->
      <div class="signatures">
        <div class="signature-box">
          <div class="signature-label">Checked by:</div>
          <div class="signature-line"></div>
          <div class="signature-name">${data.engineerName || ''}</div>
          <div class="signature-title">Materials Engineer</div>
        </div>
        <div class="signature-box">
          <div class="signature-label">Approved by:</div>
          <div class="signature-line"></div>
          <div class="signature-name">${data.managerName || ''}</div>
          <div class="signature-title">Technical Manager</div>
        </div>
      </div>

      <!-- Footer -->
      <div class="footer">
        <p><strong>Date of Issue:</strong> ${data.dateOfIssue || ''} | <strong>Page 1 of 1</strong></p>
      </div>
    </div>
  `;
}
