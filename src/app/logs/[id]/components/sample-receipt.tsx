
'use client';

import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { format } from 'date-fns';
import { useReactToPrint } from 'react-to-print';
import { Printer } from 'lucide-react';
import { TestTube } from 'lucide-react';


export function SampleReceipt({ data }: { data: any }) {
  const componentRef = useRef<HTMLDivElement>(null);
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: `Sample_Receipt_${data.id}`,
  });

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
            <p className="text-sm text-gray-600">Date: {data.receiptDate ? format(new Date(data.receiptDate.seconds * 1000), 'PPP') : 'N/A'}</p>
          </div>
        </header>

        <section className="grid grid-cols-2 gap-8 my-6">
          <div>
            <h3 className="text-sm font-semibold uppercase text-gray-500 mb-2">Billed To:</h3>
            <p className="font-bold text-lg">{data.isSameBillingClient === 'yes' ? data.clientName : data.billingName}</p>
            <p>{data.isSameBillingClient === 'yes' ? data.clientAddress : data.billingAddress}</p>
            <p>{data.isSameBillingClient === 'yes' ? data.clientContact : data.billingContact}</p>
          </div>
          {data.isSameBillingClient === 'no' && (
             <div>
                <h3 className="text-sm font-semibold uppercase text-gray-500 mb-2">Client:</h3>
                <p className="font-bold text-lg">{data.clientName}</p>
                <p>{data.clientAddress}</p>
                <p>{data.clientContact}</p>
             </div>
          )}
           <div>
                <h3 className="text-sm font-semibold uppercase text-gray-500 mb-2">Project:</h3>
                <p className="font-bold text-lg">{data.projectTitle}</p>
           </div>
        </section>

        <section className="my-8">
            <h3 className="text-lg font-bold border-b-2 border-gray-300 pb-2 mb-4">Test Details</h3>
            <div className="space-y-4">
            {Object.entries(data.categories).map(([category, catData]: [string, any]) => (
                <div key={category} className="p-4 border rounded-md bg-gray-50">
                    <h4 className="font-bold text-primary">{category} (Qty: {catData.quantity})</h4>
                     <ul className="list-disc list-inside text-sm pl-4 mt-2">
                        {Object.values(catData.tests).map((test: any, index: number) => (
                            <li key={index}>
                                {test.materialTest} (Qty: {test.quantity}) - Method: {test.testMethods}
                            </li>
                        ))}
                    </ul>
                    {catData.notes && <p className="text-xs text-gray-600 mt-2"><strong>Notes: </strong>{catData.notes}</p>}
                </div>
            ))}
            </div>
        </section>

         {data.specialData && Object.keys(data.specialData).length > 0 && (
            <section className="my-8">
                <h3 className="text-lg font-bold border-b-2 border-gray-300 pb-2 mb-4">Special Sample Information</h3>
                {Object.entries(data.specialData).map(([category, tests]: [string, any]) => (
                     <div key={category} className="space-y-3">
                        <h4 className="font-semibold text-md text-gray-800">{category}</h4>
                        {Object.entries(tests).map(([testId, testDetails]: [string, any]) => (
                            <div key={testId} className="pl-4">
                                <h5 className="font-medium text-primary">{testDetails.materialTest}</h5>
                                <div className="grid grid-cols-1 divide-y border rounded-md mt-1">
                                {testDetails.sets.map((set: any, i: number) => (
                                    <div key={i} className="p-2 text-xs grid grid-cols-4 gap-2">
                                        <p><strong>Set {i + 1}:</strong> {testDetails.setDistribution[i]} samples</p>
                                        <p><strong>Casting:</strong> {set.castingDate ? format(new Date(set.castingDate), 'dd-MMM-yy') : 'N/A'}</p>
                                        <p><strong>Testing:</strong> {set.testingDate ? format(new Date(set.testingDate), 'dd-MMM-yy') : 'N/A'}</p>
                                        <p><strong>Age:</strong> {set.age || 'N/A'} days</p>
                                        <p className="col-span-2"><strong>Area of Use:</strong> {set.areaOfUse || 'N/A'}</p>
                                        {set.class && <p><strong>Class:</strong> {set.class}</p>}
                                        <p className="col-span-4"><strong>IDs:</strong> {Array.isArray(set.serials) ? set.serials.join(', ') : ''}</p>
                                    </div>
                                ))}
                                </div>
                            </div>
                        ))}
                    </div>
                ))}
            </section>
        )}


        <section className="grid grid-cols-2 gap-8 my-6 text-sm">
            <div>
                 <h3 className="text-sm font-semibold uppercase text-gray-500 mb-2">Receiving Details</h3>
                 <p><strong>Received By:</strong> {data.receivedBy}</p>
                 <p><strong>Delivered By:</strong> {data.deliveredBy} ({data.deliveredByContact})</p>
                 <p><strong>Sample Status:</strong> {data.sampleStatus}</p>
            </div>
             <div>
                 <h3 className="text-sm font-semibold uppercase text-gray-500 mb-2">Reporting</h3>
                 <p><strong>Results Transmittal:</strong> {data.transmittalModes.join(', ')}</p>
                 {data.transmittalModes.includes('Email') && <p><strong>Email:</strong> {data.email}</p>}
                 {data.transmittalModes.includes('Whatsapp') && <p><strong>Whatsapp:</strong> {data.whatsapp}</p>}
            </div>
        </section>
        
        <footer className="pt-8 mt-8 border-t text-center text-xs text-gray-500">
          <p>Thank you for choosing TestMate Inc. for your testing needs. All samples are handled with care and precision.</p>
          <p className="mt-1">This is a system-generated receipt and does not require a signature.</p>
        </footer>
      </div>
    </div>
  );
}
