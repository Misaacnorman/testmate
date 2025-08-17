
'use client';

import * as React from 'react';
import { useToast } from '@/hooks/use-toast';
import { getReceipts, deleteReceipt } from './data';
import { DataTable } from './components/data-table';
import { columns } from './components/columns';
import { Receipt } from '@/lib/types';

export default function SampleReceiptLogPage() {
  const [receipts, setReceipts] = React.useState<Receipt[]>([]);
  const [loading, setLoading] = React.useState(true);
  const { toast } = useToast();

  const loadReceipts = React.useCallback(async () => {
    setLoading(true);
    try {
      const data = await getReceipts();
      setReceipts(data);
    } catch (error) {
      console.error('Failed to load receipts:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to load receipts from the database.',
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  React.useEffect(() => {
    loadReceipts();
  }, [loadReceipts]);

  const handleDelete = async (receiptId: string) => {
    try {
      await deleteReceipt(receiptId);
      setReceipts((prev) => prev.filter((r) => r.id !== receiptId));
      toast({
        title: 'Success',
        description: `Receipt ${receiptId} and all associated samples have been deleted.`,
      });
    } catch (error) {
      console.error('Failed to delete receipt:', error);
      toast({
        variant: 'destructive',
        title: 'Delete Failed',
        description: 'Could not delete the receipt from the database.',
      });
    }
  };

  const tableColumns = React.useMemo(() => columns({ onDelete: handleDelete }), [handleDelete]);

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between p-4 border-b">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Sample Receipt Log</h1>
          <p className="text-muted-foreground">
            View and manage all sample receipts in the system.
          </p>
        </div>
      </div>
      <div className="flex-1 overflow-auto p-4">
        <DataTable
          columns={tableColumns}
          data={receipts}
          loading={loading}
        />
      </div>
    </div>
  );
}
