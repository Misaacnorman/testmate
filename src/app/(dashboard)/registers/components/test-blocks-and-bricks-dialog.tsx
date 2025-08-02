
"use client";

import { useEffect, useState, useMemo } from "react";
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
import { BlockAndBrick } from "@/types/block-and-brick";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import isEqual from 'lodash.isequal';

const itemSchema = z.object({
  id: z.string(),
  dimensions: z.object({
    length: z.coerce.number().optional(),
    width: z.coerce.number().optional(),
    height: z.coerce.number().optional(),
  }).optional(),
  dimensionsOfHoles: z.object({
    holeA: z.object({ no: z.coerce.number().optional(), l: z.coerce.number().optional(), w: z.coerce.number().optional() }).optional(),
    holeB: z.object({ no: z.coerce.number().optional(), l: z.coerce.number().optional(), w: z.coerce.number().optional() }).optional(),
    notch: z.object({ no: z.coerce.number().optional(), l: z.coerce.number().optional(), w: z.coerce.number().optional() }).optional(),
  }).optional(),
  weightKg: z.coerce.number().optional(),
  loadKN: z.coerce.number().optional(),
  modeOfFailure: z.string().optional(),
  
  // Read-only
  dateReceived: z.string(),
  client: z.string(),
  project: z.string(),
  castingDate: z.string(),
  testingDate: z.string(),
  ageDays: z.number(),
  areaOfUse: z.string(),
  sampleId: z.string(),
  sampleType: z.string(),
  
  // Set-specific
  machineUsed: z.string().optional(),
  recordedTemperature: z.string().optional(),
  certificateNumber: z.string().optional(),
  comment: z.string().optional(),
  technician: z.string().optional(),
  dateOfIssue: z.string().optional(),
  issueIdSerialNo: z.string(),
  takenBy: z.string(),
  date: z.string(),
  contact: z.string(),
  sampleReceiptNo: z.string(),
});

const formSchema = z.object({
  items: z.array(itemSchema),
});

type TestBlocksAndBricksDialogProps = {
  items: BlockAndBrick[];
  onOpenChange: (open: boolean) => void;
  onBatchUpdate: (items: BlockAndBrick[]) => void;
};

export function TestBlocksAndBricksDialog({ items, onOpenChange, onBatchUpdate }: TestBlocksAndBricksDialogProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isConfirmingClose, setIsConfirmingClose] = useState(false);

  const originalItems = useMemo(() => items, []);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      items: originalItems,
    }
  });

  const { fields } = useFieldArray({
    control: form.control,
    name: "items",
  });
  
  const currentItem = originalItems[currentStep];
  const isFinalStep = currentStep === items.length;

  const handleNext = () => {
    if (currentStep < items.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    const finalSetData = data.items[0];
    const itemsToUpdate = data.items.map(item => ({
        ...item,
        machineUsed: finalSetData.machineUsed,
        recordedTemperature: finalSetData.recordedTemperature,
        certificateNumber: finalSetData.certificateNumber,
        comment: finalSetData.comment,
        technician: finalSetData.technician,
        dateOfIssue: finalSetData.dateOfIssue,
    }));
    
    const changedItems = itemsToUpdate.filter((updatedItem, index) => {
      const originalItem = originalItems[index];
       const checkOriginal = {...originalItem, ...finalSetData};
      return !isEqual(checkOriginal, updatedItem);
    });

    if (changedItems.length > 0) {
      onBatchUpdate(changedItems as BlockAndBrick[]);
    } else {
      onOpenChange(false);
    }
  };

  const handleCloseAttempt = () => {
    const currentFormValues = form.getValues().items;
    const hasUnsavedChanges = !isEqual(originalItems, currentFormValues);
    
    if (hasUnsavedChanges) {
      setIsConfirmingClose(true);
    } else {
      onOpenChange(false);
    }
  };
  
  const progress = (currentStep / items.length) * 100;

  return (
    <>
    <Dialog open={true} onOpenChange={(open) => { if (!open) handleCloseAttempt(); }}>
      <DialogContent 
        className="max-w-4xl max-h-[90vh] flex flex-col"
        onInteractOutside={(e) => { e.preventDefault(); handleCloseAttempt(); }}
      >
        <DialogHeader>
          <DialogTitle>
             {isFinalStep ? "Final Details for Set" : `Test Bricks/Blocks (${currentStep + 1} of ${items.length})`}
          </DialogTitle>
          <DialogDescription>
            {isFinalStep ? "Enter the information common to all samples in this set." : "Enter the test results for the selected samples."}
          </DialogDescription>
           <Progress value={isFinalStep ? 100 : progress} className="mt-2" />
        </DialogHeader>
        <ScrollArea className="flex-grow pr-6 -mr-6">
          <form id="test-b-and-b-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {!isFinalStep && currentItem ? (
                <>
                <div className="space-y-4 p-4 border rounded-lg bg-muted/50">
                    <h4 className="font-semibold text-lg mb-2">Sample Information</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                        <div><Label>Client:</Label><p>{currentItem.client}</p></div>
                        <div><Label>Project:</Label><p>{currentItem.project}</p></div>
                        <div><Label>Sample ID:</Label><p className="font-mono">{currentItem.sampleId}</p></div>
                        <div><Label>Sample Type:</Label><p>{currentItem.sampleType}</p></div>
                        <div><Label>Casting Date:</Label><p>{currentItem.castingDate}</p></div>
                        <div><Label>Testing Date:</Label><p>{currentItem.testingDate}</p></div>
                    </div>
                </div>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2"><Label>Length (mm)</Label><Input {...form.register(`items.${currentStep}.dimensions.length`)} /></div>
                    <div className="space-y-2"><Label>Width (mm)</Label><Input {...form.register(`items.${currentStep}.dimensions.width`)} /></div>
                    <div className="space-y-2"><Label>Height (mm)</Label><Input {...form.register(`items.${currentStep}.dimensions.height`)} /></div>
                  </div>

                  <Separator />
                  <Label className="font-semibold">Dimensions of Holes &amp; No. (for Hollow Blocks)</Label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-x-4 gap-y-2 p-2 border rounded-md">
                     <Label className="md:col-span-3 font-medium">Hole A</Label>
                     <div className="space-y-2"><Label>No.</Label><Input {...form.register(`items.${currentStep}.dimensionsOfHoles.holeA.no`)} /></div>
                     <div className="space-y-2"><Label>L (mm)</Label><Input {...form.register(`items.${currentStep}.dimensionsOfHoles.holeA.l`)} /></div>
                     <div className="space-y-2"><Label>W (mm)</Label><Input {...form.register(`items.${currentStep}.dimensionsOfHoles.holeA.w`)} /></div>
                     
                     <Label className="md:col-span-3 font-medium">Hole B</Label>
                     <div className="space-y-2"><Label>No.</Label><Input {...form.register(`items.${currentStep}.dimensionsOfHoles.holeB.no`)} /></div>
                     <div className="space-y-2"><Label>L (mm)</Label><Input {...form.register(`items.${currentStep}.dimensionsOfHoles.holeB.l`)} /></div>
                     <div className="space-y-2"><Label>W (mm)</Label><Input {...form.register(`items.${currentStep}.dimensionsOfHoles.holeB.w`)} /></div>

                     <Label className="md:col-span-3 font-medium">Notch</Label>
                     <div className="space-y-2"><Label>No.</Label><Input {...form.register(`items.${currentStep}.dimensionsOfHoles.notch.no`)} /></div>
                     <div className="space-y-2"><Label>L (mm)</Label><Input {...form.register(`items.${currentStep}.dimensionsOfHoles.notch.l`)} /></div>
                     <div className="space-y-2"><Label>W (mm)</Label><Input {...form.register(`items.${currentStep}.dimensionsOfHoles.notch.w`)} /></div>
                  </div>
                  <Separator />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <div className="space-y-2"><Label>Weight (kg)</Label><Input type="number" step="any" {...form.register(`items.${currentStep}.weightKg`)} /></div>
                     <div className="space-y-2"><Label>Load (kN)</Label><Input type="number" step="any" {...form.register(`items.${currentStep}.loadKN`)} /></div>
                  </div>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <div className="space-y-2"><Label>Mode of Failure</Label><Input {...form.register(`items.${currentStep}.modeOfFailure`)} /></div>
                  </div>
                </div>
                </>
            ) : (
                <div className="space-y-4 p-2">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2"><Label>Machine Used</Label><Input {...form.register('items.0.machineUsed')} /></div>
                        <div className="space-y-2"><Label>Recorded Temperature (°C)</Label><Input {...form.register('items.0.recordedTemperature')} /></div>
                        <div className="space-y-2 md:col-span-2"><Label>Comment</Label><Input {...form.register('items.0.comment')} /></div>
                        <div className="space-y-2"><Label>Technician</Label><Input {...form.register('items.0.technician')} /></div>
                        <div className="space-y-2"><Label>Certificate Number</Label><Input {...form.register('items.0.certificateNumber')} /></div>
                        <div className="space-y-2"><Label>Date of Issue</Label><Input type="date" {...form.register('items.0.dateOfIssue')} /></div>
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
             <Button type="button" variant="outline" onClick={handleBack} disabled={currentStep === 0}>Back</Button>
            {currentStep < items.length ? (
              <Button type="button" onClick={handleNext}>Next</Button>
            ) : (
              <Button type="submit" form="test-b-and-b-form">Finish & Save All</Button>
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
