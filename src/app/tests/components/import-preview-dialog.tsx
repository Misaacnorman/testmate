
'use client';

import * as React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Loader2 } from 'lucide-react';

export interface ParsedData {
    headers: string[];
    rows: (string | number | boolean)[][];
}

interface ImportPreviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  data: ParsedData;
  onConfirm: () => void;
  processing: boolean;
}

export function ImportPreviewDialog({ open, onOpenChange, data, onConfirm, processing }: ImportPreviewDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Import Preview</DialogTitle>
          <DialogDescription>
            Review the data below before importing. Found {data.rows.length} records.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-[50vh] w-full">
            <Table>
            <TableHeader>
                <TableRow>
                {data.headers.map((header) => (
                    <TableHead key={header}>{header}</TableHead>
                ))}
                </TableRow>
            </TableHeader>
            <TableBody>
                {data.rows.map((row, rowIndex) => (
                <TableRow key={rowIndex}>
                    {row.map((cell, cellIndex) => (
                    <TableCell key={cellIndex}>{String(cell)}</TableCell>
                    ))}
                </TableRow>
                ))}
            </TableBody>
            </Table>
        </ScrollArea>
        <DialogFooter>
            <Button variant="outline" onClick={() => onOpenChange(false)} disabled={processing}>Cancel</Button>
            <Button onClick={onConfirm} disabled={processing}>
                {processing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Confirm Import
            </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
