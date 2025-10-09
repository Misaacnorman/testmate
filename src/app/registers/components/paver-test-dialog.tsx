

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
import type { PaverRegisterEntry, PaverTestResult, CorrectionFactorMachine } from "@/lib/types";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getCorrectionFactor } from "@/app/test-certificates/components/PaverCertificateData";


interface PaverTestDialogProps {
  isOpen: boolean;
  onClose: () => void;
  sampleSet: PaverRegisterEntry;
  onSubmit: (results: PaverTestResult[], machineUsed: string, temperature: number, paverThickness: string) => Promise<void>;
  machines: CorrectionFactorMachine[];
}

const areResultsDirty = (initial: PaverTestResult[], current: PaverTestResult[]) => {
    return JSON.stringify(initial) !== JSON.stringify(current);
};

const PAVER_THICKNESS_OPTIONS = [
    "60 mm Plain",
    "60 mm Chamfered",
    "65 mm Plain",
    "65 mm Chamfered",
    "80 mm Plain",
    "80 mm Chamfered",
    "100 mm Plain",
    "100 mm Chamfered",
]

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


export function PaverTestDialog({ isOpen, onClose, sampleSet, onSubmit, machines }: PaverTestDialogProps) {
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
      const initialArea = sampleSet.paversPerSquareMetre 
        ? 1000000 / sampleSet.paversPerSquareMetre
        : existing?.calculatedArea ?? undefined;
      
      const initialThickness = sampleSet.paverThickness ? parseInt(sampleSet.paverThickness.replace(/\D/g,'')) : existing?.measuredThickness;

      return {
        sampleId: id,
        weight: existing?.weight ?? undefined,
        load: existing?.load ?? undefined,
        correctedFailureLoad: existing?.correctedFailureLoad ?? undefined,
        modeOfFailure: existing?.modeOfFailure || 'Satisfactory',
        calculatedArea: initialArea,
        measuredThickness: initialThickness ?? undefined,
      }
    }), [sortedSampleIds, sampleSet.results, sampleSet.paversPerSquareMetre, sampleSet.paverThickness]
  );

  const [results, setResults] = React.useState<PaverTestResult[]>(initialResultsState);
  const [machineUsed, setMachineUsed] = React.useState(sampleSet.machineUsed || '');
  const [temperature, setTemperature] = React.useState<number>(sampleSet.temperature ?? 25);
  const [paverThickness, setPaverThickness] = React.useState(sampleSet.paverThickness || '');

  const isDirty = React.useMemo(() => 
      areResultsDirty(initialResultsState, results) || 
      machineUsed !== (sampleSet.machineUsed || '') ||
      paverThickness !== (sampleSet.paverThickness || '') ||
      temperature !== (sampleSet.temperature ?? 25),
  [initialResultsState, results, machineUsed, paverThickness, temperature, sampleSet]);


  React.useEffect(() => {
    if (isOpen) {
        setStep(0);
        setResults(initialResultsState);
        setMachineUsed(sampleSet.machineUsed || '');
        setTemperature(sampleSet.temperature ?? 25);
        setPaverThickness(sampleSet.paverThickness || '');
    }
  }, [isOpen, initialResultsState, sampleSet]);

  const totalSteps = sortedSampleIds.length;
  const currentSampleId = sortedSampleIds[step];

  const handleResultChange = (field: keyof Omit<PaverTestResult, 'sampleId' | 'length' | 'width' | 'height'>, value: string | number) => {
    const newResults = [...results];
    const currentResult = { ...newResults[step] };
    if (field === 'modeOfFailure') {
      currentResult[field] = String(value);
    } else {
      const numValue = value === '' ? undefined : Number(value);
      (currentResult as any)[field] = isNaN(numValue!) ? undefined : numValue;
    }
    
    // Auto-calculate corrected load for pavers
    if (field === 'load') {
        const correctionFactor = getCorrectionFactor(paverThickness);
        const loadValue = value === '' ? undefined : Number(value);
        if (loadValue !== undefined) {
             currentResult.correctedFailureLoad = loadValue * correctionFactor;
        } else {
            currentResult.correctedFailureLoad = undefined;
        }
    }

    newResults[step] = currentResult;
    setResults(newResults);
  };
  
  const handleFormatNumber = (field: keyof Omit<PaverTestResult, 'sampleId' | 'length' | 'width' | 'height'>, decimals: number) => {
    const newResults = [...results];
    const currentResult = { ...newResults[step] };
    const value = (currentResult as any)[field];
    
    if (value !== undefined && value !== null && !isNaN(value)) {
      (currentResult as any)[field] = parseFloat(value.toFixed(decimals));
    }
    
    newResults[step] = currentResult;
    setResults(newResults);
  };
  
  const handlePaverThicknessChange = (thickness: string) => {
    setPaverThickness(thickness);
    const correctionFactor = getCorrectionFactor(thickness);
    const measuredThickness = parseInt(thickness.replace(/\D/g, '')) || 0;

    const newResults = results.map(result => {
        const updatedResult = {...result, measuredThickness};
        if (updatedResult.load !== undefined && updatedResult.load !== null) {
             updatedResult.correctedFailureLoad = updatedResult.load * correctionFactor;
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
    await onSubmit(results, machineUsed, temperature, paverThickness);
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
          <DialogTitle>Enter Paver Test Results</DialogTitle>
          <DialogDescription>
            Step {step + 1} of {totalSteps}: Results for Paver ID: <span className="font-bold">{currentSampleId}</span>
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="flex-grow pr-6 -mr-6">
            <div className="space-y-4 py-4">
                 <div className="space-y-2">
                    <Label>Calculated Area (mm²)</Label>
                    <Input 
                        type="number" 
                        value={results[step]?.calculatedArea ?? ''} 
                        onChange={(e) => handleResultChange('calculatedArea', e.target.value)}
                        readOnly={sampleSet.paversPerSquareMetre != null}
                        disabled={sampleSet.paversPerSquareMetre != null}
                    />
                </div>
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
                            <Label>Paver Thickness Type (for Correction Factor)</Label>
                            <Select value={paverThickness} onValueChange={handlePaverThicknessChange}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select thickness type..." />
                                </SelectTrigger>
                                <SelectContent>
                                    {PAVER_THICKNESS_OPTIONS.map(option => (
                                        <SelectItem key={option} value={option}>{option}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                         <div className="space-y-2">
                            <Label>Machine Used</Label>
                             <Select value={machineUsed} onValueChange={setMachineUsed}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a machine..." />
                                </SelectTrigger>
                                <SelectContent>
                                    {(machines || []).map(m => (
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

    

    

