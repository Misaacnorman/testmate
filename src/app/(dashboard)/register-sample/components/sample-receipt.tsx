
"use client";

import { Button } from "@/components/ui/button";
import { format, isValid, parseISO } from "date-fns";
import React from 'react';

type SampleReceiptProps = {
    receiptId: string;
    formData: any;
    categories: any;
    specialData: any;
    receiptDate: Date;
    onClose: () => void;
};

// Helper to safely format dates that might be strings or Date objects
const safeFormat = (date: string | Date | undefined | null, formatString: string) => {
    if (!date) return 'N/A';
    
    let dateObj: Date;
    if (typeof date === 'string') {
        dateObj = parseISO(date);
    } else {
        dateObj = date;
    }

    if (isValid(dateObj)) {
        return format(dateObj, formatString);
    }
    
    return 'Invalid Date';
};

export function SampleReceipt({ receiptId, formData, categories, specialData, receiptDate, onClose }: SampleReceiptProps) {
    const handlePrint = () => {
        window.print();
    };

    const allTests = Object.entries(categories).flatMap(([category, catData] : [string, any]) => 
        Object.entries(catData.tests).map(([testId, testData] : [string, any]) => ({
            id: testId,
            category,
            ...testData,
            notes: catData.notes || '',
        }))
    );

    const processedTests = allTests.reduce((acc, test, index) => {
        if (index > 0 && test.category === allTests[index - 1].category) {
            acc.push({ ...test, rowSpan: 0 });
        } else {
            let rowSpan = 1;
            for (let i = index + 1; i < allTests.length; i++) {
                if (allTests[i].category === test.category) {
                    rowSpan++;
                } else {
                    break;
                }
            }
            acc.push({ ...test, rowSpan });
        }
        return acc;
    }, [] as (typeof allTests[0] & { rowSpan: number })[]);
    
    const renderConcreteDetails = (category: string, testId: string) => {
        const data = specialData[category]?.[testId];
        if (!data) return null;

        return (
            <div className="space-y-2">
                {data.sets.map((set: any, index: number) => (
                     <div key={index} className="text-xs space-y-1 p-1 border-t first:border-t-0">
                        <p><strong>Set {index + 1} (Qty: {data.setDistribution[index]})</strong></p>
                        <div className="pl-2">
                            <p>Casting: {safeFormat(set.castingDate, 'yy-MM-dd')}</p>
                            <p>Testing: {safeFormat(set.testingDate, 'yy-MM-dd')}</p>
                            <p>Age: {set.age || 'N/A'} days</p>
                            <p>Area: {set.areaOfUse || 'N/A'}</p>
                            {set.class && <p>Class: {set.class}</p>}
                            <p>IDs: {Array.isArray(set.serials) ? set.serials.join(', ') : ''}</p>
                        </div>
                    </div>
                ))}
            </div>
        );
    }
    
    const notesAvailable = Object.values(categories).some((cat: any) => cat.notes);

    return (
        <div className="bg-background text-foreground fixed inset-0 z-50 p-8 flex flex-col items-center">
            <div id="receipt-content" className="w-full max-w-6xl bg-white text-black p-8 border rounded-lg shadow-lg overflow-y-auto">
                {/* Header */}
                <div className="flex justify-between items-start pb-4 border-b">
                    <div className="flex items-center gap-4">
                        <svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" x2="8" y1="13" y2="13"/><line x1="16" x2="8" y1="17" y2="17"/><line x1="10" x2="8" y1="9" y2="9"/></svg>
                        <div>
                            <h1 className="text-2xl font-bold">TestMate Laboratories</h1>
                            <p className="text-gray-500 text-sm">Quality Testing Services</p>
                        </div>
                    </div>
                    <div className="text-right">
                        <h2 className="text-xl font-semibold text-red-600">Sample Receipt</h2>
                        <p className="text-xs">Receipt No: <span className="font-mono">{receiptId}</span></p>
                        <p className="text-xs">Date: <span className="font-mono">{safeFormat(receiptDate, 'yyyy-MM-dd HH:mm')}</span></p>
                    </div>
                </div>

                {/* Client Info */}
                <div className="grid grid-cols-2 gap-8 my-4 text-xs">
                    <div>
                        <h3 className="font-semibold text-sm mb-2 border-b pb-1">Primary Client</h3>
                        <p><strong>Name:</strong> {formData?.clientName}</p>
                        <p><strong>Address:</strong> {formData?.clientAddress}</p>
                        <p><strong>Contact:</strong> {formData?.clientContact}</p>
                    </div>
                    <div className="text-right">
                        <h3 className="font-semibold text-sm mb-2 border-b pb-1">Billing Client</h3>
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
                 <div className="my-4">
                    <h3 className="font-semibold text-sm mb-2 border-b pb-1">Sample Information</h3>
                    <div className="grid grid-cols-3 gap-x-8 gap-y-1 text-xs">
                        <p><strong>Project Title:</strong> {formData?.projectTitle}</p>
                        <p><strong>Received By:</strong> {formData?.receivedBy}</p>
                        <p><strong>Delivered By:</strong> {formData?.deliveredBy} ({formData.deliveredByContact})</p>
                        <p><strong>Status on Arrival:</strong> {formData?.sampleStatus}</p>
                        <p><strong>Results via:</strong> {formData?.transmittalModes?.join(', ')}</p>
                    </div>
                 </div>

                {/* Tests Table */}
                <div className="my-4">
                    <h3 className="font-semibold text-sm mb-2">Tests to be Performed</h3>
                    <table className="w-full text-xs border-collapse border">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="p-2 border text-left">Material Category</th>
                                <th className="p-2 border text-left">Material Test</th>
                                <th className="p-2 border text-left">Test Method(s)</th>
                                <th className="p-2 border text-center">Quantity</th>
                                <th className="p-2 border text-left w-1/3">Concrete Details</th>
                            </tr>
                        </thead>
                        <tbody>
                             {processedTests.map((test, index) => (
                                <tr key={index}>
                                    {test.rowSpan > 0 && (
                                        <td className="p-2 border align-top" rowSpan={test.rowSpan}>
                                            {test.category}
                                        </td>
                                    )}
                                    <td className="p-2 border align-top">{test.materialTest}</td>
                                    <td className="p-2 border align-top">{test.testMethods}</td>
                                    <td className="p-2 border text-center align-top">{test.quantity}</td>
                                    <td className="p-2 border align-top">
                                        {renderConcreteDetails(test.category, test.id)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                
                 {/* Notes */}
                <div className="my-4">
                     <h3 className="font-semibold text-sm mb-2">Notes</h3>
                     {notesAvailable ? (
                         <div className="text-xs space-y-2">
                         {Object.entries(categories).map(([category, catData]: [string, any]) => 
                            catData.notes ? (
                                <div key={category}>
                                    <p><strong>{category}:</strong> {catData.notes}</p>
                                </div>
                            ) : null
                         )}
                         </div>
                     ) : (
                        <p className="text-xs text-gray-500">No special notes provided.</p>
                     )}
                </div>

                {/* Footer */}
                <div className="text-center text-xs text-gray-500 pt-4 border-t mt-6">
                    <p>Thank you for choosing TestMate Laboratories. Results will be delivered as requested.</p>
                    <p>For inquiries, please contact us at +256-XXX-XXXXXX or visit www.testmate.lab</p>
                </div>
            </div>
            <div className="no-print mt-4 flex gap-4">
                <Button onClick={handlePrint}>Print</Button>
                <Button variant="outline" onClick={onClose}>Close</Button>
            </div>
        </div>
    );
}
