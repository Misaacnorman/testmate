
"use client";

import * as React from "react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Printer, Loader2 } from "lucide-react";
import { type WaterAbsorptionRegisterEntry, type Receipt, User } from "@/lib/types";
import { useAuth } from "@/context/auth-context";
import { doc, getDoc, query, where, getDocs, collection, limit } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { WaterAbsorptionCertificateTemplate } from "./WaterAbsorptionCertificateTemplate";
import { WaterAbsorptionCertificateData, WaterAbsorptionTestResult, calculateAverageWaterAbsorption, getSampleCountText } from "./WaterAbsorptionCertificateData";
// Removed PDF service imports - using simple window.print() with CSS

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

interface WaterAbsorptionCertificateProps {
    certificateData: WaterAbsorptionRegisterEntry;
    onBack: () => void;
}


export function WaterAbsorptionCertificate({ certificateData, onBack }: WaterAbsorptionCertificateProps) {
    const { laboratory, user } = useAuth();
    const [receipt, setReceipt] = React.useState<Receipt | null>(null);
    const [mappedData, setMappedData] = React.useState<WaterAbsorptionCertificateData | null>(null);
    const [loading, setLoading] = React.useState(true);
    const [approvers, setApprovers] = React.useState<{engineer?: User, manager?: User}>({});
    // Removed PDF generation state - using simple window.print()

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
            const testResults: WaterAbsorptionTestResult[] = (certificateData.results || []).map(r => {
                const length = r.length ?? 0;
                const width = r.width ?? 0;
                const area = length * width;
                const massDifference = (r.weightAfterSoaking ?? 0) - (r.ovenDriedWeight ?? 0);
                const waterAbsorption = (r.ovenDriedWeight ?? 0) > 0 ? (massDifference / (r.ovenDriedWeight ?? 1)) * 100 : 0;
                
                return {
                    sampleNumber: r.sampleId,
                    length: length,
                    width: width,
                    height: r.height ?? 0,
                    crossSectionalArea: area,
                    initialOvenWeight: r.ovenDriedWeight ?? 0,
                    weightAfterSoaking: r.weightAfterSoaking ?? 0,
                    massDifference: massDifference,
                    waterAbsorptionPercentage: waterAbsorption,
                };
            });

            const avgWaterAbsorption = calculateAverageWaterAbsorption(testResults);

            const data: WaterAbsorptionCertificateData = {
                certificateNo: certificateData.certificateNumber || 'N/A',
                dateOfIssue: formatDateFromFirestore(certificateData.dateOfIssue || new Date()),
                version: '01',
                clientName: certificateData.client,
                clientAddress: fetchedReceipt?.formData.clientAddress || 'N/A',
                clientContact: fetchedReceipt?.formData.clientContact || 'N/A',
                projectTitle: certificateData.project,
                sampleDescription: `${getSampleCountText(certificateData.sampleIds.length)} ${certificateData.sampleType.toLowerCase()} blocks were delivered to the laboratory for testing`,
                conditionAtReceipt: 'Satisfactory',
                dateOfReceipt: formatDateFromFirestore(certificateData.dateReceived),
                samplingReport: 'N/A',
                testedBy: certificateData.technician || 'N/A',
                natureOfTest: 'Water Absorption of test specimens',
                testMethods: 'IS 2185 - Part 1: 2005 Concrete Masonry Units - Method for the determination of water absorption',
                testLocation: laboratory?.address || 'N/A',
                attachments: 'None',

                sampleType: certificateData.sampleType,
                methodOfCompaction: 'Not Specified', // Hardcoded as per image
                testingAge: `${certificateData.age || '>28'} Days`,
                areaOfUse: certificateData.areaOfUse,
                curingCondition: 'Tested as Received',
                facilityTemperature: `${certificateData.temperature ?? '24'} Degrees Celsius`,
                dateOfCasting: formatDateFromFirestore(certificateData.castingDate),
                dateOfTesting: formatDateFromFirestore(certificateData.testingDate),
                
                remarks: [
                    "This report relates only to the samples tested.",
                    "All information about the specimen furnished by the client/ client representative.",
                    "The test was carried out according to IS 2185 (Part 1): 2005 Concrete Masonry Units - Method for the determination of water absorption.",
                    "All tested samples will be discarded immediately after the test.",
                ],
                checkedBy: { name: certificateData.approvedByEngineer?.name || certificateData.technician || 'N/A', signatureURL: engineer?.signatureURL },
                approvedBy: { name: certificateData.approvedByManager?.name || "N/A", signatureURL: manager?.signatureURL },
                clientRepresentative: '',
                testResults: testResults,
                averageWaterAbsorption: avgWaterAbsorption ?? undefined,
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
                    <h2 className="text-lg font-semibold">Water Absorption Certificate</h2>
                    <Button onClick={handlePrint}>
                        <Printer className="mr-2 h-4 w-4" />
                        Print / Save PDF
                    </Button>
                </div>
            </div>
            
            <main className="container mx-auto max-w-4xl p-4 sm:p-6 lg:p-8 print:m-0 print:p-0">
              <div className="print-content p-8 bg-card rounded-lg shadow-sm border print:border-none print:shadow-none">
                <div className="certificate-container">
                  <WaterAbsorptionCertificateTemplate data={mappedData} />
                </div>
              </div>
            </main>
            
            {/* Removed PDFPreviewModal - using simple window.print() */}
        </>
    );
}