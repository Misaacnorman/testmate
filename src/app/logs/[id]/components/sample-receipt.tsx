
'use client';

import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { format, parseISO } from 'date-fns';
import { useReactToPrint } from 'react-to-print';
import { Printer, TestTube, User, Folder, Calendar, Truck, Microscope, ClipboardList } from 'lucide-react';
import type { Receipt } from '@/lib/types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface TestRowData {
    category: string;
    test: any;
    testId: string;
}

export function SampleReceipt({ data }: { data: Receipt }) {
  const componentRef = useRef<HTMLDivElement>(null);
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: `Sample_Receipt_${data.id}`,
  });

  const parseAndFormatDate = (dateString: string | undefined, formatString: string = 'PPP') => {
      if (!dateString) return 'N/A';
      try {
        const date = dateString.includes('T') ? parseISO(dateString) : parseISO(dateString.replace(' ', 'T'));
        if (isNaN(date.getTime())) return 'Invalid Date';
        return format(date, formatString);
      } catch (e) {
          return 'Invalid Date';
      }
  }

  const allTests: TestRowData[] = React.useMemo(() => {
    return Object.entries(data.categories).flatMap(([category, catData]: [string, any]) => 
        Object.entries(catData.tests).map(([testId, test]: [string, any]) => ({
            category,
            test,
            testId
        }))
    );
  }, [data.categories]);

  return (
    <div className="bg-white max-w-4xl mx-auto p-8 rounded-lg shadow-xl">
        <div className="flex justify-end gap-2 mb-4">
            <Button onClick={handlePrint} variant="outline" size="sm">
                <Printer className="mr-2 h-4 w-4" />
                Print / Save PDF
            </Button>
       </div>
      <div ref={componentRef} className="p-4 sm:p-6 lg:p-8 text-black">
        <header className="flex justify-between items-start pb-6 border-b-2 border-gray-800">
          <div className="flex items-center gap-4">
            <TestTube className="h-16 w-16 text-primary" />
            <div>
                <h1 className="text-4xl font-extrabold text-gray-900">TestMate Inc.</h1>
                <p className="text-sm text-gray-600">Advanced Laboratory Services</p>
                <p className="text-sm text-gray-600">123 Lab Lane, Kampala, Uganda</p>
                <p className="text-sm text-gray-600">contact@testmate.dev | +256 777 123456</p>
            </div>
          </div>
          <div className="text-right">
            <h2 className="text-2xl font-bold uppercase text-primary">Sample Receipt</h2>
            <p className="text-lg font-mono">ID: {data.id}</p>
          </div>
        </header>
        
        <section className="my-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Client & Project Info */}
                <div className="space-y-4">
                    <h3 className="flex items-center text-lg font-semibold border-b pb-2"><User className="mr-2 h-5 w-5 text-primary"/>Client & Project Information</h3>
                    <div className="text-sm space-y-1 pl-2">
                        <p><strong>Client:</strong> {data.clientName} ({data.clientContact})</p>
                        <p><strong>Address:</strong> {data.clientAddress}</p>
                        <p><strong>Project:</strong> {data.projectTitle}</p>
                    </div>
                </div>

                {/* Billing Info */}
                 <div className="space-y-4">
                    <h3 className="flex items-center text-lg font-semibold border-b pb-2"><ClipboardList className="mr-2 h-5 w-5 text-primary"/>Billing Information</h3>
                    <div className="text-sm space-y-1 pl-2">
                        {data.isSameBillingClient === 'no' ? (
                            <>
                                <p><strong>Billed To:</strong> {data.billingName} ({data.billingContact})</p>
                                <p><strong>Address:</strong> {data.billingAddress}</p>
                            </>
                        ) : (
                            <p>Billed to the client.</p>
                        )}
                    </div>
                </div>
            </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Receiving Details */}
                <div className="space-y-4">
                     <h3 className="flex items-center text-lg font-semibold border-b pb-2"><Truck className="mr-2 h-5 w-5 text-primary"/>Receiving Details</h3>
                     <div className="text-sm space-y-1 pl-2">
                        <p><strong>Received On:</strong> {parseAndFormatDate(data.receiptDate, 'PPP p')}</p>
                        <p><strong>Received By:</strong> {data.receivedBy}</p>
                        <p><strong>Delivered By:</strong> {data.deliveredBy} ({data.deliveredByContact})</p>
                        <p><strong>Sample Status:</strong> {data.sampleStatus}</p>
                     </div>
                </div>
                
                 {/* Reporting Details */}
                <div className="space-y-4">
                     <h3 className="flex items-center text-lg font-semibold border-b pb-2"><Calendar className="mr-2 h-5 w-5 text-primary"/>Reporting Details</h3>
                    <div className="text-sm space-y-1 pl-2">
                        <p><strong>Results Transmittal:</strong> {data.transmittalModes.join(', ')}</p>
                        {data.transmittalModes.includes('Email') && <p><strong>Email:</strong> {data.email}</p>}
                        {data.transmittalModes.includes('Whatsapp') && <p><strong>Whatsapp:</strong> {data.whatsapp}</p>}
                    </div>
                </div>
            </div>
        </section>

        <section className="my-8">
            <h3 className="flex items-center text-lg font-semibold border-b pb-2 mb-4"><Microscope className="mr-2 h-5 w-5 text-primary"/>Tests to be Performed</h3>
            <div className="border rounded-lg overflow-hidden">
                <Table>
                    <TableHeader className="bg-gray-100">
                        <TableRow>
                            <TableHead className="w-[150px]">Material Category</TableHead>
                            <TableHead>Material Test</TableHead>
                            <TableHead>Test Method(s)</TableHead>
                            <TableHead className="text-center">Quantity</TableHead>
                            <TableHead>Concrete Details</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {allTests.map(({ category, test, testId }, index) => {
                            const specialTestDetails = data.specialData?.[category]?.[testId];
                            return (
                                <TableRow key={index}>
                                    <TableCell>{category}</TableCell>
                                    <TableCell>{test.materialTest}</TableCell>
                                    <TableCell>{test.testMethods}</TableCell>
                                    <TableCell className="text-center">{test.quantity}</TableCell>
                                    <TableCell>
                                        {specialTestDetails ? (
                                            <div className="space-y-2 text-xs">
                                                {specialTestDetails.sets.map((set: any, i: number) => (
                                                    <div key={i} className="p-2 bg-gray-50 rounded">
                                                        <p><strong>Set {i + 1}</strong> (Qty: {specialTestDetails.setDistribution[i]})</p>
                                                        <p><strong>Casting:</strong> {parseAndFormatDate(set.castingDate, 'dd-MMM-yy')}</p>
                                                        <p><strong>Testing:</strong> {parseAndFormatDate(set.testingDate, 'dd-MMM-yy')}</p>
                                                        <p><strong>Age:</strong> {set.age || 'N/A'} days</p>
                                                        <p><strong>Area:</strong> {set.areaOfUse || 'N/A'}</p>
                                                        <p><strong>IDs:</strong> {Array.isArray(set.serials) ? set.serials.join(', ') : ''}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : 'N/A'}
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </div>
        </section>
        
        <section className="my-8">
            <h3 className="text-lg font-bold border-b pb-2 mb-2">Notes</h3>
            {Object.entries(data.categories).some(([_, catData]: [string, any]) => catData.notes) ? (
                 <div className="text-sm space-y-1">
                    {Object.entries(data.categories).map(([category, catData]: [string, any]) => 
                        catData.notes ? (
                            <p key={category}><strong>{category}:</strong> {catData.notes}</p>
                        ) : null
                    )}
                 </div>
            ) : (
                <p className="text-sm text-gray-600">No special notes provided.</p>
            )}
        </section>

        <footer className="pt-8 mt-8 border-t text-center text-xs text-gray-500">
          <p>Thank you for choosing TestMate Inc. for your testing needs. All samples are handled with care and precision.</p>
          <p className="mt-1">This is a system-generated receipt and does not require a signature.</p>
        </footer>
      </div>
    </div>
  );
}

    