"use client";

import { useState, useMemo } from "react";
import { useForm, useFieldArray } from "react-hook-form";
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
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import isEqual from 'lodash.isequal';


const paverSchema = z.object({
  id: z.string(),
  dimensions: z.object({
    length: z.coerce.number().optional(),
    width: z.coerce.number().optional(),
    height: z.coerce.number().optional(),
  }).optional(),
  areaOfUse: z.string().optional(),
  paverType: z.string().optional(),
  paversPerSqMetre: z.coerce.number().optional(),
  calculatedArea: z.coerce.number().optional(),
  weightKg: z.coerce.number().optional(),
  machineUsed: z.string().optional(),
  loadKN: z.coerce.number().optional(),
  modeOfFailure: z.string().optional(),
  recordedTemperature: z.string().optional(),
  comment: z.string().optional(),
  technician: z.string().optional(),
  certificateNumber: z.string().optional(),
  dateOfIssue: z.string().optional(),
  issueIdSerialNo: z.string().optional(),
  // read-only fields for context
  client: z.string(),
  project: z.string(),
  sampleId: z.string(),
  castingDate: z.string(),
  testingDate: z.string(),
  ageDays: z.number(),
  dateReceived: z.string(),
  takenBy: z.string(),
  date: z.string(),
  contact: z.string(),
  sampleReceiptNo: z.string(),
});

const formSchema = z.object({
  pavers: z.array(paverSchema),
});

type TestPaversDialogProps = {
  items: Paver[];
  onOpenChange: (open: boolean) => void;
  onBatchUpdate: (items: Paver[]) => void;
};

export function TestPaversDialog({ items, onOpenChange, onBatchUpdate }: TestPaversDialogProps) {
  const [activePaverIndex, setActivePaverIndex] = useState(0);
  const [currentSubStep, setCurrentSubStep] = useState(1);
  const [isConfirmingClose, setIsConfirmingClose] = useState(false);
  
  const originalItems = useMemo(() => items, [items]);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      pavers: originalItems,
    }
  });

  const { fields } = useFieldArray({
    control: form.control,
    name: "pavers",
  });
  
  const currentItem = originalItems[activePaverIndex];

  const handleNextPaver = () => {
    if (activePaverIndex < items.length - 1) {
      setActivePaverIndex(activePaverIndex + 1);
      setCurrentSubStep(1);
    }
  };

  const handleBackPaver = () => {
    if (activePaverIndex > 0) {
      setActivePaverIndex(activePaverIndex - 1);
      setCurrentSubStep(1);
    }
  };
  
  const handleNextSubStep = () => setCurrentSubStep(prev => prev < 2 ? prev + 1 : prev);
  const handleBackSubStep = () => setCurrentSubStep(prev => prev > 1 ? prev - 1 : prev);

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    const changedItems = data.pavers.filter((updatedItem, index) => {
      const originalItem = originalItems[index];
      return !isEqual(originalItem, updatedItem);
    });

    if (changedItems.length > 0) {
      onBatchUpdate(changedItems as Paver[]);
    } else {
      onOpenChange(false);
    }
  };

  const handleCloseAttempt = () => {
    const currentFormValues = form.getValues().pavers;
    const hasUnsavedChanges = !isEqual(originalItems, currentFormValues);
    
    if (hasUnsavedChanges) {
      setIsConfirmingClose(true);
    } else {
      onOpenChange(false);
    }
  };
  
  const progress = ((activePaverIndex + 1) / items.length) * 100;

  return (
    <>
      <Dialog open={true} onOpenChange={(open) => { if (!open) handleCloseAttempt(); }}>
        <DialogContent 
          className="max-w-4xl max-h-[90vh] flex flex-col"
          onInteractOutside={(e) => { e.preventDefault(); handleCloseAttempt(); }}
          >
          <DialogHeader>
            <DialogTitle>Test Pavers ({activePaverIndex + 1} of {items.length})</DialogTitle>
            <DialogDescription>
              Enter the test results for the selected samples. Use the sub-steps for each paver.
            </DialogDescription>
            <Progress value={progress} className="mt-2" />
          </DialogHeader>
          <ScrollArea className="flex-grow pr-6 -mr-6">
            <form id="test-pavers-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-4 p-4 border rounded-lg bg-muted/50">
                <h4 className="font-semibold text-lg mb-2">Sample Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                  <div><Label>Client:</Label><p>{currentItem.client}</p></div>
                  <div><Label>Project:</Label><p>{currentItem.project}</p></div>
                  <div><Label>Sample ID:</Label><p className="font-mono">{currentItem.sampleId}</p></div>
                  <div><Label>Casting Date:</Label><p>{currentItem.castingDate}</p></div>
                  <div><Label>Testing Date:</Label><p>{currentItem.testingDate}</p></div>
                </div>
              </div>
              
               <p className="text-sm text-center font-medium text-muted-foreground">Sub-step {currentSubStep} of 2 for Sample {activePaverIndex + 1}</p>

              {currentSubStep === 1 && (
                 <div className="space-y-4 p-4 border rounded-lg">
                    <h4 className="font-semibold text-lg mb-2">Test Results</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2"><Label>Length (mm)</Label><Input type="number" step="any" {...form.register(`pavers.${activePaverIndex}.dimensions.length`)} /></div>
                      <div className="space-y-2"><Label>Width (mm)</Label><Input type="number" step="any" {...form.register(`pavers.${activePaverIndex}.dimensions.width`)} /></div>
                      <div className="space-y-2"><Label>Height (mm)</Label><Input type="number" step="any" {...form.register(`pavers.${activePaverIndex}.dimensions.height`)} /></div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2"><Label>Weight (kg)</Label><Input type="number" step="any" {...form.register(`pavers.${activePaverIndex}.weightKg`)} /></div>
                      <div className="space-y-2"><Label>Load (kN)</Label><Input type="number" step="any" {...form.register(`pavers.${activePaverIndex}.loadKN`)} /></div>
                      <div className="space-y-2"><Label>Calculated Area (mm²)</Label><Input type="number" step="any" {...form.register(`pavers.${activePaverIndex}.calculatedArea`)} /></div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2"><Label>Area of Use</Label><Input {...form.register(`pavers.${activePaverIndex}.areaOfUse`)} /></div>
                      <div className="space-y-2"><Label>Paver Type</Label><Input {...form.register(`pavers.${activePaverIndex}.paverType`)} /></div>
                      <div className="space-y-2"><Label>Pavers per m²</Label><Input type="number" {...form.register(`pavers.${activePaverIndex}.paversPerSqMetre`)} /></div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2"><Label>Machine Used</Label><Input {...form.register(`pavers.${activePaverIndex}.machineUsed`)} /></div>
                      <div className="space-y-2"><Label>Mode of Failure</Label><Input {...form.register(`pavers.${activePaverIndex}.modeOfFailure`)} /></div>
                    </div>
                    <div className="space-y-2"><Label>Recorded Temp. (°C)</Label><Input {...form.register(`pavers.${activePaverIndex}.recordedTemperature`)} /></div>
                    <div className="space-y-2"><Label>Comment</Label><Textarea {...form.register(`pavers.${activePaverIndex}.comment`)} /></div>
                  </div>
              )}
              {currentSubStep === 2 && (
                 <div className="space-y-4 p-4 border rounded-lg">
                    <h4 className="font-semibold text-lg mb-2">Issuance Details</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2"><Label>Technician</Label><Input {...form.register(`pavers.${activePaverIndex}.technician`)} /></div>
                      <div className="space-y-2"><Label>Certificate Number</Label><Input {...form.register(`pavers.${activePaverIndex}.certificateNumber`)} /></div>
                      <div className="space-y-2"><Label>Date of Issue</Label><Input {...form.register(`pavers.${activePaverIndex}.dateOfIssue`)} placeholder="YYYY-MM-DD"/></div>
                      <div className="space-y-2"><Label>Issue ID/Serial No.</Label><Input {...form.register(`pavers.${activePaverIndex}.issueIdSerialNo`)} /></div>
                    </div>
                  </div>
              )}
            </form>
          </ScrollArea>
          <DialogFooter className="pt-4 justify-between">
            <div>
              <Button type="button" variant="ghost" onClick={handleCloseAttempt}>Cancel</Button>
            </div>
            
            <div className="flex gap-2">
                {currentSubStep > 1 && <Button type="button" variant="outline" onClick={handleBackSubStep}>Back Step</Button>}
                {currentSubStep < 2 && <Button type="button" onClick={handleNextSubStep}>Next Step</Button>}
            </div>

            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={handleBackPaver} disabled={activePaverIndex === 0}>Previous Paver</Button>
              {activePaverIndex < items.length - 1 ? (
                <Button type="button" onClick={handleNextPaver}>Next Paver</Button>
              ) : (
                <Button type="submit" form="test-pavers-form" disabled={currentSubStep !== 2}>Finish & Save All</Button>
              )}
            </div>
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
