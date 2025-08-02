
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

  const originalItems = useMemo(() => items.map(item => ({
      id: item.id,
      dimensions: item.dimensions,
      weightKg: item.weightKg,
      loadKN: item.loadKN,
      modeOfFailure: item.modeOfFailure,
  })), [items]);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      cubes: items,
    }
  });
  
  const { trigger, getValues } = form;
  const currentItem = items[currentStep];

  const handleNext = async () => {
    const result = await trigger(`cubes.${currentStep}`);
    if (result && currentStep < items.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    const itemsToUpdate = items.map((originalItem, index) => ({
      ...originalItem,
      ...data.cubes[index],
    }));

    const changedItems = itemsToUpdate.filter((updatedItem, index) => {
      return !isEqual(items[index], updatedItem);
    });

    if (changedItems.length > 0) {
      onBatchUpdate(changedItems as ConcreteCube[]);
    } else {
      onOpenChange(false);
    }
  };

  const handleCloseAttempt = () => {
    const currentFormValues = getValues().cubes;
    const hasUnsavedChanges = !isEqual(originalItems, currentFormValues);
    
    if (hasUnsavedChanges) {
      setIsConfirmingClose(true);
    } else {
      onOpenChange(false);
    }
  };
  
  const progress = (currentStep / (items.length -1)) * 100;
  
  const isFinalStep = currentStep === items.length - 1;

  return (
    <>
      <Dialog open={true} onOpenChange={(open) => { if (!open) handleCloseAttempt(); }}>
        <DialogContent 
            className="max-w-3xl max-h-[90vh] flex flex-col"
            onInteractOutside={(e) => { e.preventDefault(); handleCloseAttempt(); }}
        >
          <DialogHeader>
            <DialogTitle>
                Test Concrete Cubes ({currentStep + 1} of {items.length})
            </DialogTitle>
            <DialogDescription>
                Enter the test results for the selected concrete cube samples.
            </DialogDescription>
            <Progress value={progress} className="mt-2" />
          </DialogHeader>
          <ScrollArea className="flex-grow pr-6 -mr-6">
            <form id="test-cubes-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {currentItem && (
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
            )}
            </form>
          </ScrollArea>
          <DialogFooter className="pt-4 justify-between">
            <div>
              <Button type="button" variant="ghost" onClick={handleCloseAttempt}>Cancel</Button>
            </div>
            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={handleBack} disabled={currentStep === 0}>Back</Button>
              {isFinalStep ? (
                <Button type="submit" form="test-cubes-form">Finish & Save All</Button>
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
