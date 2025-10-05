
"use client";

import * as React from "react";
import {
  collection,
  getDocs,
  doc,
  writeBatch,
  deleteDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Receipt } from "@/lib/types";
import { ReceiptDataTable } from "./components/data-table";
import { getColumns } from "./components/columns";
import { useToast } from "@/hooks/use-toast";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
  } from "@/components/ui/alert-dialog"
import { SampleReceipt } from "../samples/components/sample-receipt";

export default function ReceiptsPage() {
  const [receipts, setReceipts] = React.useState<Receipt[]>([]);
  const [loading, setLoading] = React.useState(true);
  const { toast } = useToast();

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);
  const [deletingReceipt, setDeletingReceipt] = React.useState<Receipt | null>(null);

  const [viewingReceipt, setViewingReceipt] = React.useState<Receipt | null>(null);

  const fetchReceipts = async () => {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, "receipts"));
      const receiptsData = querySnapshot.docs.map(
        (doc) => ({ id: doc.id, ...doc.data() } as Receipt)
      );
      setReceipts(receiptsData.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
    } catch (error) {
      console.error("Error fetching receipts:", error);
      toast({
        variant: "destructive",
        title: "Failed to fetch receipts",
        description: "Could not load receipts from the database. Check console for details.",
      });
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchReceipts();
  }, []);

  const openDeleteDialog = (receipt: Receipt) => {
    setDeletingReceipt(receipt);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteReceipt = async () => {
    if (!deletingReceipt || !deletingReceipt.id) return;
    try {
      await deleteDoc(doc(db, "receipts", deletingReceipt.id));
      toast({
        title: "Receipt Deleted",
        description: "The receipt has been successfully deleted.",
      });
      fetchReceipts();
    } catch (error) {
      console.error("Error deleting receipt:", error);
      toast({
        variant: "destructive",
        title: "Deletion Failed",
        description: "Could not delete the receipt. Check console for details.",
      });
    } finally {
        setIsDeleteDialogOpen(false);
        setDeletingReceipt(null);
    }
  };
  
  const openViewDialog = (receipt: Receipt) => {
    setViewingReceipt(receipt);
  };

  const columns = getColumns(openViewDialog, openDeleteDialog);
  
  if(viewingReceipt) {
    return <SampleReceipt receipt={viewingReceipt} onBack={() => setViewingReceipt(null)} />
  }

  return (
    <>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Sample Receipt Log</h1>
            <p className="text-muted-foreground">
              View and manage all sample receipts in the system.
            </p>
          </div>
        </div>
        <ReceiptDataTable
          columns={columns}
          data={receipts}
          loading={loading}
        />
      </div>

       <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              {deletingReceipt ? `This action will permanently delete receipt "${deletingReceipt.receiptId}".` : ''}
               This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteReceipt}>
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
