"use client";

import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import React from 'react';

type SampleReceiptProps = {
    formData: any;
    categories: any;
    specialData: any;
    receiptDate: Date;
    onClose: () => void;
};

export function SampleReceipt({ formData, categories, specialData, receiptDate, onClose }: SampleReceiptProps) {
    const handlePrint = () => {
        window.print();
    };

    const allTests = Object.entries(categories).flatMap(([category, catData] : [string, any]) => 
        Object.entries(catData.tests).map(([testId, testData] : [string, any]) => ({
            category,
            ...testData,
            notes: catData.notes || '',
        }))
    );
    
    const renderSetDetails = (set: any, index: number) => {
        return (
             <div key={index} className="text-xs space-y-1 mt-2 p-2 border-t">
                <p><strong>Set {index + 1}:</strong></p>
                <div className="pl-2">
                    <p>Casting: {set.castingDate ? format(new Date(set.castingDate), 'PPP') : 'N/A'}, Testing: {set.testingDate ? format(new Date(set.testingDate), 'PPP') : 'N/A'}, Age: {set.age || 'N/A'} days</p>
                    <p>Area of Use: {set.areaOfUse || 'N/A'}</p>
                    {set.class && <p>Class: {set.class}</p>}
                    <p>Sample IDs: {Array.isArray(set.serials) ? set.serials.join(', ') : ''}</p>
                </div>
            </div>
        )
    }

    return (
        <div className="bg-background text-foreground fixed inset-0 z-50 p-8 flex flex-col items-center">
            <style jsx global>{`
              @media print {
                body * {
                  visibility: hidden;
                }
                #receipt-content, #receipt-content * {
                  visibility: visible;
                }
                #receipt-content {
                  position: absolute;
                  left: 0;
                  top: 0;
                  width: 100%;
                }
                .no-print {
                  display: none;
                }
              }
            `}</style>
            <div id="receipt-content" className="w-full max-w-4xl bg-white p-8 border rounded-lg shadow-lg overflow-y-auto">
                {/* Header */}
                <div className="flex justify-between items-start pb-4 border-b">
                    <div className="flex items-center gap-4">
                        <svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" x2="8" y1="13" y2="13"/><line x1="16" x2="8" y1="17" y2="17"/><line x1="10" x2="8" y1="9" y2="9"/></svg>
                        <div>
                            <h1 className="text-3xl font-bold">TestMate Laboratories</h1>
                            <p className="text-muted-foreground">Quality Testing Services</p>
                        </div>
                    </div>
                    <div className="text-right">
                        <h2 className="text-2xl font-semibold text-primary">Sample Receipt</h2>
                        <p className="text-sm">Receipt No: <span className="font-mono">{Date.now()}</span></p>
                        <p className="text-sm">Date: <span className="font-mono">{format(receiptDate, 'yyyy-MM-dd HH:mm')}</span></p>
                    </div>
                </div>

                {/* Client Info */}
                <div className="grid grid-cols-2 gap-8 my-6">
                    <div>
                        <h3 className="font-semibold text-lg mb-2 border-b pb-1">Primary Client</h3>
                        <p><strong>Name:</strong> {formData?.clientName}</p>
                        <p><strong>Address:</strong> {formData?.clientAddress}</p>
                        <p><strong>Contact:</strong> {formData?.clientContact}</p>
                    </div>
                    <div className="text-right">
                        <h3 className="font-semibold text-lg mb-2 border-b pb-1">Billing Client</h3>
                        {formData?.isSameBillingClient === 'yes' ? (
                            <p>Same as Primary Client</p>
                        ) : (
                             <>
                                <p><strong>Name:</strong> {formData?.billingName}</p>
                                <p><strong>Address:</strong> {formData?.billingAddress}</p>
                                <p><strong>Contact:</strong> {formData?.billingContact}</p>
                             </>
                        )}
                    </div>
                </div>

                {/* Sample Info */}
                 <div className="my-6">
                    <h3 className="font-semibold text-lg mb-2 border-b pb-1">Sample Information</h3>
                    <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm">
                        <p><strong>Project Title:</strong> {formData?.projectTitle}</p>
                        <p><strong>Received By:</strong> {formData?.receivedBy}</p>
                        <p><strong>Delivered By:</strong> {formData?.deliveredBy} ({formData.deliveredByContact})</p>
                        <p><strong>Status on Arrival:</strong> {formData?.sampleStatus}</p>
                        <p><strong>Results via:</strong> {formData?.transmittalModes?.join(', ')}</p>
                    </div>
                 </div>


                {/* Tests Table */}
                <div className="my-6">
                    <h3 className="font-semibold text-lg mb-2">Tests to be Performed</h3>
                    <table className="w-full text-sm border-collapse">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="p-2 border text-left">Material Category</th>
                                <th className="p-2 border text-left">Material Test</th>
                                <th className="p-2 border text-left">Test Method(s)</th>
                                <th className="p-2 border text-center">Quantity</th>
                            </tr>
                        </thead>
                        <tbody>
                            {allTests.map((test, index) => (
                                <tr key={index}>
                                    <td className="p-2 border">{test.category}</td>
                                    <td className="p-2 border">{test.materialTest}</td>
                                    <td className="p-2 border">{test.testMethods}</td>
                                    <td className="p-2 border text-center">{test.quantity}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                 {/* Special Sample Details */}
                {Object.keys(specialData).length > 0 && (
                    <div className="my-6">
                        <h3 className="font-semibold text-lg mb-2 border-b pb-1">Special Sample Details</h3>
                        {Object.entries(specialData).map(([category, data] : [string, any]) => (
                            <div key={category} className="text-sm mt-2">
                                <h4 className="font-semibold">{category}</h4>
                                {data.isSpecialPair ? (
                                    <>
                                        <div className="mt-2 p-2 border rounded-md">
                                            <h5 className="font-medium text-primary">Compressive Strength (Qty: {data.compressive.quantity})</h5>
                                            {data.compressive.sets.map(renderSetDetails)}
                                        </div>
                                         <div className="mt-2 p-2 border rounded-md">
                                            <h5 className="font-medium text-primary">Water Absorption (Qty: {data.water.quantity})</h5>
                                            {data.water.sets.map(renderSetDetails)}
                                        </div>
                                    </>
                                ) : (
                                    data.sets.map(renderSetDetails)
                                )}
                            </div>
                        ))}
                    </div>
                )}
                
                 {/* Notes */}
                <div className="my-6">
                     <h3 className="font-semibold text-lg mb-2">Notes</h3>
                     {allTests.filter(t => t.notes).length > 0 ? (
                         <div className="text-sm space-y-2">
                         {allTests.filter(t => t.notes).map((test, index) => (
                            <div key={index}>
                                <p><strong>{test.category}:</strong> {test.notes}</p>
                            </div>
                         ))}
                         </div>
                     ) : (
                        <p className="text-sm text-muted-foreground">No special notes provided.</p>
                     )}
                </div>


                {/* Footer */}
                <div className="text-center text-xs text-muted-foreground pt-4 border-t mt-8">
                    <p>Thank you for choosing TestMate Laboratories. Results will be delivered as requested.</p>
                    <p>For inquiries, please contact us at +256-XXX-XXXXXX or visit www.testmate.lab</p>
                </div>
            </div>
            <div className="no-print mt-4 flex gap-4">
                <Button onClick={handlePrint}>Print Receipt</Button>
                <Button variant="outline" onClick={onClose}>Close</Button>
            </div>
        </div>
    );
}
