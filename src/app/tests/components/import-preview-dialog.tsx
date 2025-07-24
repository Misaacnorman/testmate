"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Test } from "@/types/test";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";

type ImportPreviewDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tests: Omit<Test, "id">[];
  onConfirm: () => void;
};

export function ImportPreviewDialog({ open, onOpenChange, tests, onConfirm }: ImportPreviewDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Import Preview</DialogTitle>
          <DialogDescription>
            Review the tests below. Click "Confirm Import" to add them to the database.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="flex-grow border rounded-md">
          <Table>
            <TableHeader className="sticky top-0 bg-secondary">
              <TableRow>
                <TableHead>Material Category</TableHead>
                <TableHead>Test Code</TableHead>
                <TableHead>Material Test</TableHead>
                <TableHead>Accreditation</TableHead>
                <TableHead>Amount (UGX)</TableHead>
                <TableHead>Amount (USD)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tests.map((test, index) => (
                <TableRow key={index}>
                  <TableCell>{test.materialCategory}</TableCell>
                  <TableCell>{test.testCode}</TableCell>
                  <TableCell>{test.materialTest}</TableCell>
                  <TableCell>{test.accreditation}</TableCell>
                  <TableCell className="text-right">{test.amountUGX.toLocaleString()}</TableCell>
                  <TableCell className="text-right">{test.amountUSD.toLocaleString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type="button" onClick={onConfirm}>
            Confirm Import ({tests.length} records)
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
