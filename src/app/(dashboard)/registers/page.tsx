
"use client";

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getReceipts, deleteReceipt } from '@/services/receipts';
import { Receipt } from '@/types/receipt';
import { useToast } from '@/hooks/use-toast';
import { getColumns } from './components/columns';
import { DataTable } from './components/data-table';

export default function RegistersPage() {
  const [receipts, setReceipts] = useState<Receipt[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchReceipts = useCallback(async () => {
    setIsLoading(true);
    try {
      const fetchedReceipts = await getReceipts();
      setReceipts(fetchedReceipts);
    } catch (error) {
      console.error("Failed to fetch receipts:", error);
      toast({
        variant: "destructive",
        title: "Error fetching receipts",
        description: "Could not retrieve receipts from the database.",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchReceipts();
  }, [fetchReceipts]);

  const handleReceiptDeleted = useCallback(async (receiptId: string) => {
    try {
      await deleteReceipt(receiptId);
      toast({
        title: "Receipt Deleted",
        description: "The receipt has been successfully deleted.",
      });
      fetchReceipts(); // Refetch data to update the table
    } catch (error) {
      console.error("Failed to delete receipt:", error);
      toast({
        variant: "destructive",
        title: "Error deleting receipt",
        description: "Could not delete the receipt.",
      });
    }
  }, [fetchReceipts, toast]);

  const columns = useMemo(() => getColumns({ onDelete: handleReceiptDeleted }), [handleReceiptDeleted]);

  return (
    <div className="flex-1 space-y-4 p-4 sm:p-6 md:p-8">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Registers</h2>
          <p className="text-muted-foreground">
            View and manage all laboratory registers.
          </p>
        </div>
      </div>
      <Tabs defaultValue="sample-receipts">
        <TabsList>
          <TabsTrigger value="sample-receipts">Sample Receipts</TabsTrigger>
        </TabsList>
        <TabsContent value="sample-receipts">
          <Card>
            <CardHeader>
              <CardTitle>Sample Receipt Log</CardTitle>
              <CardDescription>A log of all sample receipts generated.</CardDescription>
            </CardHeader>
            <CardContent>
              <DataTable columns={columns} data={receipts} isLoading={isLoading} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
