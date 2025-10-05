
"use client";

import React from 'react';
import { useAuth } from '@/context/auth-context';
import { PaverCertificateData } from './PaverCertificateData';
import QRCode from 'qrcode.react';

interface CertificateTemplateProps {
  data: PaverCertificateData;
}

export const PaverCertificateTemplate: React.FC<CertificateTemplateProps> = ({ data }) => {
  const { laboratory } = useAuth();
  const qrCodeValue = `Cert No: ${data.certificateNo}\nClient: ${data.clientName}\nDate: ${data.dateOfIssue}`;

  return (
    <div id="certificate-content-printable" className="certificate-container bg-white p-8 font-sans text-[9px] leading-snug">
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
            <section className="grid grid-cols-[1fr,auto,1fr] gap-x-6 py-3">
                <div className="space-y-0.5">
                    <p><strong>1. Client Name:</strong> {data.clientName}</p>
                    <p><strong>2. Client Address:</strong> {data.clientAddress}</p>
                    <p><strong>4. Project Title:</strong> {data.projectTitle}</p>
                    <p><strong>5. Sample Description:</strong> {data.sampleDescription}</p>
                    <p><strong>6. Condition at receipt:</strong> {data.conditionAtReceipt}</p>
                    <p><strong>8. Nature of test:</strong> {data.natureOfTest}</p>
                    <p><strong>10. Test Method(s):</strong> {data.testMethods}</p>
                    <p><strong>11. Test Location:</strong> {data.testLocation}</p>
                    <p><strong>13. Attachment(s):</strong> {data.attachments}</p>
                </div>
                <div className="w-px bg-gray-200"></div>
                <div className="space-y-0.5">
                    <p><strong>3. Client Contact:</strong> {data.clientContact}</p>
                    <p><strong>7. Date of Receipt:</strong> {data.dateOfReceipt}</p>
                    <p><strong>9. Sampling Report:</strong> {data.samplingReport}</p>
                    <p><strong>12. Tested by:</strong> {data.testedBy}</p>
                </div>
            </section>
            <p><strong>14. Results:</strong></p>

            {/* Test Results Header Box */}
            <div className="border-2 border-black my-2">
                <h3 className="text-center font-bold py-1 bg-gray-200 border-b-2 border-black text-sm uppercase">TEST RESULTS FOR PAVING BLOCKS</h3>
                <div className="grid grid-cols-[1fr,1fr] text-[9px]">
                    <div className="pr-px">
                       <div className="grid grid-cols-[120px,1fr] border-b border-black"><p className="p-1 font-semibold">Paver type/ name:</p><p className="p-1 border-l border-black">{data.paverType}</p></div>
                       <div className="grid grid-cols-[120px,1fr] border-b border-black"><p className="p-1 font-semibold">Method of Compaction:</p><p className="p-1 border-l border-black">{data.methodOfCompaction}</p></div>
                       <div className="grid grid-cols-[120px,1fr] border-b border-black"><p className="p-1 font-semibold">Testing Age:</p><p className="p-1 border-l border-black">{data.testingAge}</p></div>
                       <div className="grid grid-cols-[120px,1fr] border-b border-black"><p className="p-1 font-semibold">Number of pavers per (m²):</p><p className="p-1 border-l border-black">{data.numberOfPaversPerSqm}</p></div>
                       <div className="grid grid-cols-[120px,1fr] border-b border-black"><p className="p-1 font-semibold">Calculated Area (mm²):</p><p className="p-1 border-l border-black">{data.calculatedArea}</p></div>
                       <div className="grid grid-cols-[120px,1fr]"><p className="p-1 font-semibold">Area of use:</p><p className="p-1 border-l border-black">{data.areaOfUse}</p></div>
                    </div>
                    <div className="pl-px border-l-2 border-black">
                       <div className="grid grid-cols-[120px,1fr] border-b border-black"><p className="p-1 font-semibold">Curing condition:</p><p className="p-1 border-l border-black">{data.curingCondition}</p></div>
                       <div className="grid grid-cols-[120px,1fr] border-b border-black"><p className="p-1 font-semibold">Facility Temperature:</p><p className="p-1 border-l border-black">{data.facilityTemperature}</p></div>
                       <div className="grid grid-cols-[120px,1fr] border-b border-black"><p className="p-1 font-semibold">Type of Failure:</p><p className="p-1 border-l border-black">{data.typeOfFailure}</p></div>
                       <div className="grid grid-cols-[120px,1fr] border-b border-black"><p className="p-1 font-semibold">Paver Thickness:</p><p className="p-1 border-l border-black">{data.paverThickness}</p></div>
                       <div className="grid grid-cols-[120px,1fr]"><p className="p-1 font-semibold">Area used for strength evaluation:</p><p className="p-1 border-l border-black">{data.areaUsedForStrength}</p></div>
                    </div>
                </div>
                <div className="grid grid-cols-[auto,1fr] border-t-2 border-black"><p className="p-1 font-semibold">Compressive Testing Machine ID:</p><p className="p-1">{data.compressiveTestingMachineId}</p></div>
            </div>

            {/* Results Table */}
            <table className="w-full border-collapse border-2 border-black text-[8.5px] text-center mb-2">
                <thead className="bg-gray-200">
                    <tr className="[&>th]:border-2 [&>th]:border-black [&>th]:p-1 [&>th]:font-bold">
                        <th>DATE OF<br />CASTING</th>
                        <th>DATE OF<br />TESTING</th>
                        <th>SAMPLE<br />NUMBER</th>
                        <th>MEASURED<br/>THICKNESS<br/>H (mm)</th>
                        <th>CORRECTION<br/>FACTOR</th>
                        <th>COMPUTED<br/>PLAN AREA<br/>(mm²)</th>
                        <th>WEIGHT OF<br />SAMPLE<br/>(kg)</th>
                        <th>DENSITY OF<br />SAMPLE<br/>(kg/m³)</th>
                        <th>FAILURE<br />LOAD<br/>(kN)</th>
                        <th>CORRECTED<br />FAILURE<br />LOAD (kN)</th>
                        <th>COMPRESSIVE<br />STRENGTH<br />(N/mm²)</th>
                    </tr>
                </thead>
                <tbody>
                    {data.testResults.map((result, index) => (
                        <tr key={index} className="[&>td]:border-2 [&>td]:border-black [&>td]:p-0.5">
                            {index === 0 ? <td rowSpan={data.testResults.length}>{data.dateOfCasting}</td> : null}
                            {index === 0 ? <td rowSpan={data.testResults.length}>{data.dateOfTesting}</td> : null}
                            <td>{result.sampleNumber}</td>
                            <td>{result.measuredThickness.toFixed(1)}</td>
                            <td>{result.correctionFactor.toFixed(2)}</td>
                            <td>{result.computedPlanArea.toFixed(0)}</td>
                            <td>{result.weightOfSample.toFixed(2)}</td>
                            <td>{result.densityOfSample.toFixed(0)}</td>
                            <td>{result.failureLoad.toFixed(1)}</td>
                            <td>{result.correctedFailureLoad.toFixed(1)}</td>
                            <td>{result.compressiveStrength.toFixed(0)}</td>
                        </tr>
                    ))}
                </tbody>
                 {data.averageCompressiveStrength ? (
                    <tfoot className="font-bold bg-gray-200">
                        <tr className="[&>td]:border-2 [&>td]:border-black [&>td]:p-1">
                            <td colSpan={10} className="text-right">Average Compressive Strength:</td>
                            <td>{data.averageCompressiveStrength.toFixed(0)}</td>
                        </tr>
                    </tfoot>
                 ) : null}
            </table>

            {/* Remarks and Signatories */}
            <div className="space-y-2 text-[9px] leading-tight">
                <div>
                    <p className="font-semibold">15. Remarks:</p>
                    <ol className="list-[decimal] list-outside pl-4">
                        {data.remarks.map((remark, index) => <li key={index} className="pl-1">{remark}</li>)}
                    </ol>
                </div>

                <div className="text-center font-semibold pt-1">
                    ................................................END OF REPORT................................................
                </div>
                
                 <div className="flex justify-between items-end pt-8">
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

    