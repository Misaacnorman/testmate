"use client";

import React, { useState, useEffect } from 'react';
import { getReceiptById } from '@/services/receipts';
import { Receipt } from '@/types/receipt';
import { SampleReceipt as SampleReceiptComponent } from '../../register-sample/components/sample-receipt';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal } from 'lucide-react';
import { useParams } from 'next/navigation';

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
                        setReceipt(fetchedReceipt);
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
        
        return (
            <SampleReceiptComponent
                receiptId={receipt.id}
                formData={receipt.formData}
                categories={receipt.categories}
                specialData={receipt.specialData}
                receiptDate={receipt.receiptDate}
                onClose={handleClose}
            />
        );
    }

    return null;
}
