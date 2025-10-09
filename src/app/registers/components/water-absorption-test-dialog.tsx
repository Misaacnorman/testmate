
"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import type { WaterAbsorptionRegisterEntry, WaterAbsorptionTestResult } from "@/lib/types";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

interface WaterAbsorptionTestDialogProps {
  isOpen: boolean;
  onClose: () => void;
  sampleSet: WaterAbsorptionRegisterEntry;
  onSubmit: (results: WaterAbsorptionTestResult[], machineUsed: string, temperature: number) => Promise<void>;
}

const areResultsDirty = (initial: WaterAbsorptionTestResult[], current: WaterAbsorptionTestResult[]) => {
    return JSON.stringify(initial) !== JSON.stringify(current);
};

export function WaterAbsorptionTestDialog({ isOpen, onClose, sampleSet, onSubmit }: WaterAbsorptionTestDialogProps) {
  const [step, setStep] = React.useState(0);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isCloseConfirmOpen, setIsCloseConfirmOpen] = React.useState(false);

  const sortedSampleIds = React.useMemo(() => 
    [...sampleSet.sampleIds].sort((a, b) => {
        const numA = parseInt(a.replace(/\D/g, ''), 10) || 0;
        const numB = parseInt(b.replace(/\D/g, ''), 10) || 0;
        return numA - numB;
    }),
    [sampleSet.sampleIds]
  );
  
  const initialResultsState = React.useMemo(() => 
    sortedSampleIds.map(id => {
      const existing = sampleSet.results?.find(r => r.sampleId === id);
      return {
        sampleId: id,
        length: existing?.length ?? undefined,
        width: existing?.width ?? undefined,
        height: existing?.height ?? undefined,
        ovenDriedWeight: existing?.ovenDriedWeight ?? undefined,
        weightAfterSoaking: existing?.weightAfterSoaking ?? undefined,
        weightOfWater: existing?.weightOfWater ?? undefined,
        waterAbsorption: existing?.waterAbsorption ?? undefined,
      }
    }), [sortedSampleIds, sampleSet.results]
  );

  const [results, setResults] = React.useState<WaterAbsorptionTestResult[]>(initialResultsState);
  const [machineUsed, setMachineUsed] = React.useState(sampleSet.machineUsed || '');
  const [temperature, setTemperature] = React.useState<number>(sampleSet.temperature ?? 25);

  const isDirty = React.useMemo(() => 
      areResultsDirty(initialResultsState, results) || 
      machineUsed !== (sampleSet.machineUsed || '') ||
      temperature !== (sampleSet.temperature ?? 25),
  [initialResultsState, results, machineUsed, temperature, sampleSet]);


  React.useEffect(() => {
    if (isOpen) {
        setStep(0);
        setResults(initialResultsState);
        setMachineUsed(sampleSet.machineUsed || '');
        setTemperature(sampleSet.temperature ?? 25);
    }
  }, [isOpen, initialResultsState, sampleSet]);

  const totalSteps = sortedSampleIds.length;
  const currentSampleId = sortedSampleIds[step];

  const handleResultChange = (field: keyof Omit<WaterAbsorptionTestResult, 'sampleId'>, value: string) => {
    const newResults = [...results];
    const currentResult = { ...newResults[step] };
    
    const numValue = value === '' ? undefined : parseFloat(value);
    (currentResult as any)[field] = isNaN(numValue!) ? undefined : numValue;
    
    // Auto-calculate derived values
    if (field === 'ovenDriedWeight' || field === 'weightAfterSoaking') {
        const ovenWeight = field === 'ovenDriedWeight' ? numValue : currentResult.ovenDriedWeight;
        const soakedWeight = field === 'weightAfterSoaking' ? numValue : currentResult.weightAfterSoaking;

        if(ovenWeight !== undefined && soakedWeight !== undefined) {
            const waterWeight = soakedWeight - ovenWeight;
            currentResult.weightOfWater = waterWeight;
            currentResult.waterAbsorption = ovenWeight > 0 ? (waterWeight / ovenWeight) * 100 : 0;
        } else {
            currentResult.weightOfWater = undefined;
            currentResult.waterAbsorption = undefined;
        }
    }
    
    newResults[step] = currentResult;
    setResults(newResults);
  };
  
  const handleFormatNumber = (field: keyof Omit<WaterAbsorptionTestResult, 'sampleId'>, decimals: number) => {
    const newResults = [...results];
    const currentResult = { ...newResults[step] };
    const value = (currentResult as any)[field];
    
    if (value !== undefined && value !== null && !isNaN(value)) {
      (currentResult as any)[field] = parseFloat(value.toFixed(decimals));
      
      // Recalculate derived values if formatting weight fields
      if (field === 'ovenDriedWeight' || field === 'weightAfterSoaking') {
        const ovenWeight = currentResult.ovenDriedWeight;
        const soakedWeight = currentResult.weightAfterSoaking;
        
        if(ovenWeight !== undefined && soakedWeight !== undefined) {
            const waterWeight = soakedWeight - ovenWeight;
            currentResult.weightOfWater = waterWeight;
            currentResult.waterAbsorption = ovenWeight > 0 ? (waterWeight / ovenWeight) * 100 : 0;
        }
      }
    }
    
    newResults[step] = currentResult;
    setResults(newResults);
  };
  
  const handleNext = () => {
    if (step < totalSteps - 1) {
      setStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    if (step > 0) {
      setStep(prev => prev - 1);
    }
  };

  const handleFormSubmit = async () => {
    setIsSubmitting(true);
    await onSubmit(results, machineUsed, temperature);
    setIsSubmitting(false);
  };
  
  const attemptClose = () => {
      if (isDirty) {
          setIsCloseConfirmOpen(true);
      } else {
          onClose();
      }
  }

  const handleConfirmClose = () => {
      setIsCloseConfirmOpen(false);
      onClose();
  }

  return (
    <>
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) attemptClose(); }}>
      <DialogContent className="max-w-2xl h-[85vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Enter Water Absorption Test Results</DialogTitle>
          <DialogDescription>
            Step {step + 1} of {totalSteps}: Results for Sample ID: <span className="font-bold">{currentSampleId}</span> ({sampleSet.sampleType})
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="flex-grow pr-6 -mr-6">
            <div className="space-y-4 py-4">
                <div className="space-y-2">
                    <Label className="font-semibold">Dimensions (mm)</Label>
                    <div className="grid grid-cols-3 gap-4">
                        <div className="space-y-2">
                            <Label>Length</Label>
                            <Input type="number" value={results[step]?.length ?? ''} onChange={(e) => handleResultChange('length', e.target.value)} />
                        </div>
                         <div className="space-y-2">
                            <Label>Width</Label>
                            <Input type="number" value={results[step]?.width ?? ''} onChange={(e) => handleResultChange('width', e.target.value)} />
                        </div>
                         <div className="space-y-2">
                            <Label>Height</Label>
                            <Input type="number" value={results[step]?.height ?? ''} onChange={(e) => handleResultChange('height', e.target.value)} />
                        </div>
                    </div>
                </div>
                 
                 <Separator />
                 <div className="space-y-2">
                    <Label className="font-semibold">Weight Measurements (kg)</Label>
                     <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Oven Dried Weight Before Soaking</Label>
                            <Input 
                                type="number" 
                                step="0.01"
                                value={results[step]?.ovenDriedWeight ?? ''} 
                                onChange={(e) => handleResultChange('ovenDriedWeight', e.target.value)}
                                onBlur={() => handleFormatNumber('ovenDriedWeight', 2)}
                            />
                        </div>
                         <div className="space-y-2">
                            <Label>Weight After Soaking</Label>
                            <Input 
                                type="number" 
                                step="0.01"
                                value={results[step]?.weightAfterSoaking ?? ''} 
                                onChange={(e) => handleResultChange('weightAfterSoaking', e.target.value)}
                                onBlur={() => handleFormatNumber('weightAfterSoaking', 2)}
                            />
                        </div>
                    </div>
                </div>

                <Separator />
                 <div className="space-y-2">
                    <Label className="font-semibold">Calculated Results</Label>
                     <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Weight of Water (kg)</Label>
                            <Input type="number" value={results[step]?.weightOfWater?.toFixed(3) ?? ''} readOnly disabled />
                        </div>
                         <div className="space-y-2">
                            <Label>Water Absorption (%)</Label>
                            <Input type="number" value={results[step]?.waterAbsorption?.toFixed(2) ?? ''} readOnly disabled />
                        </div>
                    </div>
                </div>


                {step === totalSteps - 1 && (
                    <div className="space-y-4 pt-4 border-t">
                         <div className="space-y-2">
                            <Label>Machine Used (Oven/Scale)</Label>
                            <Input value={machineUsed} onChange={(e) => setMachineUsed(e.target.value)} />
                        </div>
                         <div className="space-y-2">
                            <Label>Temperature (°C)</Label>
                            <Input type="number" value={temperature} onChange={(e) => setTemperature(Number(e.target.value))} />
                        </div>
                    </div>
                )}
            </div>
        </ScrollArea>

        <DialogFooter className="mt-4 pt-4 border-t">
          <div className="flex justify-between w-full">
            <Button variant="outline" onClick={handleBack} disabled={step === 0 || isSubmitting}>
              Back
            </Button>
            {step < totalSteps - 1 ? (
              <Button onClick={handleNext}>Next</Button>
            ) : (
              <Button onClick={handleFormSubmit} disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Submit
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>

    <AlertDialog open={isCloseConfirmOpen} onOpenChange={setIsCloseConfirmOpen}>
        <AlertDialogContent>
            <AlertDialogHeader>
            <AlertDialogTitle>Discard Changes?</AlertDialogTitle>
            <AlertDialogDescription>
                You have unsaved changes. Are you sure you want to discard them and close the dialog?
            </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
            <AlertDialogCancel>No, Continue Editing</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmClose}>Yes, Discard</AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
    </AlertDialog>
    </>
  );
}
