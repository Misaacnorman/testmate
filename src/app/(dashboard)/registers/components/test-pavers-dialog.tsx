"use client";

import { useEffect, useState } from "react";
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
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";


const itemSchema = z.object({
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
  certificateNumber: z.string().optional(),
  comment: z.string().optional(),
  technician: z.string().optional(),
  dateOfIssue: z.string().optional(),
});

type TestPaversDialogProps = {
  items: Paver[];
  onOpenChange: (open: boolean) => void;
  onBatchUpdate: (items: Paver[]) => void;
};

export function TestPaversDialog({ items, onOpenChange, onBatchUpdate }: TestPaversDialogProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [updatedItems, setUpdatedItems] = useState<Record<string, Partial<Paver>>>({});
  const [isConfirmingClose, setIsConfirmingClose] = useState(false);
  
  const currentItem = items[currentStep];
  const form = useForm<z.infer<typeof itemSchema>>({
    resolver: zodResolver(itemSchema),
  });

  useEffect(() => {
    const itemToLoad = items[currentStep];
    const updatesForThisItem = updatedItems[itemToLoad.id] || {};
    form.reset({
      dimensions: updatesForThisItem.dimensions ?? itemToLoad.dimensions,
      areaOfUse: updatesForThisItem.areaOfUse ?? itemToLoad.areaOfUse,
      paverType: updatesForThisItem.paverType ?? itemToLoad.paverType,
      paversPerSqMetre: updatesForThisItem.paversPerSqMetre ?? itemToLoad.paversPerSqMetre,
      calculatedArea: updatesForThisItem.calculatedArea ?? itemToLoad.calculatedArea,
      weightKg: updatesForThisItem.weightKg ?? itemToLoad.weightKg,
      loadKN: updatesForThisItem.loadKN ?? itemToLoad.loadKN,
      machineUsed: updatesForThisItem.machineUsed ?? itemToLoad.machineUsed,
      modeOfFailure: updatesForThisItem.modeOfFailure ?? itemToLoad.modeOfFailure,
      recordedTemperature: updatesForThisItem.recordedTemperature ?? itemToLoad.recordedTemperature,
      certificateNumber: updatesForThisItem.certificateNumber ?? itemToLoad.certificateNumber,
      comment: updatesForThisItem.comment ?? itemToLoad.comment,
      technician: updatesForThisItem.technician ?? itemToLoad.technician,
      dateOfIssue: updatesForThisItem.dateOfIssue ?? itemToLoad.dateOfIssue,
    });
  }, [currentStep, items, form, updatedItems]);

  const saveCurrentStep = () => {
    const currentValues = form.getValues();
    const existingItemData = items[currentStep];
    
    setUpdatedItems(prev => ({
        ...prev,
        [existingItemData.id]: {
            ...existingItemData,
            ...currentValues
        }
    }));
  }

  const handleNext = () => {
    saveCurrentStep();
    if (currentStep < items.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    saveCurrentStep();
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    saveCurrentStep();
    setUpdatedItems(currentUpdates => {
        const finalItemsToUpdate = Object.values(currentUpdates).filter(item => Object.keys(item).length > 1) as Paver[];
        if(finalItemsToUpdate.length > 0) {
            onBatchUpdate(finalItemsToUpdate);
        } else {
            onOpenChange(false);
        }
        return currentUpdates;
    });
  };

  const handleCloseAttempt = () => {
    saveCurrentStep();
    const hasUnsavedChanges = Object.keys(updatedItems).length > 0;
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
        className="max-w-3xl max-h-[90vh] flex flex-col"
        onInteractOutside={(e) => { e.preventDefault(); handleCloseAttempt(); }}
        >
        <DialogHeader>
          <DialogTitle>Test Pavers ({currentStep + 1} of {items.length})</DialogTitle>
          <DialogDescription>
            Enter the test results for the selected samples.
          </DialogDescription>
           <Progress value={progress} className="mt-2" />
        </DialogHeader>
        <ScrollArea className="flex-grow pr-6 -mr-6">
          <form className="space-y-6">
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
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2"><Label>Length (mm)</Label><Input {...form.register("dimensions.length")} /></div>
                <div className="space-y-2"><Label>Width (mm)</Label><Input {...form.register("dimensions.width")} /></div>
                <div className="space-y-2"><Label>Height (mm)</Label><Input {...form.register("dimensions.height")} /></div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Weight (kg)</Label><Input type="number" step="any" {...form.register("weightKg")} /></div>
                <div className="space-y-2"><Label>Load (kN)</Label><Input type="number" step="any" {...form.register("loadKN")} /></div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                 <div className="space-y-2"><Label>Area of Use</Label><Input {...form.register("areaOfUse")} /></div>
                 <div className="space-y-2"><Label>Paver Type</Label><Input {...form.register("paverType")} /></div>
                 <div className="space-y-2"><Label>Pavers per m²</Label><Input type="number" {...form.register("paversPerSqMetre")} /></div>
              </div>
               <div className="space-y-2"><Label>Calculated Area (mm²)</Label><Input type="number" step="any" {...form.register("calculatedArea")} /></div>
              <Separator/>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Machine Used</Label><Input {...form.register("machineUsed")} /></div>
                <div className="space-y-2"><Label>Mode of Failure</Label><Input {...form.register("modeOfFailure")} /></div>
              </div>
              <div className="space-y-2"><Label>Comment</Label><Input {...form.register("comment")} /></div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Technician</Label><Input {...form.register("technician")} /></div>
                <div className="space-y-2"><Label>Recorded Temperature (°C)</Label><Input {...form.register("recordedTemperature")} /></div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Date of Issue</Label><Input {...form.register("dateOfIssue")} placeholder="YYYY-MM-DD"/></div>
                <div className="space-y-2"><Label>Certificate Number</Label><Input {...form.register("certificateNumber")} /></div>
              </div>
            </div>
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
              <Button type="button" onClick={handleSubmit}>Finish & Save All</Button>
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
