
"use client";

import * as React from "react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Printer } from "lucide-react";
import { type Receipt, type SelectedCategory, type Step4Data } from "@/lib/types";
import { useAuth } from "@/context/auth-context";

interface SampleReceiptProps {
  receipt: Receipt;
  onBack: () => void;
}

const formatDateFromFirestore = (date: any): Date | null => {
    if (!date) return null;
    // It's already a Date object (e.g., from the form state)
    if (date instanceof Date) {
      return date;
    }
    // It's a Firestore Timestamp object from the database
    if (typeof date === 'object' && date.seconds) {
      return new Date(date.seconds * 1000);
    }
    // It's a date string
    const parsedDate = new Date(date);
    if (!isNaN(parsedDate.getTime())) {
        return parsedDate;
    }
    return null;
}

export function SampleReceipt({
  receipt,
  onBack,
}: SampleReceiptProps) {
  const { formData, selectedCategories, step4Data, receiptId, date } = receipt;
  const { laboratory } = useAuth();


  const handlePrint = () => {
    window.print();
  };

  const getTransmittalModes = () => {
    const modes = [];
    if (formData.transmittalModes?.email) modes.push("Email");
    if (formData.transmittalModes?.whatsapp) modes.push("WhatsApp");
    if (formData.transmittalModes?.hardcopy) modes.push("Hardcopy");
    return modes.join(", ");
  };

  const testsByCategory = Object.values(selectedCategories).reduce((acc, cat) => {
    const categoryName = cat.categoryName.toUpperCase();
    if (!acc[categoryName]) {
        acc[categoryName] = { notes: cat.notes, details: cat.details, tests: [] };
    }
    acc[categoryName].tests.push(...Object.values(cat.tests));
    return acc;
  }, {} as Record<string, { notes: string; details: string; tests: any[] }>);

  return (
    <>
      <div className="bg-card sticky top-0 z-10 print:hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 items-center justify-between">
            <Button variant="outline" onClick={onBack}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Samples
            </Button>
            <Button onClick={handlePrint}>
                <Printer className="mr-2 h-4 w-4" />
                Print / Save PDF
            </Button>
            </div>
        </div>
      </div>

      <main className="container mx-auto max-w-4xl p-4 sm:p-6 lg:p-8 print:m-0 print:p-0">
        <div className="p-8 bg-card rounded-lg shadow-sm border print:border-none print:shadow-none">
          {/* Header */}
          <header className="flex justify-between items-start pb-6 border-b">
            <div>
              {laboratory?.logo && <img src={laboratory.logo} alt="Company Logo" className="h-16 mb-2"/>}
              <h1 className="text-xl font-bold">{laboratory?.name}</h1>
              <p className="text-sm text-muted-foreground">{laboratory?.address}</p>
            </div>
            <div className="text-right">
              <h2 className="text-lg font-semibold text-primary">SAMPLE RECEIPT</h2>
              <p className="text-sm">
                <span className="font-medium">ID:</span> {receiptId}
              </p>
              <p className="text-sm">
                <span className="font-medium">Date:</span> {format(new Date(date), "PPpp")}
              </p>
            </div>
          </header>

          {/* Details Grid */}
          <section className="grid grid-cols-3 gap-8 py-6 text-xs">
            <div>
              <h3 className="font-semibold uppercase tracking-wider text-muted-foreground mb-2">Client Details</h3>
              <p><span className="font-semibold">Name:</span> {formData.clientName}</p>
              <p><span className="font-semibold">Contact:</span> {formData.clientContact}</p>
              <p><span className="font-semibold">Address:</span> {formData.clientAddress}</p>
              <p><span className="font-semibold">Project:</span> {formData.projectTitle}</p>
            </div>
             <div>
              <h3 className="font-semibold uppercase tracking-wider text-muted-foreground mb-2">Billing Details</h3>
              <p>{formData.isBillingClientSame === 'yes' ? 'Billed to client' : formData.billingClientName}</p>
            </div>
            <div>
              <h3 className="font-semibold uppercase tracking-wider text-muted-foreground mb-2">Delivery &amp; Reporting</h3>
              <p><span className="font-semibold">{formData.deliveryMode === 'deliveredBy' ? 'Delivered by:' : 'Picked by:'}</span> {formData.deliveryPerson} ({formData.delivererContact})</p>
              <p><span className="font-semibold">Received By:</span> {formData.receivedBy}</p>
              <p><span className="font-semibold">Results via:</span> {getTransmittalModes()}</p>
            </div>
          </section>

           {/* Tests Table */}
          <section className="mt-2">
            <h3 className="text-base font-semibold uppercase tracking-wider text-muted-foreground mb-2">Tests to be Performed</h3>
            <div className="border rounded-lg">
                <table className="w-full text-xs">
                    <thead className="bg-muted/50">
                        <tr className="text-left">
                            <th className="p-2 font-semibold">Material Category</th>
                            <th className="p-2 font-semibold text-center">Qty</th>
                            <th className="p-2 font-semibold">Material Test</th>
                            <th className="p-2 font-semibold">Test Method(s)</th>
                            <th className="p-2 font-semibold w-[36%]">Sample Details</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Object.entries(testsByCategory).map(([categoryName, data]) => (
                             <React.Fragment key={categoryName}>
                                <tr className="border-t font-semibold bg-muted/20">
                                    <td colSpan={5} className="p-1.5 text-muted-foreground">{categoryName}</td>
                                </tr>
                                {data.tests.map((test, index) => {
                                    const categoryData = Object.values(step4Data).find(c => c.categoryName === test.materialCategory);
                                    const specialDetails = categoryData?.tests[test.id];
                                    
                                    return (
                                        <tr key={test.id} className="border-t">
                                            <td className="p-2 align-top">{index === 0 ? '' : ''}</td>
                                            <td className="p-2 text-center align-top">{test.quantity}</td>
                                            <td className="p-2 align-top">{test.materialTest}</td>
                                            <td className="p-2 align-top">{test.testMethod || '-'}</td>
                                            <td className="p-2 align-top">
                                                 {specialDetails ? (
                                                    <div className="space-y-1.5">
                                                        {specialDetails.sets.map(set => {
                                                            const castingDate = formatDateFromFirestore(set.castingDate);
                                                            const testingDate = formatDateFromFirestore(set.testingDate);
                                                            return (
                                                                <div key={set.id}>
                                                                    <p className="font-semibold">Set {set.id} (Qty: {set.sampleCount})</p>
                                                                    <ul className="list-disc pl-4 text-muted-foreground">
                                                                        {castingDate && <li>Casting: {format(castingDate, 'PP')}</li>}
                                                                        {testingDate && <li>Testing: {format(testingDate, 'PP')}</li>}
                                                                        {set.age != null && <li>Age: {set.age}</li>}
                                                                        {set.class && <li>Class: {set.class === 'Other' ? set.customClass : set.class}</li>}
                                                                        {set.sampleType && <li>Sample Type: {set.sampleType === 'Other' ? set.customSampleType : set.sampleType}</li>}
                                                                        {set.paverType && <li>Paver Type: {set.paverType === 'Other' ? set.customPaverType : set.paverType}</li>}
                                                                        {set.areaOfUse && <li>Area of Use: {set.areaOfUse}</li>}
                                                                        {set.sampleType && !['blocks', 'bricks'].includes(test.materialCategory.toLowerCase()) && <p><span className="text-muted-foreground">Sample Type:</span> {set.sampleType}</p>}
                                                                        <li>IDs: {set.sampleIds.join(', ')}</li>
                                                                    </ul>
                                                                </div>
                                                            )
                                                        })}
                                                    </div>
                                                ) : (selectedCategories[test.materialCategory!]?.details || '-')}
                                            </td>
                                        </tr>
                                    )
                                })}
                            </React.Fragment>
                        ))}
                    </tbody>
                </table>
            </div>
          </section>

          {/* Notes */}
            <section className="mt-6">
                <h3 className="text-base font-semibold uppercase tracking-wider text-muted-foreground mb-2">Notes</h3>
                 <div className="border rounded-lg p-3 bg-muted/20 text-xs">
                    {Object.entries(testsByCategory)
                        .filter(([, data]) => data.notes.trim() !== '')
                        .map(([categoryName, data]) => (
                            <div key={categoryName}>
                                <p className="font-semibold">{categoryName}:</p>
                                <p className="text-muted-foreground whitespace-pre-wrap">{data.notes}</p>
                            </div>
                    ))}
                    {Object.values(testsByCategory).every(data => !data.notes.trim()) && (
                        <p className="text-muted-foreground">No notes provided.</p>
                    )}
                </div>
            </section>

            <footer className="text-center text-xs text-muted-foreground pt-6 mt-6 border-t">
                <p className="font-semibold">{laboratory?.name} | {laboratory?.address}</p>
                <p>{laboratory?.email}</p>
                <p className="mt-4">This is a system-generated receipt and does not require a signature.</p>
            </footer>
        </div>
      </main>
    </>
  );
}
