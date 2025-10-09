
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
import type { ConcreteCubeRegisterEntry, CylinderRegisterEntry, CorrectionFactorMachine, SampleTestResult } from "@/lib/types";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/context/auth-context";

type SampleSet = ConcreteCubeRegisterEntry | CylinderRegisterEntry;

interface TestDialogProps {
  isOpen: boolean;
  onClose: () => void;
  sampleSet: SampleSet;
  onSubmit: (results: SampleTestResult[], machineUsed: string, temperature: number) => Promise<void>;
  machines: CorrectionFactorMachine[];
}

const areResultsDirty = (initial: SampleTestResult[], current: SampleTestResult[]) => {
    return JSON.stringify(initial) !== JSON.stringify(current);
};

const FAILURE_MODES = [
    "Satisfactory",
    "Unsatisfactory (1)",
    "Unsatisfactory (2)",
    "Unsatisfactory (3)",
    "Unsatisfactory (4)",
    "Unsatisfactory (5)",
    "Unsatisfactory (6)",
    "Unsatisfactory (7)",
    "Unsatisfactory (8)",
    "Unsatisfactory (9)",
];


export function TestDialog({ isOpen, onClose, sampleSet, onSubmit, machines }: TestDialogProps) {
  const [step, setStep] = React.useState(0);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isCloseConfirmOpen, setIsCloseConfirmOpen] = React.useState(false);
  const isCylinder = 'class' in sampleSet && sampleSet.receiptId.toLowerCase().includes('cyl');
  const { user, laboratory } = useAuth();


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
        diameter: existing?.diameter ?? undefined,
        weight: existing?.weight ?? undefined,
        load: existing?.load ?? undefined,
        correctedFailureLoad: existing?.correctedFailureLoad ?? undefined,
        modeOfFailure: existing?.modeOfFailure || 'Satisfactory',
      }
    }), [sortedSampleIds, sampleSet.results]
  );

  const [results, setResults] = React.useState<SampleTestResult[]>(initialResultsState);
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

  const handleResultChange = (field: keyof Omit<SampleTestResult, 'sampleId'>, value: string) => {
    const newResults = [...results];
    const currentResult = { ...newResults[step] };
    if (field === 'modeOfFailure') {
      currentResult[field] = value;
    } else {
      const numValue = value === '' ? undefined : parseFloat(value);
      (currentResult as any)[field] = isNaN(numValue!) ? undefined : numValue;
    }
    
    if (field === 'load') {
        const machine = machines.find(m => m.id === machineUsed);
        const loadValue = value === '' ? undefined : parseFloat(value);
        if (machine && loadValue !== undefined) {
            currentResult.correctedFailureLoad = (machine.factorM * loadValue) + machine.factorC;
        } else {
            currentResult.correctedFailureLoad = undefined;
        }
    }

    newResults[step] = currentResult;
    setResults(newResults);
  };
  
  const handleFormatNumber = (field: keyof Omit<SampleTestResult, 'sampleId'>, decimals: number) => {
    const newResults = [...results];
    const currentResult = { ...newResults[step] };
    const value = (currentResult as any)[field];
    
    if (value !== undefined && value !== null && !isNaN(value)) {
      (currentResult as any)[field] = parseFloat(value.toFixed(decimals));
    }
    
    newResults[step] = currentResult;
    setResults(newResults);
  };
  
  const handleMachineChange = (machineId: string) => {
    setMachineUsed(machineId);
    const machine = machines.find(m => m.id === machineId);
    if (!machine) return;

    // Recalculate for all samples in the set when machine changes
    const newResults = results.map(result => {
        const updatedResult = {...result};
        if (updatedResult.load !== undefined && updatedResult.load !== null) {
             updatedResult.correctedFailureLoad = (machine.factorM * updatedResult.load) + machine.factorC;
        }
        return updatedResult;
    });
    setResults(newResults);
  }

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
    const sanitizedResults = results.map(r => ({
      ...r,
      length: r.length ?? null,
      width: r.width ?? null,
      height: r.height ?? null,
      diameter: r.diameter ?? null,
      weight: r.weight ?? null,
      load: r.load ?? null,
      correctedFailureLoad: r.correctedFailureLoad ?? null,
    }));
    await onSubmit(sanitizedResults, machineUsed, temperature);
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
      <DialogContent className="max-w-xl h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Enter Test Results</DialogTitle>
          <DialogDescription>
            Step {step + 1} of {totalSteps}: Results for Sample ID: <span className="font-bold">{currentSampleId}</span>
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="flex-grow pr-6 -mr-6">
            <div className="space-y-4 py-4">
                {isCylinder ? (
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Diameter (mm)</Label>
                            <Input type="number" value={results[step]?.diameter ?? ''} onChange={(e) => handleResultChange('diameter', e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label>Height (mm)</Label>
                            <Input type="number" value={results[step]?.height ?? ''} onChange={(e) => handleResultChange('height', e.target.value)} />
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-3 gap-4">
                        <div className="space-y-2">
                            <Label>Length (mm)</Label>
                            <Input type="number" value={results[step]?.length ?? ''} onChange={(e) => handleResultChange('length', e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label>Width (mm)</Label>
                            <Input type="number" value={results[step]?.width ?? ''} onChange={(e) => handleResultChange('width', e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label>Height (mm)</Label>
                            <Input type="number" value={results[step]?.height ?? ''} onChange={(e) => handleResultChange('height', e.target.value)} />
                        </div>
                    </div>
                )}
                 <div className="space-y-2">
                    <Label>Weight (kg)</Label>
                    <Input 
                        type="number" 
                        step="0.01"
                        value={results[step]?.weight ?? ''} 
                        onChange={(e) => handleResultChange('weight', e.target.value)}
                        onBlur={() => handleFormatNumber('weight', 2)}
                    />
                </div>
                 <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label>Failure Load (kN)</Label>
                        <Input 
                            type="number" 
                            step="0.1"
                            value={results[step]?.load ?? ''} 
                            onChange={(e) => handleResultChange('load', e.target.value)}
                            onBlur={() => handleFormatNumber('load', 1)}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Corrected Failure Load (kN)</Label>
                        <Input type="number" value={results[step]?.correctedFailureLoad?.toFixed(2) ?? ''} readOnly disabled />
                    </div>
                </div>
                 <div className="space-y-2">
                    <Label>Mode of Failure</Label>
                    <Select value={results[step]?.modeOfFailure ?? ''} onValueChange={(value) => handleResultChange('modeOfFailure', value)}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select mode of failure..." />
                        </SelectTrigger>
                        <SelectContent>
                            {FAILURE_MODES.map(mode => (
                                <SelectItem key={mode} value={mode}>{mode}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {step === totalSteps - 1 && (
                    <div className="space-y-4 pt-4 border-t">
                         <div className="space-y-2">
                            <Label>Machine Used</Label>
                            <Select value={machineUsed} onValueChange={handleMachineChange}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a machine..." />
                                </SelectTrigger>
                                <SelectContent>
                                    {machines.map(m => (
                                        <SelectItem key={m.id} value={m.id}>{m.name} ({m.tagId})</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
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
              <Button onClick={handleFormSubmit} disabled={isSubmitting || !machineUsed}>
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
