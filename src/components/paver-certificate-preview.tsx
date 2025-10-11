import React, { useRef, useEffect } from 'react';
import { PaverCertificateData } from '@/lib/html-pdf-generator';

interface PaverCertificatePreviewProps {
  data: PaverCertificateData;
}

export function PaverCertificatePreview({ data }: PaverCertificatePreviewProps) {
  const previewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (previewRef.current && data && data.testResults) {
      // Generate the HTML content using the same template as PDF
      const htmlContent = generatePaverCertificateHTML(data);
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
      className="paver-certificate-preview-container"
    />
  );
}

function generatePaverCertificateHTML(data: PaverCertificateData): string {
  // Generate test results table rows with proper decimal precision
  const testResults = data.testResults || [];
  const testResultsRows = testResults.map((result, index) => {
    const isFirstRow = index === 0;
    const rowSpan = testResults.length;
    
    // Calculate density correctly: density = weight / (thickness * computedPlanArea)
    // Convert thickness from mm to m for SI units: thickness(mm) / 1000 = thickness(m)
    // density = weight(kg) / (thickness(m) * area(m²))
    const thicknessInMeters = (result.thickness || 0) / 1000; // Convert mm to m
    const areaInSquareMeters = (result.computedPlanArea || 0) / 1000000; // Convert mm² to m²
    const calculatedDensity = thicknessInMeters > 0 && areaInSquareMeters > 0 
      ? (result.weightOfSample || 0) / (thicknessInMeters * areaInSquareMeters)
      : 0;
    
    return `
      <tr>
        ${isFirstRow ? `<td rowspan="${rowSpan}">${data.dateOfCasting || ''}</td>` : ''}
        ${isFirstRow ? `<td rowspan="${rowSpan}">${data.dateOfTesting || ''}</td>` : ''}
        <td>${result.sampleNumber || ''}</td>
        <td>${(result.thickness || 0).toFixed(1)}</td>
        <td>${(result.correctionFactor || 0).toFixed(2)}</td>
        <td>${Math.round(result.computedPlanArea || 0)}</td>
        <td>${(result.weightOfSample || 0).toFixed(2)}</td>
        <td>${Math.round(calculatedDensity)}</td>
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
                <span class="info-value">${data.certificateNo || ''}</span>
            </div>
            <div class="info-item">
                <span class="info-label"><strong>Version:</strong></span>
                <span class="info-value">${data.version || '01'}</span>
            </div>
          </div>
          <div class="certificate-info-right">
            <div class="info-item">
                <span class="info-label"><strong>Date of Issue:</strong></span>
                <span class="info-value">${data.dateOfIssue || ''}</span>
            </div>
            <div class="info-item">
                <span class="info-label"><strong>Page 1 of 1</strong></span>
                <span class="info-value"></span>
            </div>
          </div>
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
                  <span class="info-value">${data.sampleCountText || 'Two (02)'} paving blocks were delivered to the laboratory for testing</span>
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
                  <span class="info-value">${data.testMethods || ''}</span>
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
            TEST RESULTS FOR PAVING BLOCKS
        </div>
        <div class="test-results-grid">
            <div class="test-results-column">
                <div class="test-result-item">
                    <span class="test-result-label">Paver type/ name:</span>
                    <span class="test-result-value">${data.paverType || ''}</span>
                </div>
                <div class="test-result-item">
                    <span class="test-result-label">Method of Compaction:</span>
                    <span class="test-result-value">${data.methodOfCompaction || ''}</span>
                </div>
                <div class="test-result-item">
                    <span class="test-result-label">Testing Age:</span>
                    <span class="test-result-value">${data.testingAge || ''}</span>
                </div>
                <div class="test-result-item">
                    <span class="test-result-label">Number of pavers per (m²):</span>
                    <span class="test-result-value">${data.numberOfPaversPerSqm || ''} Pavers Determined from calculated unit area</span>
                </div>
                <div class="test-result-item">
                    <span class="test-result-label">Calculated Area (mm²):</span>
                    <span class="test-result-value">${data.calculatedArea || ''}</span>
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
                    <span class="test-result-label">Facility Temperature:</span>
                    <span class="test-result-value">${data.facilityTemperature || ''}</span>
                </div>
                <div class="test-result-item">
                    <span class="test-result-label">Type of Failure:</span>
                    <span class="test-result-value">${data.typeOfFailure || ''}</span>
                </div>
                <div class="test-result-item">
                    <span class="test-result-label">Paver Thickness:</span>
                    <span class="test-result-value">${data.paverThickness || ''}</span>
                </div>
                <div class="test-result-item">
                    <span class="test-result-label">Area used for strength evaluation:</span>
                    <span class="test-result-value">${data.areaUsedForStrength || ''}</span>
                </div>
            </div>
        </div>

        <!-- Detailed Results Table -->
        <table class="data-table">
            <thead>
                <tr>
                    <th rowspan="2">DATE OF CASTING</th>
                    <th rowspan="2">DATE OF TESTING</th>
                    <th rowspan="2">SAMPLE NUMBER</th>
                    <th colspan="1">MEASURED THICKNESS</th>
                    <th rowspan="2">CORRECTION FACTOR</th>
                    <th rowspan="2">COMPUTED PLAN AREA (mm²)</th>
                    <th rowspan="2">WEIGHT OF SAMPLE (kg)</th>
                    <th rowspan="2">DENSITY OF SAMPLE (kg/m³)</th>
                    <th rowspan="2">FAILURE LOAD (kN)</th>
                    <th rowspan="2">CORRECTED FAILURE LOAD (kN)</th>
                    <th rowspan="2">COMPRESSIVE STRENGTH (N/mm²)</th>
                </tr>
                <tr>
                    <th>H (mm)</th>
                </tr>
            </thead>
            <tbody>
                ${testResultsRows}
                <tr class="average-row">
                    <td colspan="10" class="average-label">Average Compressive Strength :</td>
                    <td class="average-value">${(data.averageCompressiveStrength || 0).toFixed(1)}</td>
                </tr>
            </tbody>
        </table>
    </div>

    <!-- Remarks Section -->
    <div class="remarks-section">
        <div class="remarks-title">15. Remarks:</div>
        <ul class="remarks-content">
            <li>15.1 This report relates only to the samples tested.</li>
            <li>15.2 All information about the specimen furnished by the client/ client representative.</li>
            <li>15.3 The test was carried out according to BS 6717: 1993, Precast concrete paving blocks - Part 1. Specification for paving blocks</li>
            <li>15.4 All tested samples will be discarded immediately after the test.</li>
            <li>15.5 The average compressive strength value is not provided on this certificate because of the variability in the results which exceeds the repeatability condition (r = 9%)</li>
        </ul>
    </div>

    <!-- End of Report -->
    <div class="end-of-report">
        <div class="end-line"></div>
        ................................................................................END OF REPORT................................................................................
    </div>

        <!-- Signatures -->
        <div class="signatures">
            <div class="signature-box">
                <div class="signature-label">Checked by:</div>
                <div class="signature-line"></div>
                <div class="signature-title">Materials Engineer</div>
            </div>
            <div class="signature-box">
                <div class="signature-label">Approved by: ${data.managerName || ''}</div>
                <div class="signature-line"></div>
                <div class="signature-title">Technical Manager</div>
            </div>
        </div>

    <!-- Footer -->
    <div class="footer">
        <p><strong>Date of Issue:</strong> ${data.dateOfIssue || ''} | <strong>Page 1 of 1</strong></p>
    </div>
  `;
}
