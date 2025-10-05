
"use client";

import * as React from "react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Printer, Loader2 } from "lucide-react";
import { type ConcreteCubeRegisterEntry, type Receipt, Laboratory, User, CorrectionFactorMachine } from "@/lib/types";
import { useAuth } from "@/context/auth-context";
import { doc, getDoc, query, where, getDocs, collection, limit } from "firebase/firestore";
import { db } from "@/lib/firebase";
import CertificateTemplate from "./CertificateTemplate";
import { CertificateData, TestResult, calculateAverageCompressiveStrength, exceedsRepeatabilityCondition } from "./CertificateData";

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

const getSampleCountText = (count: number) => {
    const numbers = ['Zero', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve'];
    const countText = numbers[count] || count;
    return `${countText} (${count < 10 ? '0' : ''}${count})`;
}

export function ConcreteCubeCertificate({ certificateData, onBack }: ConcreteCubeCertificateProps) {
    const { laboratory, user, laboratoryId } = useAuth();
    const [receipt, setReceipt] = React.useState<Receipt | null>(null);
    const [machine, setMachine] = React.useState<CorrectionFactorMachine | null>(null);
    const [approvers, setApprovers] = React.useState<{engineer?: User, manager?: User}>({});
    const [mappedData, setMappedData] = React.useState<CertificateData | null>(null);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        const fetchAndMapData = async () => {
            setLoading(true);
            if (!certificateData.receiptId || !laboratoryId) {
                setLoading(false);
                return;
            };

            // Fetch Receipt, Machine, and Approver User data in parallel
            let fetchedReceipt: Receipt | null = null;
            let fetchedMachine: CorrectionFactorMachine | null = null;
            let engineer: User | undefined = undefined;
            let manager: User | undefined = undefined;

            try {
                const promises: Promise<any>[] = [];
                
                // Receipt Query
                const receiptQuery = query(collection(db, "receipts"), where("receiptId", "==", certificateData.receiptId), limit(1));
                promises.push(getDocs(receiptQuery));

                // Machine Doc
                if (certificateData.machineUsed) {
                    promises.push(getDoc(doc(db, "laboratories", laboratoryId, "machines", certificateData.machineUsed)));
                } else {
                    promises.push(Promise.resolve(null));
                }
                
                // Engineer Doc
                if (certificateData.approvedByEngineer?.uid) {
                    promises.push(getDoc(doc(db, "users", certificateData.approvedByEngineer.uid)));
                } else {
                    promises.push(Promise.resolve(null));
                }

                // Manager Doc
                if (certificateData.approvedByManager?.uid) {
                    promises.push(getDoc(doc(db, "users", certificateData.approvedByManager.uid)));
                } else {
                    promises.push(Promise.resolve(null));
                }

                const [receiptSnapshot, machineDoc, engineerDoc, managerDoc] = await Promise.all(promises);

                if (!receiptSnapshot.empty) {
                    const receiptDoc = receiptSnapshot.docs[0];
                    fetchedReceipt = { id: receiptDoc.id, ...receiptDoc.data() } as Receipt;
                    setReceipt(fetchedReceipt);
                }
                
                if (machineDoc?.exists()) {
                    fetchedMachine = { id: machineDoc.id, ...machineDoc.data() } as CorrectionFactorMachine;
                    setMachine(fetchedMachine);
                }
                
                if (engineerDoc?.exists()) {
                    engineer = engineerDoc.data() as User;
                }
                if (managerDoc?.exists()) {
                    manager = managerDoc.data() as User;
                }
                setApprovers({engineer, manager});

            } catch (error) {
                console.error("Error fetching dependencies:", error);
            }
            
            // Map data
            const testResults: TestResult[] = (certificateData.results || []).map(r => {
                const length = r.length ?? 150;
                const width = r.width ?? 150;
                const height = r.height ?? 150;
                const area = length * width;
                const strength = r.correctedFailureLoad && area > 0 ? (r.correctedFailureLoad * 1000) / area : 0;
                const density = r.weight && area > 0 && height > 0 ? (r.weight / ((length / 1000) * (width / 1000) * (height / 1000))) : 0;
                
                return {
                    sampleNumber: r.sampleId,
                    length: length,
                    width: width,
                    height: height,
                    weight: r.weight ?? 0,
                    failureLoad: r.load ?? 0,
                    correctedFailureLoad: r.correctedFailureLoad ?? 0,
                    density: density,
                    crossSectionalArea: area,
                    compressiveStrength: strength,
                };
            });

            const avgStrength = calculateAverageCompressiveStrength(testResults);
            const exceedsRepeatability = exceedsRepeatabilityCondition(testResults);

            const data: CertificateData = {
                certificateNo: certificateData.certificateNumber || 'N/A',
                dateOfIssue: formatDateFromFirestore(certificateData.dateOfIssue || new Date()),
                status: certificateData.status,
                version: '01',
                clientName: certificateData.client,
                clientAddress: fetchedReceipt?.formData.clientAddress || 'N/A',
                clientContact: fetchedReceipt?.formData.clientContact || 'N/A',
                projectTitle: certificateData.project,
                sampleDescription: `${getSampleCountText(certificateData.sampleIds.length)} concrete cubes were delivered to the laboratory for testing`,
                conditionAtReceipt: 'Satisfactory',
                dateOfReceipt: formatDateFromFirestore(certificateData.dateReceived),
                samplingReport: 'N/A',
                testedBy: certificateData.technician || 'N/A',
                sampleTypeSize: 'Nominal size 150 x 150 x 150 mm',
                curingCondition: 'Tested as Received',
                classOfConcrete: certificateData.class,
                designCompressiveStrength: '25 MPa', // This seems hardcoded in the example
                testingAge: `${certificateData.age || '>28'} Days`,
                typeOfFailure: (certificateData.results && certificateData.results.length > 0 && certificateData.results[0].modeOfFailure) ? certificateData.results[0].modeOfFailure : 'Satisfactory',
                areaOfUse: certificateData.areaOfUse,
                testMethod: 'BS EN 12390-3: 2019, BS EN 12390-1: 2019 & BS EN 12390-7: 2019',
                testLocation: laboratory?.address || 'N/A',
                compressiveTestingMachineId: fetchedMachine?.name || certificateData.machineUsed || 'N/A',
                dateOfCasting: formatDateFromFirestore(certificateData.castingDate),
                dateOfTesting: formatDateFromFirestore(certificateData.testingDate),
                curingPeriodAtFacility: 'N/A',
                facilityTemperature: `${certificateData.temperature ?? '24'} Degrees Celsius`,
                clientRepresentative: '',
                remarks: [
                    "This report relates only to the samples tested.",
                    "All information about the specimen furnished by the client/ client representative.",
                    "The test was carried out according to BS EN 12390:2019, Testing of hardened concrete- Part 3: Compressive strength of test specimens",
                    "All tested samples will be discarded immediately after the test.",
                    "The test method used requires testing of more than one specimen because the reliability of result from one sopecimen may not be dependable."
                ],
                checkedBy: certificateData.technician || 'N/A',
                approvedByEngineer: { name: certificateData.approvedByEngineer?.name || "N/A", signatureURL: engineer?.signatureURL },
                approvedByManager: { name: certificateData.approvedByManager?.name || "N/A", signatureURL: manager?.signatureURL },
                testResults: testResults,
                averageCompressiveStrength: exceedsRepeatability ? undefined : avgStrength ?? undefined
            };
            setMappedData(data);
            setLoading(false);
        };
        
        fetchAndMapData();
    }, [certificateData, laboratory, laboratoryId, user]);

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
                    <h2 className="text-lg font-semibold">Test Certificate Preview</h2>
                    <Button onClick={handlePrint}>
                        <Printer className="mr-2 h-4 w-4" />
                        Print / Save PDF
                    </Button>
                </div>
            </div>
            
            <div className="bg-gray-100 flex justify-center p-4 print:p-0 print:bg-white print:m-0">
              <div className="w-[210mm] min-h-[297mm] bg-white shadow-lg print:shadow-none">
                <CertificateTemplate data={mappedData} />
              </div>
            </div>
        </>
    );
}

    