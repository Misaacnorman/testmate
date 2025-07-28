"use client";

import React, { useState, useEffect } from 'react';
import { getReceiptById } from '@/services/receipts';
import { Receipt } from '@/types/receipt';
import { SampleReceipt as SampleReceiptComponent } from '../../register-sample/components/sample-receipt';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal } from 'lucide-react';
import { useParams } from 'next/navigation';

// Helper function to recursively convert Firestore Timestamps to JS Dates
// This needs to be robust to handle all nested levels of the receipt object.
const convertTimestamps = (obj: any): any => {
    if (obj === null || obj === undefined) {
        return obj;
    }

    // Check if the object is a Firestore Timestamp
    if (obj && typeof obj === 'object' && typeof obj.toDate === 'function') {
        return obj.toDate();
    }
    
    // Check for array and recursively convert its items
    if (Array.isArray(obj)) {
        return obj.map(item => convertTimestamps(item));
    }

    // Check for object and recursively convert its values
    if (typeof obj === 'object') {
        const newObj: { [key: string]: any } = {};
        for (const key in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, key)) {
                newObj[key] = convertTimestamps(obj[key]);
            }
        }
        return newObj;
    }

    return obj;
};


export default function ReceiptPage() {
    const params = useParams();
    const id = params.id as string;
    const [receipt, setReceipt] = useState<Receipt | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (id) {
            const fetchReceipt = async () => {
                setIsLoading(true);
                setError(null);
                try {
                    const fetchedReceipt = await getReceiptById(id);
                    if (fetchedReceipt) {
                        // Recursively convert all timestamps before setting state
                        const serializableReceipt = convertTimestamps(fetchedReceipt);
                        setReceipt(serializableReceipt);
                    } else {
                        setError("Receipt not found.");
                    }
                } catch (e) {
                    console.error("Failed to fetch receipt:", e);
                    setError("An error occurred while fetching the receipt.");
                } finally {
                    setIsLoading(false);
                }
            };
            fetchReceipt();
        }
    }, [id]);

    if (isLoading) {
        return (
            <div className="p-8">
                <Skeleton className="h-[80vh] w-full" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center h-full p-8">
                <Alert variant="destructive" className="max-w-md">
                    <Terminal className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            </div>
        );
    }
    
    if (receipt) {
        // The onClose handler will navigate back in history or to the main logs page.
        const handleClose = () => {
            if (window.history.length > 1) {
                window.history.back();
            } else {
                // Fallback for when there's no history to go back to.
                window.location.href = '/registers';
            }
        };
        
        // Ensure receiptDate is a valid Date object before passing.
        const receiptDate = typeof receipt.receiptDate === 'string' 
            ? new Date(receipt.receiptDate) 
            : receipt.receiptDate;

        return (
            <SampleReceiptComponent
                receiptId={receipt.id}
                formData={receipt.formData}
                categories={receipt.categories}
                specialData={receipt.specialData}
                receiptDate={receiptDate}
                onClose={handleClose}
            />
        );
    }

    return null;
}
