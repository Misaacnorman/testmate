
"use client";

import React from 'react';
import { useAuth } from '@/context/auth-context';
import { WaterAbsorptionCertificateData } from './WaterAbsorptionCertificateData';
import QRCode from 'qrcode.react';

interface CertificateTemplateProps {
  data: WaterAbsorptionCertificateData;
}

export const WaterAbsorptionCertificateTemplate: React.FC<CertificateTemplateProps> = ({ data }) => {
  const { laboratory } = useAuth();
  const qrCodeValue = `Cert No: ${data.certificateNo}\nClient: ${data.clientName}\nDate: ${data.dateOfIssue}`;

  return (
    <div id="certificate-content-printable" className="certificate-container bg-white p-8 font-sans text-[10px] leading-relaxed">
        {/* Header */}
        <header className="flex justify-between items-start pb-4 border-b-2 border-black">
            <div className="flex items-center gap-4">
                {laboratory?.logo && <img src={laboratory.logo} alt="Company Logo" className="h-16"/>}
                <div>
                    <h1 className="text-xl font-bold uppercase">{laboratory?.name}</h1>
                    <p className="text-gray-600">{laboratory?.address}</p>
                    <p className="text-gray-600">{laboratory?.email}</p>
                </div>
            </div>
            <div className="text-right">
                <h2 className="text-base font-bold text-gray-800">TEST CERTIFICATE</h2>
                <p><span className="font-semibold">Certificate No:</span> {data.certificateNo}</p>
                <p><span className="font-semibold">Date of Issue:</span> {data.dateOfIssue}</p>
                <p><span className="font-semibold">Version:</span> {data.version}</p>
            </div>
        </header>

        <main>
            {/* Details Grid */}
            <section className="grid grid-cols-[1fr,auto,1fr] gap-x-8 py-4 text-[10px]">
                <div className="space-y-1">
                    <p><strong>1. Client Name:</strong> {data.clientName}</p>
                    <p><strong>2. Client Address:</strong> {data.clientAddress}</p>
                    <p><strong>4. Project Title:</strong> {data.projectTitle}</p>
                    <p><strong>5. Sample Description:</strong> {data.sampleDescription}</p>
                    <p><strong>6. Condition at receipt:</strong> {data.conditionAtReceipt}</p>
                    <p><strong>8. Nature of test:</strong> {data.natureOfTest}</p>
                </div>
                <div className="w-px bg-gray-200"></div>
                <div className="space-y-1">
                    <p><strong>3. Client Contact:</strong> {data.clientContact}</p>
                    <p><strong>7. Date of Receipt:</strong> {data.dateOfReceipt}</p>
                    <p><strong>9. Sampling Report:</strong> {data.samplingReport}</p>
                    <p><strong>12. Tested by:</strong> {data.testedBy}</p>
                </div>
            </section>
            <section className="grid grid-cols-[auto,1fr] gap-x-8 pb-4 text-[10px]">
                 <p><strong>10. Test Method(s):</strong></p><p>{data.testMethods}</p>
                 <p><strong>11. Test Location:</strong></p><p>{data.testLocation}</p>
                 <p><strong>13. Attachment(s):</strong></p><p>{data.attachments}</p>
                 <p><strong>14. Results:</strong></p><p></p>
            </section>

            {/* Test Results Header Box */}
            <div className="border-2 border-black mb-4">
                <h3 className="text-center font-bold py-1 bg-gray-200 border-b-2 border-black text-sm uppercase">Test Results for {data.sampleType}</h3>
                <div className="grid grid-cols-2 text-[10px]">
                    <div className="border-r-2 border-black">
                        <div className="grid grid-cols-[150px,1fr]"><p className="p-1 border-b-2 border-black font-semibold">Sample type:</p><p className="p-1 border-b-2 border-black">{data.sampleType}</p></div>
                        <div className="grid grid-cols-[150px,1fr]"><p className="p-1 border-b-2 border-black font-semibold">Method of Compaction:</p><p className="p-1 border-b-2 border-black">{data.methodOfCompaction}</p></div>
                        <div className="grid grid-cols-[150px,1fr]"><p className="p-1 border-b-2 border-black font-semibold">Testing Age:</p><p className="p-1 border-b-2 border-black">{data.testingAge}</p></div>
                        <div className="grid grid-cols-[150px,1fr]"><p className="p-1 font-semibold">Area of use:</p><p className="p-1">{data.areaOfUse}</p></div>
                    </div>
                    <div>
                        <div className="grid grid-cols-[150px,1fr]"><p className="p-1 border-b-2 border-black font-semibold">Curing condition:</p><p className="p-1 border-b-2 border-black">{data.curingCondition}</p></div>
                        <div className="grid grid-cols-[150px,1fr]"><p className="p-1 font-semibold">Facility Temperature:</p><p className="p-1">{data.facilityTemperature}</p></div>
                    </div>
                </div>
            </div>

            {/* Results Table */}
            <table className="w-full border-collapse border-2 border-black text-[10px] text-center mb-4">
                <thead className="bg-gray-200">
                    <tr className="[&>th]:border-2 [&>th]:border-black [&>th]:p-1 [&>th]:font-bold">
                        <th rowSpan={2}>DATE OF<br />CASTING</th>
                        <th rowSpan={2}>DATE OF<br />TESTING</th>
                        <th rowSpan={2}>SAMPLE<br />NUMBER</th>
                        <th colSpan={3}>MEASURED SPECIMEN<br />DIMENSIONS (mm)</th>
                        <th rowSpan={2}>CROSS SECTIONAL<br />AREA (mm²)</th>
                        <th rowSpan={2}>INITIAL OVEN<br />WEIGHT BEFORE<br/>SOAKING (kg)</th>
                        <th rowSpan={2}>WEIGHT<br />AFTER<br />SOAKING (kg)</th>
                        <th rowSpan={2}>MASS<br />DIFFERENCE<br />(kg)</th>
                        <th rowSpan={2}>WATER<br />ABSORPTION<br />(%)</th>
                    </tr>
                    <tr className="[&>th]:border-2 [&>th]:border-black [&>th]:p-1 [&>th]:font-bold">
                        <th>L</th>
                        <th>W</th>
                        <th>H</th>
                    </tr>
                </thead>
                <tbody>
                    {data.testResults.map((result, index) => (
                        <tr key={index} className="[&>td]:border-2 [&>td]:border-black [&>td]:p-1">
                            {index === 0 ? (
                                <>
                                    <td rowSpan={data.testResults.length}>{data.dateOfCasting}</td>
                                    <td rowSpan={data.testResults.length}>{data.dateOfTesting}</td>
                                </>
                            ) : null}
                            <td>{result.sampleNumber}</td>
                            <td>{result.length.toFixed(1)}</td>
                            <td>{result.width.toFixed(1)}</td>
                            <td>{result.height.toFixed(1)}</td>
                            <td>{result.crossSectionalArea.toFixed(0)}</td>
                            <td>{result.initialOvenWeight.toFixed(2)}</td>
                            <td>{result.weightAfterSoaking.toFixed(2)}</td>
                            <td>{result.massDifference.toFixed(2)}</td>
                            <td>{result.waterAbsorptionPercentage.toFixed(1)}</td>
                        </tr>
                    ))}
                </tbody>
                 {data.averageWaterAbsorption ? (
                    <tfoot className="font-bold bg-gray-200">
                        <tr className="[&>td]:border-2 [&>td]:border-black [&>td]:p-1">
                            <td colSpan={10} className="text-right">Average Water Absorption (%):</td>
                            <td>{data.averageWaterAbsorption.toFixed(1)}</td>
                        </tr>
                    </tfoot>
                 ) : null}
            </table>

            {/* Remarks and Signatories */}
            <div className="space-y-4 text-[10px] leading-tight">
                <div>
                    <p className="font-semibold">15. Remarks:</p>
                    <ol className="list-decimal list-inside">
                        {data.remarks.map((remark, index) => <li key={index} className="pl-1">{remark}</li>)}
                    </ol>
                </div>

                <div className="text-center font-semibold pt-2">
                    ................................................END OF REPORT................................................
                </div>
                
                 <div className="flex justify-between items-end pt-12">
                    <div className="text-center">
                        {data.checkedBy?.signatureURL ? (
                            <div className="mb-1 h-10 flex justify-center items-center">
                                <img src={data.checkedBy.signatureURL} alt="Engineer's Signature" className="max-h-full"/>
                            </div>
                        ) : <div className="h-10"></div>}
                        <p className="border-t border-black px-8 pt-1">{data.checkedBy?.name || 'N/A'}</p>
                        <p className="font-semibold">Materials Engineer</p>
                    </div>
                    <div className="text-center">
                        {data.approvedBy?.signatureURL ? (
                            <div className="mb-1 h-10 flex justify-center items-center">
                                <img src={data.approvedBy.signatureURL} alt="Manager's Signature" className="max-h-full"/>
                            </div>
                        ) : <div className="h-10"></div>}
                         <p className="border-t border-black px-8 pt-1">{data.approvedBy?.name || 'N/A'}</p>
                         <p className="font-semibold">Technical Manager</p>
                    </div>
                    <div className="text-center">
                         <div className="h-10"></div>
                         <p className="border-t border-black px-8 pt-1">{data.clientRepresentative || 'Client\'s Representative'}</p>
                         <p className="font-semibold">Client's Representative</p>
                    </div>
                </div>

                {data.status === 'Approved' && (
                    <div className="flex justify-between items-center pt-8">
                        <div>
                            <QRCode value={qrCodeValue} size={64} />
                        </div>
                        <div className="relative h-24 w-24">
                           {laboratory?.stampSettings?.stampUrl && (
                             <img src={laboratory.stampSettings.stampUrl} alt="Lab Stamp" className="h-24 w-24" />
                           )}
                        </div>
                    </div>
                )}
            </div>
        </main>
    </div>
  );
};

    