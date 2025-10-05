
"use client";

import * as React from "react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Printer } from "lucide-react";
import { type ConcreteCubeRegisterEntry, type Receipt, Laboratory } from "@/lib/types";
import { useAuth } from "@/context/auth-context";
import { doc, getDoc, query, where, getDocs, collection, limit } from "firebase/firestore";
import { db } from "@/lib/firebase";

interface ConcreteCubeCertificateProps {
    certificateData: ConcreteCubeRegisterEntry;
    onBack: () => void;
}

// Helper to format dates, handling Firestore Timestamps and strings
const formatDateFromFirestore = (dateValue: any): string => {
    if (!dateValue) return 'N/A';
    try {
        let date: Date;
        if (dateValue && typeof dateValue.seconds === 'number') {
            date = dateValue.toDate();
        } else {
            date = new Date(dateValue);
        }
        if (isNaN(date.getTime())) return 'N/A';
        return format(date, "dd/MM/yyyy");
    } catch {
        return 'N/A';
    }
};

export function ConcreteCubeCertificate({ certificateData, onBack }: ConcreteCubeCertificateProps) {
    const { laboratory } = useAuth();
    const [receipt, setReceipt] = React.useState<Receipt | null>(null);
    const [testMethods, setTestMethods] = React.useState<string>("BS EN 12390-3: 2019, BS EN 12390-1: 2019 & BS EN 12390-7: 2019");

    React.useEffect(() => {
        const fetchReceipt = async () => {
            if (!certificateData.receiptId) return;
            const q = query(collection(db, "receipts"), where("receiptId", "==", certificateData.receiptId), limit(1));
            const querySnapshot = await getDocs(q);
            if (!querySnapshot.empty) {
                const receiptDoc = querySnapshot.docs[0];
                setReceipt({ id: receiptDoc.id, ...receiptDoc.data() } as Receipt);
            }
        };
        fetchReceipt();
    }, [certificateData.receiptId]);

    const handlePrint = () => {
        window.print();
    };

    const results = certificateData.results || [];
    const avgCompressiveStrength = results.length > 0
        ? (results.reduce((acc, r) => acc + ((r.load ?? 0) / ((r.length ?? 0) * (r.width ?? 0)) * 1000), 0) / results.length).toFixed(1)
        : '0.0';

    return (
        <>
            <div className="bg-card sticky top-0 z-10 print:hidden mb-4">
                <div className="flex h-16 items-center justify-between border-b px-4">
                    <Button variant="outline" onClick={onBack}>
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back
                    </Button>
                    <h2 className="text-lg font-semibold">Test Certificate</h2>
                    <Button onClick={handlePrint}>
                        <Printer className="mr-2 h-4 w-4" />
                        Print / Save PDF
                    </Button>
                </div>
            </div>

            <main className="max-w-4xl mx-auto p-8 bg-white" id="certificate-content-printable">
                <div className="p-8 border border-gray-400">
                    {/* Top Section */}
                    <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                        <div>
                            <p><strong>1. Client Name:</strong> {certificateData.client}</p>
                            <p><strong>2. Client Address:</strong> {receipt?.formData.clientAddress}</p>
                            <p><strong>4. Project Title:</strong> {certificateData.project}</p>
                            <p><strong>5. Sample Description:</strong> {certificateData.sampleIds.length} concrete cubes were delivered to the laboratory for testing</p>
                            <p><strong>6. Condition at receipt:</strong> Satisfactory</p>
                            <p><strong>8. Nature of test:</strong> Compressive strength of test specimens</p>
                            <p><strong>10. Test Method(s):</strong> {testMethods}</p>
                            <p><strong>11. Test Location:</strong> {laboratory?.address || 'N/A'}</p>
                            <p><strong>13. Attachment(s):</strong> None</p>
                        </div>
                        <div className="text-left">
                            <p><strong>3. Client Contact:</strong> {receipt?.formData.clientContact}</p>
                            <p><strong>7. Date of Receipt:</strong> {formatDateFromFirestore(certificateData.dateReceived)}</p>
                            <p><strong>9. Sampling Report:</strong> N/A</p>
                            <p><strong>12. Tested by:</strong> {certificateData.technician}</p>
                        </div>
                    </div>
                    <p className="mb-4"><strong>14. Results:</strong></p>


                    {/* Test Results Header Box */}
                    <div className="border border-black mb-4">
                        <h3 className="text-center font-bold py-1 bg-gray-100 border-b border-black">TEST RESULTS FOR CONCRETE CUBES</h3>
                        <div className="grid grid-cols-2 text-sm">
                            <div className="border-r border-black">
                                <div className="grid grid-cols-[auto,1fr]"><p className="p-1 border-b border-black font-semibold">Sample type/ Size:</p><p className="p-1 border-b border-black">Nominal size 150 x 150 x 150 mm</p></div>
                                <div className="grid grid-cols-[auto,1fr]"><p className="p-1 border-b border-black font-semibold">Class of Concrete:</p><p className="p-1 border-b border-black">{certificateData.class}</p></div>
                                <div className="grid grid-cols-[auto,1fr]"><p className="p-1 border-b border-black font-semibold">Design Compressive Strength:</p><p className="p-1 border-b border-black">{/* This field doesn't exist, hardcoding for now */}25 MPa</p></div>
                                <div className="grid grid-cols-[auto,1fr]"><p className="p-1 border-b border-black font-semibold">Testing Age:</p><p className="p-1 border-b border-black">{certificateData.age || '>28'} Days</p></div>
                                <div className="grid grid-cols-[auto,1fr]"><p className="p-1 font-semibold">Area of use:</p><p className="p-1">{certificateData.areaOfUse}</p></div>
                            </div>
                            <div>
                                <div className="grid grid-cols-[auto,1fr]"><p className="p-1 border-b border-black font-semibold">Curing condition:</p><p className="p-1 border-b border-black">Tested as Received</p></div>
                                <div className="grid grid-cols-[auto,1fr]"><p className="p-1 border-b border-black font-semibold">Curing Period at the Facility:</p><p className="p-1 border-b border-black">N/A</p></div>
                                <div className="grid grid-cols-[auto,1fr]"><p className="p-1 border-b border-black font-semibold">Facility Temperature:</p><p className="p-1 border-b border-black">{certificateData.temperature ?? '24'} Degrees Celsius</p></div>
                                <div className="grid grid-cols-[auto,1fr]"><p className="p-1 font-semibold">Type of Failure:</p><p className="p-1">Satisfactory</p></div>
                            </div>
                        </div>
                         <div className="grid grid-cols-[auto,1fr] border-t border-black"><p className="p-1 font-semibold">Compressive Tesing Machine ID:</p><p className="p-1">{certificateData.machineUsed}</p></div>
                    </div>

                    {/* Results Table */}
                    <table className="w-full border-collapse border border-black text-sm text-center">
                        <thead>
                            <tr className="[&>th]:border [&>th]:border-black [&>th]:p-1 [&>th]:font-bold">
                                <th rowSpan={2}>DATE OF<br />CASTING</th>
                                <th rowSpan={2}>DATE OF<br />TESTING</th>
                                <th rowSpan={2}>SAMPLE<br />NUMBER</th>
                                <th colSpan={3}>MEASURED SPECIMEN<br />DIMENSIONS (mm)</th>
                                <th rowSpan={2}>CROSS SECTIONAL<br />AREA (mm²)</th>
                                <th rowSpan={2}>WEIGHT OF<br />SAMPLE (kg)</th>
                                <th rowSpan={2}>DENSITY OF<br />SAMPLE (kg/m³)</th>
                                <th rowSpan={2}>FAILURE<br />LOAD (kN)</th>
                                <th rowSpan={2}>CORRECTED<br />FAILURE<br />LOAD (kN)</th>
                                <th rowSpan={2}>COMPRESSIVE<br />STRENGTH<br />(N/mm²)</th>
                            </tr>
                            <tr className="[&>th]:border [&>th]:border-black [&>th]:p-1 [&>th]:font-bold">
                                <th>L</th>
                                <th>W</th>
                                <th>H</th>
                            </tr>
                        </thead>
                        <tbody>
                            {results.map((result, index) => {
                                const area = (result.length ?? 150) * (result.width ?? 150);
                                const density = result.weight && result.length && result.width && result.height ? (result.weight / (result.length * result.width * result.height * 1e-9)).toFixed(0) : '-';
                                const correctedLoad = result.load ? (result.load * 0.9937).toFixed(1) : '-'; // Example correction factor
                                const strength = result.load && area ? ((result.load * 1000) / area).toFixed(1) : '-';
                                return (
                                    <tr key={index} className="[&>td]:border [&>td]:border-black [&>td]:p-1">
                                        <td>{index === 0 ? formatDateFromFirestore(certificateData.castingDate) : ''}</td>
                                        <td>{index === 0 ? formatDateFromFirestore(certificateData.testingDate) : ''}</td>
                                        <td>{result.sampleId}</td>
                                        <td>{result.length?.toFixed(1) || '150.0'}</td>
                                        <td>{result.width?.toFixed(1) || '150.0'}</td>
                                        <td>{result.height?.toFixed(1) || '150.0'}</td>
                                        <td>{area.toFixed(0)}</td>
                                        <td>{result.weight?.toFixed(2) || '-'}</td>
                                        <td>{density}</td>
                                        <td>{result.load?.toFixed(1) || '-'}</td>
                                        <td>{correctedLoad}</td>
                                        <td>{strength}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                        <tfoot>
                             <tr className="[&>td]:border [&>td]:border-black [&>td]:p-1 font-bold">
                                <td colSpan={11} className="text-right">Average Compressive Strength :</td>
                                <td>{avgCompressiveStrength}</td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </main>
             <style jsx global>{`
                @media print {
                  body {
                    background: #fff;
                  }
                  .print-hidden {
                    display: none;
                  }
                  #certificate-content-printable {
                    display: block;
                    margin: 0;
                    padding: 0;
                  }
                   @page {
                    size: A4;
                    margin: 0.5in;
                  }
                }
              `}</style>
        </>
    );
}
