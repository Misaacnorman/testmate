
"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getReceipts } from '@/services/receipts';
import { Receipt } from '@/types/receipt';
import { useToast } from '@/hooks/use-toast';
import { columns } from './components/columns';
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
