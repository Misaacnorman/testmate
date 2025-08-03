
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
  machineUsed: z.string().optional(),
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
      machineUsed: item.machineUsed,
  })), [items]);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      cubes: items,
    }
  });
  
  const { trigger, getValues } = form;
  const currentItem = items[currentStep];
  const isFinalStep = currentStep === items.length - 1;

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
      const originalItemSubset = originalItems[index];
      const updatedItemSubset = {
        id: updatedItem.id,
        dimensions: updatedItem.dimensions,
        weightKg: updatedItem.weightKg,
        loadKN: updatedItem.loadKN,
        modeOfFailure: updatedItem.modeOfFailure,
        machineUsed: updatedItem.machineUsed,
      };
      return !isEqual(originalItemSubset, updatedItemSubset);
    });

    if (changedItems.length > 0) {
      onBatchUpdate(changedItems as ConcreteCube[]);
    } else {
      onOpenChange(false);
    }
  };

  const handleCloseAttempt = () => {
    const currentFormValues = getValues().cubes.map(c => ({
        id: c.id,
        dimensions: c.dimensions,
        weightKg: c.weightKg,
        loadKN: c.loadKN,
        modeOfFailure: c.modeOfFailure,
        machineUsed: c.machineUsed,
    }));
    const hasUnsavedChanges = !isEqual(originalItems, currentFormValues);
    
    if (hasUnsavedChanges) {
      setIsConfirmingClose(true);
    } else {
      onOpenChange(false);
    }
  };
  
  const progress = (currentStep / (items.length -1)) * 100;

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
          <div className="flex-grow overflow-y-auto pr-6 -mr-6">
            <form id="test-cubes-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {currentItem && (
             <div className="p-1">
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
                
                <div className="space-y-4 mt-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor={`cubes.${currentStep}.dimensions.length`}>Length (mm)</Label>
                        <Input type="text" inputMode="decimal" id={`cubes.${currentStep}.dimensions.length`} {...form.register(`cubes.${currentStep}.dimensions.length`)} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor={`cubes.${currentStep}.dimensions.width`}>Width (mm)</Label>
                        <Input type="text" inputMode="decimal" id={`cubes.${currentStep}.dimensions.width`} {...form.register(`cubes.${currentStep}.dimensions.width`)} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor={`cubes.${currentStep}.dimensions.height`}>Height (mm)</Label>
                        <Input type="text" inputMode="decimal" id={`cubes.${currentStep}.dimensions.height`} {...form.register(`cubes.${currentStep}.dimensions.height`)} />
                    </div>
                    </div>
                    <Separator />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor={`cubes.${currentStep}.weightKg`}>Weight (kg)</Label>
                        <Input type="text" inputMode="decimal" id={`cubes.${currentStep}.weightKg`} {...form.register(`cubes.${currentStep}.weightKg`)} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor={`cubes.${currentStep}.loadKN`}>Load (kN)</Label>
                        <Input type="text" inputMode="decimal" id={`cubes.${currentStep}.loadKN`} {...form.register(`cubes.${currentStep}.loadKN`)} />
                    </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor={`cubes.${currentStep}.modeOfFailure`}>Mode of Failure</Label>
                            <Input id={`cubes.${currentStep}.modeOfFailure`} {...form.register(`cubes.${currentStep}.modeOfFailure`)} />
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor={`cubes.${currentStep}.machineUsed`}>Machine Used</Label>
                            <Input id={`cubes.${currentStep}.machineUsed`} {...form.register(`cubes.${currentStep}.machineUsed`)} />
                        </div>
                    </div>
                </div>
             </div>
            )}
            </form>
          </div>
          <DialogFooter className="pt-4 border-t">
            <div className="flex justify-between w-full">
              <Button type="button" variant="ghost" onClick={handleCloseAttempt}>Cancel</Button>
              <div className="flex gap-2">
                <Button type="button" variant="outline" onClick={handleBack} disabled={currentStep === 0}>Back</Button>
                {isFinalStep ? (
                  <Button type="submit" form="test-cubes-form">Finish & Save All</Button>
                ) : (
                  <Button type="button" onClick={handleNext}>Next</Button>
                )}
              </div>
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
