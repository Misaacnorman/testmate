
"use client";

import * as React from "react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Printer, Loader2 } from "lucide-react";
import { type PaverRegisterEntry, type Receipt, User, CorrectionFactorMachine } from "@/lib/types";
import { useAuth } from "@/context/auth-context";
import { doc, getDoc, query, where, getDocs, collection, limit } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { PaverCertificateData, PaverTestResult, calculateAverageCompressiveStrength, getCorrectionFactor, getSampleCountText } from "./PaverCertificateData";
import { mapPaverCertificateData } from "@/lib/paver-certificate-data-mapper";
import { PaverCertificatePreview } from "@/components/paver-certificate-preview";
// Removed PDF service imports - using HTML template approach

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

interface PaverCertificateProps {
    certificateData: PaverRegisterEntry;
    onBack: () => void;
}

export function PaverCertificate({ certificateData, onBack }: PaverCertificateProps) {
    const { laboratory, user, laboratoryId } = useAuth();
    const [receipt, setReceipt] = React.useState<Receipt | null>(null);
    const [machine, setMachine] = React.useState<CorrectionFactorMachine | null>(null);
    const [approvers, setApprovers] = React.useState<{engineer?: User, manager?: User}>({});
    const [mappedData, setMappedData] = React.useState<PaverCertificateData | null>(null);
    const [loading, setLoading] = React.useState(true);
    
    // PDF generation state
    const [isGeneratingPDF, setIsGeneratingPDF] = React.useState(false);

    React.useEffect(() => {
        const fetchAndMapData = async () => {
            setLoading(true);
            if (!certificateData.receiptId || !laboratoryId) {
                setLoading(false);
                return;
            };

            let fetchedReceipt: Receipt | null = null;
            let fetchedMachine: CorrectionFactorMachine | null = null;
            let engineer: User | undefined = undefined;
            let manager: User | undefined = undefined;

            try {
                const promises: Promise<any>[] = [];
                const receiptQuery = query(collection(db, "receipts"), where("receiptId", "==", certificateData.receiptId), limit(1));
                promises.push(getDocs(receiptQuery));

                if (certificateData.machineUsed) {
                    promises.push(getDoc(doc(db, "laboratories", laboratoryId, "machines", certificateData.machineUsed)));
                } else {
                    promises.push(Promise.resolve(null));
                }

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
            
            const paverThickness = certificateData.paverThickness || `0 mm`;
            
            console.log('DEBUG: certificateData.paverThickness =', certificateData.paverThickness);
            console.log('DEBUG: paverThickness after fallback =', paverThickness);
            
            const testResults: PaverTestResult[] = (certificateData.results || []).map(r => {
                const computedPlanArea = r.calculatedArea ?? (certificateData.paversPerSquareMetre ? 1000000 / certificateData.paversPerSquareMetre : 0);
                const correctedFailureLoad = r.correctedFailureLoad ?? 0;
                const compressiveStrength = computedPlanArea > 0 ? correctedFailureLoad / computedPlanArea * 1000 : 0;
                
                // Extract thickness number from string like "80 mm Plain" -> 80
                const thicknessMatch = paverThickness.match(/(\d+)/);
                const measuredThickness = thicknessMatch ? parseInt(thicknessMatch[1], 10) : 0;
                
                // Use the extracted thickness for density calculation
                const density = r.weight && computedPlanArea && measuredThickness > 0 ? (r.weight / (computedPlanArea * measuredThickness / 1000)) : 0;
                
                console.log('Paver thickness extraction:', {
                    paverThickness,
                    thicknessMatch,
                    measuredThickness
                });

                return {
                    sampleNumber: r.sampleId,
                    measuredThickness: measuredThickness,
                    correctionFactor: getCorrectionFactor(paverThickness),
                    computedPlanArea,
                    weightOfSample: r.weight ?? 0,
                    densityOfSample: density,
                    failureLoad: r.load ?? 0,
                    correctedFailureLoad,
                    compressiveStrength,
                };
            });

            const avgStrength = calculateAverageCompressiveStrength(testResults);

            const data: PaverCertificateData = {
                certificateNo: certificateData.certificateNumber || 'N/A',
                dateOfIssue: formatDateFromFirestore(certificateData.dateOfIssue || new Date()),
                version: '01',
                clientName: certificateData.client,
                clientAddress: fetchedReceipt?.formData.clientAddress || 'N/A',
                clientContact: fetchedReceipt?.formData.clientContact || 'N/A',
                projectTitle: certificateData.project,
                sampleDescription: `${getSampleCountText(certificateData.sampleIds.length)} paving blocks were delivered to the laboratory for testing`,
                conditionAtReceipt: 'Satisfactory',
                dateOfReceipt: formatDateFromFirestore(certificateData.dateReceived),
                natureOfTest: 'Compressive strength of test specimens',
                samplingReport: 'N/A',
                testMethods: 'BS 6717: Part 1: 1993',
                testLocation: laboratory?.address || 'N/A',
                testedBy: certificateData.technician || 'N/A',
                attachments: 'None',
                paverType: certificateData.paverType,
                methodOfCompaction: 'Not Specified',
                testingAge: `${certificateData.age || '>28'} Days`,
                numberOfPaversPerSqm: certificateData.paversPerSquareMetre,
                calculatedArea: certificateData.results?.[0]?.calculatedArea ?? 0,
                areaUsedForStrength: certificateData.paversPerSquareMetre ? 'Computed Plan Area from pavers per sqm' : 'Optional',
                areaOfUse: certificateData.areaOfUse,
                curingCondition: 'Tested as Received',
                facilityTemperature: `${certificateData.temperature ?? '24'} Degrees Celsius`,
                typeOfFailure: certificateData.results?.[0]?.modeOfFailure || 'Satisfactory',
                paverThickness: paverThickness,
                compressiveTestingMachineId: fetchedMachine?.name || certificateData.machineUsed || 'N/A',
                dateOfCasting: formatDateFromFirestore(certificateData.castingDate),
                dateOfTesting: formatDateFromFirestore(certificateData.testingDate),
                remarks: [
                    "This report relates only to the samples tested.",
                    "All information about the specimen furnished by the client/client representative.",
                    "The test was carried out according to BS 6717: 1993, Precast concrete paving blocks - Part 1. Specification for paving blocks",
                    "All tested samples will be discarded immediately after the test.",
                    "The average compressive strength value is not provided on this certificate because of the variability in the results which exceeds the repeatability condition (r = 9%)"
                ],
                checkedBy: { name: certificateData.approvedByEngineer?.name || certificateData.technician || "N/A", signatureURL: engineer?.signatureURL },
                approvedBy: { name: certificateData.approvedByManager?.name || "N/A", signatureURL: manager?.signatureURL },
                clientRepresentative: '',
                testResults,
                averageCompressiveStrength: avgStrength ?? undefined,
                status: certificateData.status,
            };
            setMappedData(data);
            setLoading(false);
        };
        
        fetchAndMapData();
    }, [certificateData, laboratory, laboratoryId, user]);

    const handlePrint = async () => {
        console.log('Download PDF button clicked');
        console.log('DEBUG: mappedData exists?', !!mappedData);
        console.log('DEBUG: laboratory exists?', !!laboratory);
        
        if (!mappedData || !laboratory) {
            console.log('Missing data:', { mappedData: !!mappedData, laboratory: !!laboratory });
            alert('Certificate data not ready');
            return;
        }

        setIsGeneratingPDF(true);

        try {
            console.log('Mapping component data...');
            console.log('DEBUG: mappedData.testResults[0].measuredThickness =', mappedData.testResults[0]?.measuredThickness);
            console.log('DEBUG: mappedData.testResults =', mappedData.testResults);
            
            // Map the component data to template data
            const templateData = mapPaverCertificateData({
                certificateData,
                laboratory,
                laboratoryId,
                user,
                receipt: null, // We'll need to fetch this if needed
                approvers,
                mappedData
            });

            console.log('Template data mapped:', templateData);

            console.log('Calling API...');
            // Call the API to generate PDF
            const response = await fetch('/api/generate-pdf/paver-certificate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(templateData),
            });

                    console.log('API response status:', response.status);
                    console.log('API response headers:', Object.fromEntries(response.headers.entries()));

                    if (!response.ok) {
                        const errorData = await response.json();
                        console.error('API error response:', errorData);
                        throw new Error(`API Error: ${response.status} - ${errorData.details || errorData.error || 'Unknown error'}`);
                    }

                    console.log('Creating PDF blob...');
                    // Create blob and auto-download
                    const blob = await response.blob();
                    console.log('Blob created, size:', blob.size);
                    console.log('Blob type:', blob.type);
                    
                    if (blob.size === 0) {
                        console.error('ERROR: PDF blob is empty!');
                        // Clone the response to read it again
                        const responseClone = response.clone();
                        const responseText = await responseClone.text();
                        console.log('Response text:', responseText);
                        throw new Error('PDF generation failed - empty blob received');
                    }
            
            const fileName = `paver-certificate-${mappedData.certificateNo}.pdf`;
            const url = window.URL.createObjectURL(blob);
            
            // Auto-download the PDF
            const a = document.createElement('a');
            a.href = url;
            a.download = fileName;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
            
            console.log('PDF downloaded successfully');
        } catch (error) {
            console.error('Error generating PDF:', error);
            alert(`Failed to generate PDF: ${error instanceof Error ? error.message : 'Unknown error'}`);
        } finally {
            setIsGeneratingPDF(false);
        }
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
                    <h2 className="text-lg font-semibold">Paver Certificate</h2>
                    <Button onClick={handlePrint} disabled={isGeneratingPDF}>
                        {isGeneratingPDF ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                            <Printer className="mr-2 h-4 w-4" />
                        )}
                        {isGeneratingPDF ? 'Generating PDF...' : 'Download PDF'}
                    </Button>
                </div>
            </div>
            
            <main className="container mx-auto max-w-4xl p-4 sm:p-6 lg:p-8 print:m-0 print:p-0">
              <div className="print-content p-8 bg-card rounded-lg shadow-sm border print:border-none print:shadow-none">
                <PaverCertificatePreview data={mapPaverCertificateData({
                  certificateData,
                  laboratory,
                  laboratoryId: laboratoryId || '',
                  user,
                  receipt: null,
                  approvers,
                  mappedData
                })} />
              </div>
            </main>
            
            {/* Removed PDFPreviewModal - using simple window.print() */}
        </>
    );
}