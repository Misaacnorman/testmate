
"use client";

import { useState, useMemo, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
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
import { ConcreteCube } from "@/types/concrete-cube";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import isEqual from 'lodash.isequal';


const cubeSchema = z.object({
  id: z.string(),
  dimensions: z.object({
    length: z.coerce.number().optional(),
    width: z.coerce.number().optional(),
    height: z.coerce.number().optional(),
  }).optional(),
  weightKg: z.coerce.number().optional(),
  loadKN: z.coerce.number().optional(),
  modeOfFailure: z.string().optional(),
  
  // Read-only fields for context
  client: z.string(),
  project: z.string(),
  sampleId: z.string(),
  castingDate: z.string(),
  testingDate: z.string(),
  ageDays: z.number(),
  areaOfUse: z.string(),
  class: z.string(),
  
  // Set-specific fields that will be applied to all
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
  sampleReceiptNumber: z.string(),
});

const formSchema = z.object({
  cubes: z.array(cubeSchema),
});


type TestConcreteCubesDialogProps = {
  items: ConcreteCube[];
  onOpenChange: (open: boolean) => void;
  onBatchUpdate: (items: ConcreteCube[]) => void;
};

export function TestConcreteCubesDialog({ items, onOpenChange, onBatchUpdate }: TestConcreteCubesDialogProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isConfirmingClose, setIsConfirmingClose] = useState(false);

  const originalItems = useMemo(() => items, []);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      cubes: originalItems,
    }
  });
  
  const { watch, setValue, trigger } = form;
  const currentItem = originalItems[currentStep];

  const handleNext = async () => {
    const result = await trigger(`cubes.${currentStep}`);
    if (result && currentStep < items.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    const finalSetData = data.cubes[0];
    const itemsToUpdate = data.cubes.map(item => ({
      ...item,
      machineUsed: finalSetData.machineUsed,
      recordedTemperature: finalSetData.recordedTemperature,
      certificateNumber: finalSetData.certificateNumber,
      comment: finalSetData.comment,
      technician: finalSetData.technician,
      dateOfIssue: finalSetData.dateOfIssue,
      issueIdSerialNo: finalSetData.issueIdSerialNo,
      takenBy: finalSetData.takenBy,
      date: finalSetData.date,
      contact: finalSetData.contact,
    }));

    const changedItems = itemsToUpdate.filter((updatedItem, index) => {
      const originalItem = originalItems[index];
      const checkOriginal = {...originalItem, ...finalSetData};
      return !isEqual(checkOriginal, updatedItem);
    });

    if (changedItems.length > 0) {
      onBatchUpdate(changedItems as ConcreteCube[]);
    } else {
      onOpenChange(false);
    }
  };

  const handleCloseAttempt = () => {
    const currentFormValues = form.getValues().cubes;
    const hasUnsavedChanges = !isEqual(originalItems, currentFormValues);
    
    if (hasUnsavedChanges) {
      setIsConfirmingClose(true);
    } else {
      onOpenChange(false);
    }
  };
  
  const progress = (currentStep / items.length) * 100;
  
  const isFinalStep = currentStep === items.length;

  return (
    <>
      <Dialog open={true} onOpenChange={(open) => { if (!open) handleCloseAttempt(); }}>
        <DialogContent 
            className="max-w-3xl max-h-[90vh] flex flex-col"
            onInteractOutside={(e) => { e.preventDefault(); handleCloseAttempt(); }}
        >
          <DialogHeader>
            <DialogTitle>
                {isFinalStep ? "Final Details for Set" : `Test Concrete Cubes (${currentStep + 1} of ${items.length})`}
            </DialogTitle>
            <DialogDescription>
                {isFinalStep ? "Enter the information common to all samples in this set." : "Enter the test results for the selected concrete cube samples."}
            </DialogDescription>
            <Progress value={isFinalStep ? 100 : progress} className="mt-2" />
          </DialogHeader>
          <ScrollArea className="flex-grow pr-6 -mr-6">
            <form id="test-cubes-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {!isFinalStep && currentItem ? (
             <>
                <div className="space-y-4 p-4 border rounded-lg bg-muted/50">
                    <h4 className="font-semibold text-lg mb-2">Sample Information</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                    <div><Label>Client:</Label><p>{currentItem.client}</p></div>
                    <div><Label>Project:</Label><p>{currentItem.project}</p></div>
                    <div><Label>Sample ID:</Label><p className="font-mono">{currentItem.sampleId}</p></div>
                    <div><Label>Casting Date:</Label><p>{currentItem.castingDate}</p></div>
                    <div><Label>Testing Date:</Label><p>{currentItem.testingDate}</p></div>
                    <div><Label>Age (Days):</Label><p>{currentItem.ageDays}</p></div>
                    </div>
                </div>
                
                <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor={`cubes.${currentStep}.dimensions.length`}>Length (mm)</Label>
                        <Input id={`cubes.${currentStep}.dimensions.length`} {...form.register(`cubes.${currentStep}.dimensions.length`)} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor={`cubes.${currentStep}.dimensions.width`}>Width (mm)</Label>
                        <Input id={`cubes.${currentStep}.dimensions.width`} {...form.register(`cubes.${currentStep}.dimensions.width`)} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor={`cubes.${currentStep}.dimensions.height`}>Height (mm)</Label>
                        <Input id={`cubes.${currentStep}.dimensions.height`} {...form.register(`cubes.${currentStep}.dimensions.height`)} />
                    </div>
                    </div>
                    <Separator />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor={`cubes.${currentStep}.weightKg`}>Weight (kg)</Label>
                        <Input id={`cubes.${currentStep}.weightKg`} type="number" step="any" {...form.register(`cubes.${currentStep}.weightKg`)} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor={`cubes.${currentStep}.loadKN`}>Load (kN)</Label>
                        <Input id={`cubes.${currentStep}.loadKN`} type="number" step="any" {...form.register(`cubes.${currentStep}.loadKN`)} />
                    </div>
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor={`cubes.${currentStep}.modeOfFailure`}>Mode of Failure</Label>
                        <Input id={`cubes.${currentStep}.modeOfFailure`} {...form.register(`cubes.${currentStep}.modeOfFailure`)} />
                    </div>
                </div>
             </>
            ) : (
                <div className="space-y-4 p-2">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2"><Label>Machine Used</Label><Input {...form.register('cubes.0.machineUsed')} /></div>
                        <div className="space-y-2"><Label>Recorded Temperature (°C)</Label><Input {...form.register('cubes.0.recordedTemperature')} /></div>
                        <div className="space-y-2 md:col-span-2"><Label>Comment</Label><Input {...form.register('cubes.0.comment')} /></div>
                        <div className="space-y-2"><Label>Technician</Label><Input {...form.register('cubes.0.technician')} /></div>
                        <div className="space-y-2"><Label>Certificate Number</Label><Input {...form.register('cubes.0.certificateNumber')} /></div>
                        <div className="space-y-2"><Label>Date of Issue</Label><Input type="date" {...form.register('cubes.0.dateOfIssue')} /></div>
                        <div className="space-y-2"><Label>Issue ID/Serial No.</Label><Input {...form.register('cubes.0.issueIdSerialNo')} /></div>
                        <div className="space-y-2"><Label>Taken By</Label><Input {...form.register('cubes.0.takenBy')} /></div>
                        <div className="space-y-2"><Label>Date</Label><Input type="date" {...form.register('cubes.0.date')} /></div>
                         <div className="space-y-2"><Label>Contact</Label><Input {...form.register('cubes.0.contact')} /></div>
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
                <Button type="submit" form="test-cubes-form">Finish & Save All</Button>
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
