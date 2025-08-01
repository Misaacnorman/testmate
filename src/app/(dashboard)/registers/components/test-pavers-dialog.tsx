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
import { Paver } from "@/types/paver";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
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
  const [currentStep, setCurrentStep] = useState(0);
  const [isConfirmingClose, setIsConfirmingClose] = useState(false);
  
  // Memoize the original items to have a stable reference for comparison
  const originalItems = useMemo(() => items, []);
  
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
  
  const currentItem = originalItems[currentStep];

  const handleNext = () => {
    if (currentStep < items.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    // Compare submitted data with original data to find what has changed
    const changedItems = data.pavers.filter((updatedItem, index) => {
      const originalItem = originalItems[index];
      return !isEqual(originalItem, updatedItem);
    });

    if (changedItems.length > 0) {
      onBatchUpdate(changedItems as Paver[]);
    } else {
      onOpenChange(false); // No changes, just close
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
  
  const progress = ((currentStep + 1) / items.length) * 100;

  return (
    <>
      <Dialog open={true} onOpenChange={(open) => { if (!open) handleCloseAttempt(); }}>
        <DialogContent 
          className="max-w-4xl max-h-[90vh] flex flex-col"
          onInteractOutside={(e) => { e.preventDefault(); handleCloseAttempt(); }}
          >
          <DialogHeader>
            <DialogTitle>Test Pavers ({currentStep + 1} of {items.length})</DialogTitle>
            <DialogDescription>
              Enter the test results for the selected samples. Use the accordions to enter data.
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
              
              <Accordion type="multiple" defaultValue={['results']} className="w-full">
                <AccordionItem value="results">
                  <AccordionTrigger className="font-semibold text-lg">Test Results</AccordionTrigger>
                  <AccordionContent className="p-1">
                    <div className="space-y-4 p-4 border rounded-lg">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2"><Label>Length (mm)</Label><Input type="number" step="any" {...form.register(`pavers.${currentStep}.dimensions.length`)} /></div>
                        <div className="space-y-2"><Label>Width (mm)</Label><Input type="number" step="any" {...form.register(`pavers.${currentStep}.dimensions.width`)} /></div>
                        <div className="space-y-2"><Label>Height (mm)</Label><Input type="number" step="any" {...form.register(`pavers.${currentStep}.dimensions.height`)} /></div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2"><Label>Weight (kg)</Label><Input type="number" step="any" {...form.register(`pavers.${currentStep}.weightKg`)} /></div>
                        <div className="space-y-2"><Label>Load (kN)</Label><Input type="number" step="any" {...form.register(`pavers.${currentStep}.loadKN`)} /></div>
                        <div className="space-y-2"><Label>Calculated Area (mm²)</Label><Input type="number" step="any" {...form.register(`pavers.${currentStep}.calculatedArea`)} /></div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2"><Label>Area of Use</Label><Input {...form.register(`pavers.${currentStep}.areaOfUse`)} /></div>
                        <div className="space-y-2"><Label>Paver Type</Label><Input {...form.register(`pavers.${currentStep}.paverType`)} /></div>
                        <div className="space-y-2"><Label>Pavers per m²</Label><Input type="number" {...form.register(`pavers.${currentStep}.paversPerSqMetre`)} /></div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2"><Label>Machine Used</Label><Input {...form.register(`pavers.${currentStep}.machineUsed`)} /></div>
                        <div className="space-y-2"><Label>Mode of Failure</Label><Input {...form.register(`pavers.${currentStep}.modeOfFailure`)} /></div>
                      </div>
                      <div className="space-y-2"><Label>Recorded Temp. (°C)</Label><Input {...form.register(`pavers.${currentStep}.recordedTemperature`)} /></div>
                      <div className="space-y-2"><Label>Comment</Label><Textarea {...form.register(`pavers.${currentStep}.comment`)} /></div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="issuance">
                  <AccordionTrigger className="font-semibold text-lg">Issuance Details</AccordionTrigger>
                  <AccordionContent className="p-1">
                    <div className="space-y-4 p-4 border rounded-lg">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2"><Label>Technician</Label><Input {...form.register(`pavers.${currentStep}.technician`)} /></div>
                        <div className="space-y-2"><Label>Certificate Number</Label><Input {...form.register(`pavers.${currentStep}.certificateNumber`)} /></div>
                        <div className="space-y-2"><Label>Date of Issue</Label><Input {...form.register(`pavers.${currentStep}.dateOfIssue`)} placeholder="YYYY-MM-DD"/></div>
                        <div className="space-y-2"><Label>Issue ID/Serial No.</Label><Input {...form.register(`pavers.${currentStep}.issueIdSerialNo`)} /></div>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </form>
          </ScrollArea>
          <DialogFooter className="pt-4 justify-between">
            <div>
              <Button type="button" variant="ghost" onClick={handleCloseAttempt}>Cancel</Button>
            </div>
            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={handleBack} disabled={currentStep === 0}>Back</Button>
              {currentStep < items.length - 1 ? (
                <Button type="button" onClick={handleNext}>Next</Button>
              ) : (
                <Button type="submit" form="test-pavers-form">Finish & Save All</Button>
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
