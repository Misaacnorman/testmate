

"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { ReceiveSampleDialog, type FormData, type SelectedCategory, type Step4Data } from "./components/receive-sample-dialog";
import { SampleReceipt } from "./components/sample-receipt";
import { addDoc, collection, writeBatch, doc, getDoc, query, orderBy, limit, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useToast } from "@/hooks/use-toast";
import { ProjectLabTest, Receipt, Invoice } from "@/lib/types";
import { useAuth } from "@/context/auth-context";
import { HasPermission } from "@/components/auth/has-permission";
import { addDays } from "date-fns";
// Removed PDF service imports - using simple window.print() with CSS

const SPECIAL_CATEGORIES = ["Concrete", "Bricks", "Blocks", "Pavers", "Cylinder", "Water Absorption"];


export default function SamplesPage() {
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [receiptData, setReceiptData] = React.useState<Receipt | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  // Removed PDF generation state - using simple window.print()
  const { toast } = useToast();
  const { laboratoryId, laboratory } = useAuth();

  const handleFinish = async (
    formData: FormData,
    selectedCategories: Record<string, SelectedCategory>,
    step4Data: Step4Data
  ) => {
    setIsSubmitting(true);
    if (!laboratoryId) {
      toast({ variant: "destructive", title: "Error", description: "No laboratory context found." });
      setIsSubmitting(false);
      return;
    }

    try {
        const batch = writeBatch(db);
        const engineerOnDuty = laboratory?.engineerOnDuty;

        // 1. Get the next receipt number
        let nextReceiptNumber = 1; // Default start
        try {
            const labSettingsRef = doc(db, "laboratories", laboratoryId);
            const labSettingsSnap = await getDoc(labSettingsRef);
            if (labSettingsSnap.exists() && labSettingsSnap.data()?.sequenceSettings?.sampleReceiptStart) {
                nextReceiptNumber = labSettingsSnap.data().sequenceSettings.sampleReceiptStart;
            }
        
            const lastReceiptQuery = query(collection(db, "receipts"), orderBy("receiptId", "desc"), limit(1));
            const lastReceiptSnap = await getDocs(lastReceiptQuery);
            
            if (!lastReceiptSnap.empty) {
                const lastReceiptId = parseInt(lastReceiptSnap.docs[0].data().receiptId, 10);
                if (!isNaN(lastReceiptId)) {
                    nextReceiptNumber = Math.max(nextReceiptNumber, lastReceiptId + 1);
                }
            }
        } catch (e) {
            console.warn("Could not determine next receipt number, starting from 1.", e);
        }

        
        const newReceiptId = nextReceiptNumber.toString();
        const receiptDate = new Date().toISOString();
        const newReceiptData: Omit<Receipt, 'id'> = {
          receiptId: newReceiptId,
          date: receiptDate,
          formData,
          selectedCategories,
          step4Data
        };

        const receiptDocRef = doc(collection(db, "receipts"));
        batch.set(receiptDocRef, newReceiptData);
      
        const nonSpecialLabTests: ProjectLabTest[] = [];
        let setCounter = 1;
        const certPrefix = formData.deliveryMode === 'deliveredBy' ? 'DL' : 'PK';

        // --- Start Invoice Generation Logic ---
        const invoiceItems: Invoice['items'] = [];
        let subtotal = 0;
        
        Object.values(selectedCategories).forEach(cat => {
            Object.values(cat.tests).forEach(test => {
                const itemTotal = (test.amountUGX || 0) * test.quantity;
                invoiceItems.push({
                    id: test.id!,
                    description: test.materialTest!,
                    quantity: test.quantity,
                    unitPrice: test.amountUGX || 0,
                    total: itemTotal,
                });
                subtotal += itemTotal;
            });
        });

        const tax = subtotal * 0.18; // 18% VAT
        const total = subtotal + tax;

        const newInvoiceRef = doc(collection(db, 'invoices'));
        const newInvoice: Omit<Invoice, 'id'> = {
            invoiceId: `INV-${Date.now().toString().slice(-6)}`,
            clientName: formData.clientName,
            projectTitle: formData.projectTitle,
            date: receiptDate,
            dueDate: addDays(new Date(), 30).toISOString(),
            items: invoiceItems,
            subtotal,
            tax,
            total,
            status: 'Draft',
            laboratoryId,
            amountPaid: 0,
        };
        batch.set(newInvoiceRef, newInvoice);
        // --- End Invoice Generation Logic ---


        Object.values(step4Data).forEach(category => {
            Object.values(category.tests).forEach(test => {
                let collectionName: string | null = null;
                const categoryNameLower = category.categoryName.toLowerCase();
                const isWaterAbsorptionTest = test.testName.toLowerCase().includes('water absorption');

                if (isWaterAbsorptionTest) {
                    collectionName = "water_absorption_register";
                } else if (categoryNameLower === 'concrete') {
                    collectionName = "concrete_cubes_register";
                } else if (categoryNameLower === 'pavers') {
                    collectionName = "pavers_register";
                } else if (categoryNameLower === 'cylinder') {
                    collectionName = "cylinders_register";
                } else if (categoryNameLower === 'bricks' || categoryNameLower === 'blocks') {
                    collectionName = "bricks_blocks_register";
                }

                if (collectionName) {
                    test.sets.forEach(set => {
                      const certificateNumber = `${certPrefix}-${newReceiptId}-${String(setCounter).padStart(2, '0')}`;
                      setCounter++;

                      let registerEntry: any = {
                        receiptId: newReceiptId,
                        dateReceived: receiptDate,
                        client: formData.clientName,
                        project: formData.projectTitle,
                        castingDate: set.castingDate || null,
                        testingDate: set.testingDate || null,
                        age: set.age || null,
                        areaOfUse: set.areaOfUse || '',
                        sampleIds: set.sampleIds,
                        setId: set.id,
                        laboratoryId: laboratoryId,
                        certificateNumber: certificateNumber,
                        results: [], 
                        machineUsed: '',
                        temperature: null,
                        comment: '',
                        technician: '',
                        dateOfIssue: null,
                        issueId: '',
                        takenBy: '',
                        dateTaken: null,
                        contact: '',
                        status: 'Pending Test',
                        engineerOnDutyId: engineerOnDuty || null,
                      };

                      if (collectionName === "concrete_cubes_register" || collectionName === "cylinders_register") {
                        registerEntry.class = set.class === 'Other' ? set.customClass : set.class;
                      }
                      
                      if (collectionName === "pavers_register") {
                        registerEntry.paverType = set.paverType === 'Other' ? set.customPaverType : set.paverType;
                        registerEntry.paversPerSquareMetre = set.paversPerSquareMetre || null;
                      }
                      
                      if (collectionName === "bricks_blocks_register") {
                        registerEntry.sampleType = set.sampleType === 'Other' ? set.customSampleType : set.sampleType;
                      }
                      
                      if (collectionName === "water_absorption_register") {
                        registerEntry.sampleType = category.categoryName; 
                      }

                      const registerDocRef = doc(collection(db, collectionName!));
                      batch.set(registerDocRef, registerEntry);
                    });
                }
            });
        });
      
        Object.values(selectedCategories).forEach(cat => {
            const isSpecialCategory = SPECIAL_CATEGORIES.map(c => c.toLowerCase()).includes(cat.categoryName.toLowerCase());
            
            Object.values(cat.tests).forEach(test => {
                const isWaterAbsorptionTest = test.materialTest?.toLowerCase().includes('water absorption');

                if (!isSpecialCategory && !isWaterAbsorptionTest) {
                    nonSpecialLabTests.push({
                        testId: test.id!,
                        materialCategory: cat.categoryName,
                        categoryQuantity: cat.quantity,
                        materialTest: test.materialTest!,
                        quantity: test.quantity,
                        technician: ''
                    });
                }
            });
        });
      
        if (nonSpecialLabTests.length > 0) {
            const projectDocRef = doc(collection(db, "projects"));
            const newProjectEntry = {
              date: receiptDate,
              client: formData.clientName,
              project: formData.projectTitle,
              sampleReceipt: newReceiptId,
              laboratoryId: laboratoryId,
              labTests: nonSpecialLabTests,
              tasks: nonSpecialLabTests, // Initialize tasks
              engineer: '',
              fieldTestDetails: '',
              fieldTechnician: '',
              fieldStartDate: '',
              fieldEndDate: '',
              fieldRemarks: '',
              labStartDate: '',
              agreedDelivery: '',
              agreedSignature: '',
              actualDelivery: '',
              actualSignature: '',
              labRemarks: '',
              ackAfterDelivery: '',
              reportIssuedBy: '',
              reportPickedBy: '',
              contact: formData.clientContact,
              dateTime: '',
            };
            batch.set(projectDocRef, newProjectEntry);
        }

        await batch.commit();
      
        setReceiptData({ ...newReceiptData, id: receiptDocRef.id });
        setIsDialogOpen(false);
        
        toast({
            title: "Receipt and Invoice Generated",
            description: "Sample receipt saved, registers updated, and a draft invoice has been created.",
        });
    } catch(error) {
       console.error("Error saving receipt and updating registers:", error);
      toast({
        variant: "destructive",
        title: "Save Failed",
        description: "Could not save the receipt or update registers. Check console for details.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (receiptData) {
    return (
      <SampleReceipt
        receipt={receiptData}
        onBack={() => setReceiptData(null)}
      />
    );
  }

  return (
    <>
      <div className="flex h-full w-full items-center justify-center">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <h1 className="text-3xl font-bold tracking-tight">Register Sample</h1>
          <p className="text-muted-foreground">
            Start the sample registration process by clicking the button below.
          </p>
          <HasPermission permissionId="samples:receive">
            <Button size="lg" className="mt-4" onClick={() => setIsDialogOpen(true)}>
                <PlusCircle className="mr-2 h-5 w-5" />
                Receive Sample
            </Button>
          </HasPermission>
        </div>
      </div>
      <ReceiveSampleDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onFinish={handleFinish}
        isSubmitting={isSubmitting}
      />
      {/* Removed PDFPreviewModal - using simple window.print() */}
    </>
  );
}
