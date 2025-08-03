
"use client";

import { useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Paver } from "@/types/paver";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import isEqual from 'lodash.isequal';


const issuanceSchema = z.object({
  machineUsed: z.string().optional(),
  recordedTemperature: z.string().optional(),
  certificateNumber: z.string().optional(),
  comment: z.string().optional(),
  technician: z.string().optional(),
  dateOfIssue: z.string().optional(),
  issueIdSerialNo: z.string().optional(),
  takenBy: z.string().optional(),
  date: z.string().optional(),
  contact: z.string().optional(),
});

const formSchema = z.object({
  items: z.array(z.any()),
  issuance: issuanceSchema,
});


type IssuancePaversDialogProps = {
  items: Paver[];
  onOpenChange: (open: boolean) => void;
  onBatchUpdate: (items: Paver[]) => void;
};

export function IssuancePaversDialog({ items, onOpenChange, onBatchUpdate }: IssuancePaversDialogProps) {
  const [isConfirmingClose, setIsConfirmingClose] = useState(false);

  const originalItems = useMemo(() => items, []);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      items: originalItems,
      issuance: {
        machineUsed: originalItems[0]?.machineUsed || '',
        recordedTemperature: originalItems[0]?.recordedTemperature || '',
        certificateNumber: originalItems[0]?.certificateNumber || '',
        comment: originalItems[0]?.comment || '',
        technician: originalItems[0]?.technician || '',
        dateOfIssue: originalItems[0]?.dateOfIssue || '',
        issueIdSerialNo: originalItems[0]?.issueIdSerialNo || '',
        takenBy: originalItems[0]?.takenBy || '',
        date: originalItems[0]?.date || '',
        contact: originalItems[0]?.contact || '',
      }
    }
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    const { issuance } = data;
    const itemsToUpdate = originalItems.map(item => ({
      ...item,
      ...issuance,
    }));

    const changedItems = itemsToUpdate.filter((updatedItem, index) => {
      const originalIssuance = {
        machineUsed: originalItems[index].machineUsed,
        recordedTemperature: originalItems[index].recordedTemperature,
        certificateNumber: originalItems[index].certificateNumber,
        comment: originalItems[index].comment,
        technician: originalItems[index].technician,
        dateOfIssue: originalItems[index].dateOfIssue,
        issueIdSerialNo: originalItems[index].issueIdSerialNo,
        takenBy: originalItems[index].takenBy,
        date: originalItems[index].date,
        contact: originalItems[index].contact,
      };
      return !isEqual(originalIssuance, issuance);
    });

    if (changedItems.length > 0) {
      onBatchUpdate(changedItems as Paver[]);
    } else {
      onOpenChange(false);
    }
  };

  const handleCloseAttempt = () => {
    const currentIssuanceValues = form.getValues().issuance;
     const originalIssuanceValues = {
        machineUsed: originalItems[0]?.machineUsed || '',
        recordedTemperature: originalItems[0]?.recordedTemperature || '',
        certificateNumber: originalItems[0]?.certificateNumber || '',
        comment: originalItems[0]?.comment || '',
        technician: originalItems[0]?.technician || '',
        dateOfIssue: originalItems[0]?.dateOfIssue || '',
        issueIdSerialNo: originalItems[0]?.issueIdSerialNo || '',
        takenBy: originalItems[0]?.takenBy || '',
        date: originalItems[0]?.date || '',
        contact: originalItems[0]?.contact || '',
    };
    const hasUnsavedChanges = !isEqual(originalIssuanceValues, currentIssuanceValues);
    
    if (hasUnsavedChanges) {
      setIsConfirmingClose(true);
    } else {
      onOpenChange(false);
    }
  };
  
  const firstItem = originalItems[0];

  return (
    <>
      <Dialog open={true} onOpenChange={(open) => { if (!open) handleCloseAttempt(); }}>
        <DialogContent 
            className="max-w-3xl max-h-[90vh] flex flex-col"
            onInteractOutside={(e) => { e.preventDefault(); handleCloseAttempt(); }}
        >
          <DialogHeader>
            <DialogTitle>
                Issuance Details for Set
            </DialogTitle>
            <DialogDescription>
                Enter the information common to all {items.length} selected samples in this set.
            </DialogDescription>
          </DialogHeader>
          <div className="flex-grow overflow-y-auto pr-6 -mr-6">
            <form id="issuance-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="space-y-4 p-4 border rounded-lg bg-muted/50 text-sm">
                    <p><strong>Client:</strong> {firstItem.client}</p>
                    <p><strong>Project:</strong> {firstItem.project}</p>
                    <p><strong>Sample IDs:</strong> {items.map(i => i.sampleId).join(', ')}</p>
                </div>

                <div className="space-y-4 p-2">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2"><Label>Machine Used</Label><Input {...form.register('issuance.machineUsed')} /></div>
                        <div className="space-y-2"><Label>Recorded Temperature (°C)</Label><Input {...form.register('issuance.recordedTemperature')} /></div>
                        <div className="space-y-2 md:col-span-2"><Label>Comment</Label><Input {...form.register('issuance.comment')} /></div>
                        <div className="space-y-2"><Label>Technician</Label><Input {...form.register('issuance.technician')} /></div>
                        <div className="space-y-2"><Label>Certificate Number</Label><Input {...form.register('issuance.certificateNumber')} /></div>
                        <div className="space-y-2"><Label>Date of Issue</Label><Input type="date" {...form.register('issuance.dateOfIssue')} /></div>
                        <div className="space-y-2"><Label>Issue ID/Serial No.</Label><Input {...form.register('issuance.issueIdSerialNo')} /></div>
                        <div className="space-y-2"><Label>Taken By</Label><Input {...form.register('issuance.takenBy')} /></div>
                        <div className="space-y-2"><Label>Date</Label><Input type="date" {...form.register('issuance.date')} /></div>
                        <div className="space-y-2"><Label>Contact</Label><Input {...form.register('issuance.contact')} /></div>
                    </div>
                </div>
            </form>
          </div>
          <DialogFooter className="pt-4 justify-between border-t">
            <div>
              <Button type="button" variant="ghost" onClick={handleCloseAttempt}>Cancel</Button>
            </div>
            <Button type="submit" form="issuance-form">Save Issuance Details</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <AlertDialog open={isConfirmingClose} onOpenChange={setIsConfirmingClose}>
          <AlertDialogContent>
              <AlertDialogHeader>
                  <AlertDialogTitle>Discard unsaved changes?</AlertDialogTitle>
                  <AlertDialogDescription>
                      You have unsaved changes. Are you sure you want to close the dialog and discard them?
                  </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                  <AlertDialogCancel>No, continue editing</AlertDialogCancel>
                  <AlertDialogAction onClick={() => onOpenChange(false)} className="bg-destructive hover:bg-destructive/90">
                      Yes, discard changes
                  </AlertDialogAction>
              </AlertDialogFooter>
          </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
