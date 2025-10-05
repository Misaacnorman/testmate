"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { Test } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { collection, writeBatch, doc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Loader2 } from "lucide-react";

interface ImportPreviewDialogProps {
  isOpen: boolean;
  onClose: () => void;
  importData: Test[];
  onImportSuccess: () => void;
}

export function ImportPreviewDialog({
  isOpen,
  onClose,
  importData,
  onImportSuccess,
}: ImportPreviewDialogProps) {
  const [isConfirming, setIsConfirming] = React.useState(false);
  const { toast } = useToast();

  const handleConfirmImport = async () => {
    setIsConfirming(true);
    try {
      const batch = writeBatch(db);
      importData.forEach((test) => {
        const docRef = doc(collection(db, "tests"));
        const dataToSave = { ...test };
        delete dataToSave.id; // Firestore generates ID
        batch.set(docRef, dataToSave);
      });
      await batch.commit();

      toast({
        title: "Import Successful",
        description: `${importData.length} tests have been imported.`,
      });
      onImportSuccess();
      onClose();
    } catch (error) {
      console.error("Error importing data:", error);
      toast({
        variant: "destructive",
        title: "Import Failed",
        description:
          "An error occurred while importing the data. Please check the data and try again.",
      });
    } finally {
      setIsConfirming(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Import Preview</DialogTitle>
          <DialogDescription>
            Review the data below before confirming the import.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-[60vh] rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Material Category</TableHead>
                <TableHead>Test Code</TableHead>
                <TableHead>Material Test</TableHead>
                <TableHead>Amount (UGX)</TableHead>
                <TableHead>Amount (USD)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {importData.map((test, index) => (
                <TableRow key={index}>
                  <TableCell>{test.materialCategory}</TableCell>
                  <TableCell>{test.testCode}</TableCell>
                  <TableCell>{test.materialTest}</TableCell>
                  <TableCell>{test.amountUGX}</TableCell>
                  <TableCell>{test.amountUSD}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isConfirming}>
            Cancel
          </Button>
          <Button onClick={handleConfirmImport} disabled={isConfirming}>
            {isConfirming && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            Confirm Import
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
