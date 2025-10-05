
"use client";

import * as React from "react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Printer, Loader2 } from "lucide-react";
import { type BricksBlocksRegisterEntry, type Receipt, User } from "@/lib/types";
import { useAuth } from "@/context/auth-context";
import { doc, getDoc, query, where, getDocs, collection, limit } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { SolidBlockCertificateTemplate } from "./SolidBlockCertificateTemplate";
import { SolidBlockCertificateData, SolidBlockTestResult, calculateAverageCompressiveStrength, exceedsRepeatabilityCondition, getSampleCountText } from "./SolidBlockCertificateData";

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

interface BrickCertificateProps {
    certificateData: BricksBlocksRegisterEntry;
    onBack: () => void;
}


export function BrickCertificate({ certificateData, onBack }: BrickCertificateProps) {
    const { laboratory, user } = useAuth();
    const [receipt, setReceipt] = React.useState<Receipt | null>(null);
    const [mappedData, setMappedData] = React.useState<SolidBlockCertificateData | null>(null);
    const [loading, setLoading] = React.useState(true);
    const [approvers, setApprovers] = React.useState<{engineer?: User, manager?: User}>({});

    React.useEffect(() => {
        const fetchAndMapData = async () => {
            setLoading(true);
            if (!certificateData.receiptId) {
                setLoading(false);
                return;
            };

            let fetchedReceipt: Receipt | null = null;
            let engineer: User | undefined = undefined;
            let manager: User | undefined = undefined;
            try {
                const promises: Promise<any>[] = [];
                const q = query(collection(db, "receipts"), where("receiptId", "==", certificateData.receiptId), limit(1));
                promises.push(getDocs(q));

                 if (certificateData.approvedByEngineer?.uid) {
                    promises.push(getDoc(doc(db, "users", certificateData.approvedByEngineer.uid)));
                } else {
                    promises.push(Promise.resolve(null));
                }

                if (certificateData.approvedByManager?.uid) {
                    promises.push(getDoc(doc(db, "users", certificateData.approvedByManager.uid)));
                } else {
                    promises.push(Promise.resolve(null));
                }
                
                const [querySnapshot, engineerDoc, managerDoc] = await Promise.all(promises);

                if (!querySnapshot.empty) {
                    const receiptDoc = querySnapshot.docs[0];
                    fetchedReceipt = { id: receiptDoc.id, ...receiptDoc.data() } as Receipt;
                    setReceipt(fetchedReceipt);
                }
                
                if (engineerDoc?.exists()) {
                    engineer = engineerDoc.data() as User;
                }
                if (managerDoc?.exists()) {
                    manager = managerDoc.data() as User;
                }
                setApprovers({engineer, manager});

            } catch (error) {
                console.error("Error fetching receipt:", error);
            }
            
            // Map data
            const testResults: SolidBlockTestResult[] = (certificateData.results || []).map(r => {
                const length = r.length ?? 0;
                const width = r.width ?? 0;
                const area = length * width;
                const strength = r.load && area > 0 ? ((r.load * 1000) / area) : 0;
                const density = r.weight && r.length && r.width && r.height ? (r.weight / ((r.length / 1000) * (r.width / 1000) * (r.height / 1000))) : 0;
                
                return {
                    sampleNumber: r.sampleId,
                    length: length,
                    width: width,
                    height: r.height ?? 0,
                    weight: r.weight ?? 0,
                    failureLoad: r.load ?? 0,
                    correctedFailureLoad: (r.load ?? 0) * 0.9937, // Example correction factor
                    density: density,
                    crossSectionalArea: area,
                    compressiveStrength: strength,
                };
            });

            const avgStrength = calculateAverageCompressiveStrength(testResults);
            const exceedsRepeatability = exceedsRepeatabilityCondition(testResults);

            const data: SolidBlockCertificateData = {
                certificateNo: certificateData.certificateNumber || 'N/A',
                dateOfIssue: formatDateFromFirestore(certificateData.dateOfIssue || new Date()),
                version: '01',
                clientName: certificateData.client,
                clientAddress: fetchedReceipt?.formData.clientAddress || 'N/A',
                clientContact: fetchedReceipt?.formData.clientContact || 'N/A',
                projectTitle: certificateData.project,
                sampleDescription: `${getSampleCountText(certificateData.sampleIds.length)} brick(s) were delivered to the laboratory for testing`,
                conditionAtReceipt: 'Satisfactory',
                dateOfReceipt: formatDateFromFirestore(certificateData.dateReceived),
                samplingReport: 'N/A',
                testedBy: certificateData.technician || 'N/A',
                natureOfTest: 'Compressive strength of test specimens',
                testMethods: 'BS EN 12390-3: 2019, BS EN 12390-1: 2019 & BS EN 12390-7: 2019',
                testLocation: laboratory?.address || 'N/A',
                attachments: 'None',
                
                sampleType: certificateData.brickType || 'Not Specified',
                methodOfCompaction: certificateData.modeOfCompaction || 'Not Specified',
                testingAge: `${certificateData.age || '>28'} Days`,
                areaOfUse: certificateData.areaOfUse,
                curingCondition: 'Tested as Received',
                facilityTemperature: `${certificateData.temperature ?? '24'} Degrees Celsius`,
                compressiveTestingMachineId: certificateData.machineUsed,
                typeOfFailure: (certificateData.results && certificateData.results.length > 0 && certificateData.results[0].modeOfFailure) ? certificateData.results[0].modeOfFailure : 'Satisfactory',
                
                dateOfCasting: formatDateFromFirestore(certificateData.castingDate),
                dateOfTesting: formatDateFromFirestore(certificateData.testingDate),
                
                remarks: [
                    "This report relates only to the samples tested.",
                    "All information about the specimen furnished by the client/ client representative.",
                    "The test was carried out according to BS EN 12390:2019, Testing of hardened concrete - Part 3: Compressive strength of test specimens",
                    "All tested samples will be discarded immediately after the test.",
                    "The average compressive strength value is not provided on this certificate because of the variability in the results which exceeds the repeatability condition (r = 9%)"
                ],
                checkedBy: { name: certificateData.approvedByEngineer?.name || certificateData.technician || 'N/A', signatureURL: engineer?.signatureURL },
                approvedBy: { name: certificateData.approvedByManager?.name || "N/A", signatureURL: manager?.signatureURL },
                clientRepresentative: '',
                testResults: testResults,
                averageCompressiveStrength: exceedsRepeatability ? undefined : avgStrength ?? undefined,
                status: certificateData.status,
            };
            setMappedData(data);
            setLoading(false);
        };
        
        fetchAndMapData();
    }, [certificateData, laboratory, user]);

    const handlePrint = () => {
        window.print();
    };

    if (loading || !mappedData) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Loader2 className="h-8 w-8 animate-spin" />
                <p className="ml-4">Loading certificate data...</p>
            </div>
        );
    }

    return (
        <>
            <div className="bg-card sticky top-0 z-10 print:hidden mb-4">
                <div className="flex h-16 items-center justify-between border-b px-4">
                    <Button variant="outline" onClick={onBack}>
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back
                    </Button>
                    <h2 className="text-lg font-semibold">Brick Certificate</h2>
                    <Button onClick={handlePrint}>
                        <Printer className="mr-2 h-4 w-4" />
                        Print / Save PDF
                    </Button>
                </div>
            </div>
            
            <div className="print-content bg-gray-100 flex justify-center p-4 print:p-0 print:bg-white">
              <div className="w-[210mm] min-h-[297mm] bg-white shadow-lg print:shadow-none">
                <SolidBlockCertificateTemplate data={mappedData} />
              </div>
            </div>
            
            <style jsx global>{`
                @media print {
                  body > *:not(.print-content) {
                    display: none !important;
                  }
                  .print-content {
                    position: absolute !important;
                    top: 0 !important;
                    left: 0 !important;
                    right: 0 !important;
                    padding: 0 !important;
                    margin: 0 !important;
                    background-color: white !important;
                  }
                   @page {
                    size: A4;
                    margin: 0;
                  }
                }
              `}</style>
        </>
    );
}

    