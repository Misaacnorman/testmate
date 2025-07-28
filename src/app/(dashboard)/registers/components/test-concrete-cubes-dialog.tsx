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
import { ConcreteCube } from "@/types/concrete-cube";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";


const cubeSchema = z.object({
  dimensions: z.object({
    length: z.coerce.number().optional(),
    width: z.coerce.number().optional(),
    height: z.coerce.number().optional(),
  }).optional(),
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

type TestConcreteCubesDialogProps = {
  cubes: ConcreteCube[];
  onOpenChange: (open: boolean) => void;
  onBatchUpdate: (cubes: ConcreteCube[]) => void;
};

export function TestConcreteCubesDialog({ cubes, onOpenChange, onBatchUpdate }: TestConcreteCubesDialogProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [updatedCubes, setUpdatedCubes] = useState<Record<string, Partial<ConcreteCube>>>({});
  const [isConfirmingClose, setIsConfirmingClose] = useState(false);
  
  const currentCube = cubes[currentStep];
  const form = useForm<z.infer<typeof cubeSchema>>({
    resolver: zodResolver(cubeSchema),
  });

  useEffect(() => {
    const cubeToLoad = cubes[currentStep];
    const updatesForThisCube = updatedCubes[cubeToLoad.id] || {};
    form.reset({
      dimensions: updatesForThisCube.dimensions ?? cubeToLoad.dimensions,
      weightKg: updatesForThisCube.weightKg ?? cubeToLoad.weightKg,
      loadKN: updatesForThisCube.loadKN ?? cubeToLoad.loadKN,
      machineUsed: updatesForThisCube.machineUsed ?? cubeToLoad.machineUsed,
      modeOfFailure: updatesForThisCube.modeOfFailure ?? cubeToLoad.modeOfFailure,
      recordedTemperature: updatesForThisCube.recordedTemperature ?? cubeToLoad.recordedTemperature,
      certificateNumber: updatesForThisCube.certificateNumber ?? cubeToLoad.certificateNumber,
      comment: updatesForThisCube.comment ?? cubeToLoad.comment,
      technician: updatesForThisCube.technician ?? cubeToLoad.technician,
      dateOfIssue: updatesForThisCube.dateOfIssue ?? cubeToLoad.dateOfIssue,
    });
  }, [currentStep, cubes, form, updatedCubes]);

  const saveCurrentStep = () => {
    const currentValues = form.getValues();
    const existingCubeData = cubes[currentStep];
    
    // Check if any value has actually changed
    const hasChanged = Object.keys(currentValues).some(key => 
        JSON.stringify((currentValues as any)[key]) !== JSON.stringify((form.formState.defaultValues as any)[key])
    );

    if (hasChanged) {
        setUpdatedCubes(prev => ({
            ...prev,
            [existingCubeData.id]: {
                ...existingCubeData,
                ...currentValues
            }
        }));
    }
  }

  const handleNext = () => {
    saveCurrentStep();
    if (currentStep < cubes.length - 1) {
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
    // Use a callback with setUpdatedCubes to ensure we have the latest state before submitting
    setUpdatedCubes(currentUpdates => {
        const finalCubesToUpdate = Object.values(currentUpdates).filter(cube => Object.keys(cube).length > 1) as ConcreteCube[];
        if (finalCubesToUpdate.length > 0) {
            onBatchUpdate(finalCubesToUpdate);
        } else {
            onOpenChange(false); // Close if no changes were made
        }
        return currentUpdates; // Return the state unchanged
    });
  };

  const handleCloseAttempt = () => {
    saveCurrentStep();
    const hasUnsavedChanges = Object.keys(updatedCubes).length > 0;
    if (hasUnsavedChanges) {
      setIsConfirmingClose(true);
    } else {
      onOpenChange(false);
    }
  };
  
  const progress = ((currentStep + 1) / cubes.length) * 100;

  return (
    <>
      <Dialog 
        open={true} 
        onOpenChange={(open) => {
            if(!open) {
                handleCloseAttempt();
            }
        }}
      >
        <DialogContent 
            className="max-w-3xl max-h-[90vh] flex flex-col"
            onInteractOutside={(e) => { e.preventDefault(); handleCloseAttempt(); }}
        >
          <DialogHeader>
            <DialogTitle>Test Concrete Cubes ({currentStep + 1} of {cubes.length})</DialogTitle>
            <DialogDescription>
              Enter the test results for the selected concrete cube samples.
            </DialogDescription>
            <Progress value={progress} className="mt-2" />
          </DialogHeader>
          <ScrollArea className="flex-grow pr-6 -mr-6">
            <form className="space-y-6">
              <div className="space-y-4 p-4 border rounded-lg bg-muted/50">
                <h4 className="font-semibold text-lg mb-2">Sample Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                  <div><Label>Client:</Label><p>{currentCube.client}</p></div>
                  <div><Label>Project:</Label><p>{currentCube.project}</p></div>
                  <div><Label>Sample ID:</Label><p className="font-mono">{currentCube.sampleId}</p></div>
                  <div><Label>Casting Date:</Label><p>{currentCube.castingDate}</p></div>
                  <div><Label>Testing Date:</Label><p>{currentCube.testingDate}</p></div>
                  <div><Label>Age (Days):</Label><p>{currentCube.ageDays}</p></div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="dimensions.length">Length (mm)</Label>
                    <Input id="dimensions.length" {...form.register("dimensions.length")} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dimensions.width">Width (mm)</Label>
                    <Input id="dimensions.width" {...form.register("dimensions.width")} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dimensions.height">Height (mm)</Label>
                    <Input id="dimensions.height" {...form.register("dimensions.height")} />
                  </div>
                </div>
                <Separator />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                      <Label htmlFor="weightKg">Weight (kg)</Label>
                      <Input id="weightKg" type="number" step="any" {...form.register("weightKg")} />
                  </div>
                  <div className="space-y-2">
                      <Label htmlFor="loadKN">Load (kN)</Label>
                      <Input id="loadKN" type="number" step="any" {...form.register("loadKN")} />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                      <Label htmlFor="machineUsed">Machine Used</Label>
                      <Input id="machineUsed" {...form.register("machineUsed")} />
                  </div>
                  <div className="space-y-2">
                      <Label htmlFor="modeOfFailure">Mode of Failure</Label>
                      <Input id="modeOfFailure" {...form.register("modeOfFailure")} />
                  </div>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="comment">Comment</Label>
                    <Input id="comment" {...form.register("comment")} />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                      <Label htmlFor="technician">Technician</Label>
                      <Input id="technician" {...form.register("technician")} />
                  </div>
                  <div className="space-y-2">
                      <Label htmlFor="recordedTemperature">Recorded Temperature (°C)</Label>
                      <Input id="recordedTemperature" {...form.register("recordedTemperature")} />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                      <Label htmlFor="dateOfIssue">Date of Issue</Label>
                      <Input id="dateOfIssue" {...form.register("dateOfIssue")} placeholder="YYYY-MM-DD"/>
                  </div>
                  <div className="space-y-2">
                      <Label htmlFor="certificateNumber">Certificate Number</Label>
                      <Input id="certificateNumber" {...form.register("certificateNumber")} />
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
              <Button type="button" variant="outline" onClick={handleBack} disabled={currentStep === 0}>Back</Button>
              {currentStep < cubes.length - 1 ? (
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
