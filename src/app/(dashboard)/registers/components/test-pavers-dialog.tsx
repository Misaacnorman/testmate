
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
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import isEqual from 'lodash.isequal';


const paverSchema = z.object({
  id: z.string(),
  dimensions: z.object({
    length: z.coerce.number().optional(),
    width: z.coerce.number().optional(),
    height: z.coerce.number().optional(),
  }).optional(),
  paversPerSqMetre: z.coerce.number().optional(),
  calculatedArea: z.coerce.number().optional(),
  weightKg: z.coerce.number().optional(),
  loadKN: z.coerce.number().optional(),
  modeOfFailure: z.string().optional(),
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
  const [isConfirmingClose, setIsConfirmingClose] = useState(false);
  
  const originalItems = useMemo(() => items.map(item => ({
      id: item.id,
      dimensions: item.dimensions,
      paversPerSqMetre: item.paversPerSqMetre,
      calculatedArea: item.calculatedArea,
      weightKg: item.weightKg,
      loadKN: item.loadKN,
      modeOfFailure: item.modeOfFailure,
  })), [items]);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      pavers: items,
    }
  });

  const { fields } = useFieldArray({
    control: form.control,
    name: "pavers",
  });
  
  const currentItem = items[activePaverIndex];
  const isFinalStep = activePaverIndex === items.length - 1;


  const handleNext = () => {
     if (activePaverIndex < items.length - 1) {
        setActivePaverIndex(activePaverIndex + 1);
     }
  }

  const handleBack = () => {
    if (activePaverIndex > 0) {
        setActivePaverIndex(activePaverIndex - 1);
    }
  }

  const onSubmit = (data: z.infer<typeof formSchema>) => {
     const itemsToUpdate = items.map((originalItem, index) => ({
      ...originalItem,
      ...data.pavers[index],
    }));

    const changedItems = itemsToUpdate.filter((updatedItem, index) => {
      return !isEqual(items[index], updatedItem);
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
  
  const progress = (activePaverIndex / (items.length - 1)) * 100;

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
              Enter the test results for the selected samples.
            </DialogDescription>
            <Progress value={progress} className="mt-2" />
          </DialogHeader>
          <ScrollArea className="flex-grow pr-6 -mr-6">
            <form id="test-pavers-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
             <div className="p-1">
              <div className="space-y-4 p-4 border rounded-lg bg-muted/50">
                <h4 className="font-semibold text-lg mb-2">Sample Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                  <div><Label>Client:</Label><p>{currentItem.client}</p></div>
                  <div><Label>Project:</Label><p>{currentItem.project}</p></div>
                  <div><Label>Sample ID:</Label><p className="font-mono">{currentItem.sampleId}</p></div>
                  <div><Label>Paver Type:</Label><p>{currentItem.paverType}</p></div>
                  <div><Label>Area of Use:</Label><p>{currentItem.areaOfUse}</p></div>
                </div>
              </div>
              
                <div className="space-y-4 p-4 border rounded-lg mt-4">
                    <h4 className="font-semibold text-lg mb-2">Test Results</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2"><Label>Length (mm)</Label><Input type="text" inputMode="decimal" {...form.register(`pavers.${activePaverIndex}.dimensions.length`)} /></div>
                      <div className="space-y-2"><Label>Width (mm)</Label><Input type="text" inputMode="decimal" {...form.register(`pavers.${activePaverIndex}.dimensions.width`)} /></div>
                      <div className="space-y-2"><Label>Height (mm)</Label><Input type="text" inputMode="decimal" {...form.register(`pavers.${activePaverIndex}.dimensions.height`)} /></div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2"><Label>Weight (kg)</Label><Input type="text" inputMode="decimal" {...form.register(`pavers.${activePaverIndex}.weightKg`)} /></div>
                      <div className="space-y-2"><Label>Load (kN)</Label><Input type="text" inputMode="decimal" {...form.register(`pavers.${activePaverIndex}.loadKN`)} /></div>
                      <div className="space-y-2"><Label>Calculated Area (mm²)</Label><Input type="text" inputMode="decimal" {...form.register(`pavers.${activePaverIndex}.calculatedArea`)} /></div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2"><Label>Pavers per m²</Label><Input type="text" inputMode="numeric" {...form.register(`pavers.${activePaverIndex}.paversPerSqMetre`)} /></div>
                       <div className="space-y-2"><Label>Mode of Failure</Label><Input {...form.register(`pavers.${activePaverIndex}.modeOfFailure`)} /></div>
                    </div>
                  </div>
              </div>
            </form>
          </ScrollArea>
          <DialogFooter className="pt-4 justify-between">
            <div>
              <Button type="button" variant="ghost" onClick={handleCloseAttempt}>Cancel</Button>
            </div>
            
            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={handleBack} disabled={activePaverIndex === 0}>Back</Button>
              {isFinalStep ? (
                <Button type="submit" form="test-pavers-form">Finish & Save All</Button>
              ) : (
                <Button type="button" onClick={handleNext}>Next</Button>
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
