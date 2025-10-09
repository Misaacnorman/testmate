
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
import type { BricksBlocksRegisterEntry, BricksBlocksTestResult, HoleDimension, BrickType, CorrectionFactorMachine } from "@/lib/types";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/context/auth-context";

interface BricksBlocksTestDialogProps {
  isOpen: boolean;
  onClose: () => void;
  sampleSet: BricksBlocksRegisterEntry;
  onSubmit: (results: BricksBlocksTestResult[], machineUsed: string, temperature: number, solidBlockType?: 'Regular concrete blocks' | 'Stabilised earth Blocks' | null, modeOfCompaction?: 'Not Specified' | 'Static' | null, brickType?: BrickType | null) => Promise<void>;
  machines: CorrectionFactorMachine[];
}

const areResultsDirty = (initial: BricksBlocksTestResult[], current: BricksBlocksTestResult[]) => {
    return JSON.stringify(initial) !== JSON.stringify(current);
};

const BRICK_TYPES: BrickType[] = ['Regular Fired Clay Bricks', 'Regular Fired Earth Bricks', 'Stabilised Earth Bricks', 'Regular Earth bricks'];

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


export function BricksBlocksTestDialog({ isOpen, onClose, sampleSet, onSubmit, machines }: BricksBlocksTestDialogProps) {
  const [step, setStep] = React.useState(0);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isCloseConfirmOpen, setIsCloseConfirmOpen] = React.useState(false);
  const isHollow = sampleSet.sampleType === 'Hollow';
  const isSolid = sampleSet.sampleType === 'Solid';
  const isBrick = sampleSet.sampleType === 'Brick';
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
        weight: existing?.weight ?? undefined,
        load: existing?.load ?? undefined,
        correctedFailureLoad: existing?.correctedFailureLoad ?? undefined,
        modeOfFailure: existing?.modeOfFailure || 'Satisfactory',
        holeA: existing?.holeA ?? { l: undefined, w: undefined, no: undefined },
        holeB: existing?.holeB ?? { l: undefined, w: undefined, no: undefined },
        notch: existing?.notch ?? { l: undefined, w: undefined, no: undefined },
      }
    }), [sortedSampleIds, sampleSet.results]
  );

  const [results, setResults] = React.useState<BricksBlocksTestResult[]>(initialResultsState);
  const [machineUsed, setMachineUsed] = React.useState(sampleSet.machineUsed || '');
  const [temperature, setTemperature] = React.useState<number>(sampleSet.temperature ?? 25);
  const [solidBlockType, setSolidBlockType] = React.useState(sampleSet.solidBlockType);
  const [brickType, setBrickType] = React.useState(sampleSet.brickType);
  const [modeOfCompaction, setModeOfCompaction] = React.useState(sampleSet.modeOfCompaction);

  const isDirty = React.useMemo(() => 
      areResultsDirty(initialResultsState, results) || 
      machineUsed !== (sampleSet.machineUsed || '') ||
      temperature !== (sampleSet.temperature ?? 25) ||
      solidBlockType !== sampleSet.solidBlockType ||
      brickType !== sampleSet.brickType ||
      modeOfCompaction !== sampleSet.modeOfCompaction,
  [initialResultsState, results, machineUsed, temperature, solidBlockType, brickType, modeOfCompaction, sampleSet]);


  React.useEffect(() => {
    if (isOpen) {
        setStep(0);
        setResults(initialResultsState);
        setMachineUsed(sampleSet.machineUsed || '');
        setTemperature(sampleSet.temperature ?? 25);
        setSolidBlockType(sampleSet.solidBlockType);
        setBrickType(sampleSet.brickType);
        setModeOfCompaction(sampleSet.modeOfCompaction);
    }
  }, [isOpen, initialResultsState, sampleSet]);

  const totalSteps = sortedSampleIds.length;
  const currentSampleId = sortedSampleIds[step];

  const handleResultChange = (field: keyof Omit<BricksBlocksTestResult, 'sampleId' | 'holeA' | 'holeB' | 'notch'>, value: string) => {
    const newResults = [...results];
    const currentResult = { ...newResults[step] };
    if (field === 'modeOfFailure') {
      currentResult[field] = value;
    } else {
      const numValue = value === '' ? undefined : parseFloat(value);
      (currentResult as any)[field] = isNaN(numValue!) ? undefined : numValue;
    }

    if(field === 'load') {
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
  
  const handleFormatNumber = (field: keyof Omit<BricksBlocksTestResult, 'sampleId' | 'holeA' | 'holeB' | 'notch'>, decimals: number) => {
    const newResults = [...results];
    const currentResult = { ...newResults[step] };
    const value = (currentResult as any)[field];
    
    if (value !== undefined && value !== null && !isNaN(value)) {
      (currentResult as any)[field] = parseFloat(value.toFixed(decimals));
    }
    
    newResults[step] = currentResult;
    setResults(newResults);
  };
  
  const handleHoleChange = (hole: 'holeA' | 'holeB' | 'notch', field: keyof HoleDimension, value: string) => {
      const newResults = [...results];
      const currentResult = { ...newResults[step] };
      if (!currentResult[hole]) {
          currentResult[hole] = {};
      }
      const numValue = value === '' ? undefined : parseFloat(value);
      (currentResult[hole] as any)[field] = isNaN(numValue!) ? undefined : numValue;
      newResults[step] = currentResult;
      setResults(newResults);
  }
  
  const handleMachineChange = (machineId: string) => {
    setMachineUsed(machineId);
    const machine = machines.find(m => m.id === machineId);
    if (!machine) return;

    const newResults = results.map(result => {
        const updatedResult = {...result};
        if (updatedResult.load !== undefined) {
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
    const sanitizedResults: BricksBlocksTestResult[] = results.map(r => ({
      ...r,
      length: r.length ?? undefined,
      width: r.width ?? undefined,
      height: r.height ?? undefined,
      weight: r.weight ?? undefined,
      load: r.load ?? undefined,
      correctedFailureLoad: r.correctedFailureLoad ?? undefined,
      modeOfFailure: r.modeOfFailure ?? 'Satisfactory',
      holeA: {
        l: r.holeA?.l ?? undefined,
        w: r.holeA?.w ?? undefined,
        no: r.holeA?.no ?? undefined,
      },
      holeB: {
        l: r.holeB?.l ?? undefined,
        w: r.holeB?.w ?? undefined,
        no: r.holeB?.no ?? undefined,
      },
      notch: {
        l: r.notch?.l ?? undefined,
        w: r.notch?.w ?? undefined,
        no: r.notch?.no ?? undefined,
      },
    }));
    await onSubmit(sanitizedResults, machineUsed, temperature, solidBlockType || null, modeOfCompaction || null, brickType || null);
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
          <DialogTitle>Enter Brick/Block Test Results</DialogTitle>
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

                {isHollow && (
                    <div className="space-y-4">
                        <Separator />
                        <Label className="font-semibold">Hole Dimensions (mm)</Label>
                        <div className="space-y-3 p-4 border rounded-lg">
                           <Label className="font-medium">Hole a</Label>
                           <div className="grid grid-cols-3 gap-4">
                                <Input placeholder="L" type="number" value={results[step]?.holeA?.l ?? ''} onChange={e => handleHoleChange('holeA', 'l', e.target.value)} />
                                <Input placeholder="W" type="number" value={results[step]?.holeA?.w ?? ''} onChange={e => handleHoleChange('holeA', 'w', e.target.value)} />
                                <Input placeholder="No." type="number" value={results[step]?.holeA?.no ?? ''} onChange={e => handleHoleChange('holeA', 'no', e.target.value)} />
                           </div>
                        </div>
                        <div className="space-y-3 p-4 border rounded-lg">
                           <Label className="font-medium">Hole b</Label>
                           <div className="grid grid-cols-3 gap-4">
                                <Input placeholder="L" type="number" value={results[step]?.holeB?.l ?? ''} onChange={e => handleHoleChange('holeB', 'l', e.target.value)} />
                                <Input placeholder="W" type="number" value={results[step]?.holeB?.w ?? ''} onChange={e => handleHoleChange('holeB', 'w', e.target.value)} />
                                <Input placeholder="No." type="number" value={results[step]?.holeB?.no ?? ''} onChange={e => handleHoleChange('holeB', 'no', e.target.value)} />
                           </div>
                        </div>
                         <div className="space-y-3 p-4 border rounded-lg">
                           <Label className="font-medium">Notch</Label>
                           <div className="grid grid-cols-3 gap-4">
                                <Input placeholder="L" type="number" value={results[step]?.notch?.l ?? ''} onChange={e => handleHoleChange('notch', 'l', e.target.value)} />
                                <Input placeholder="W" type="number" value={results[step]?.notch?.w ?? ''} onChange={e => handleHoleChange('notch', 'w', e.target.value)} />
                                <Input placeholder="No." type="number" value={results[step]?.notch?.no ?? ''} onChange={e => handleHoleChange('notch', 'no', e.target.value)} />
                           </div>
                        </div>
                    </div>
                )}
                 
                 <Separator />
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
                        <Input type="number" value={results[step]?.correctedFailureLoad?.toFixed(1) ?? ''} readOnly disabled />
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
                        {isBrick && (
                             <div className="space-y-2">
                                <Label>Type of Sample</Label>
                                <Select value={brickType} onValueChange={(value) => setBrickType(value as any)}>
                                    <SelectTrigger><SelectValue placeholder="Select type..." /></SelectTrigger>
                                    <SelectContent>
                                        {BRICK_TYPES.map(type => <SelectItem key={type} value={type}>{type}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>
                        )}
                        {isSolid && (
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Type of Sample</Label>
                                    <Select value={solidBlockType} onValueChange={(value) => setSolidBlockType(value as any)}>
                                        <SelectTrigger><SelectValue placeholder="Select type..." /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Regular concrete blocks">Regular concrete blocks</SelectItem>
                                            <SelectItem value="Stabilised earth Blocks">Stabilised earth Blocks</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label>Mode of Compaction</Label>
                                     <Select value={modeOfCompaction} onValueChange={(value) => setModeOfCompaction(value as any)}>
                                        <SelectTrigger><SelectValue placeholder="Select mode..." /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Not Specified">Not Specified</SelectItem>
                                            <SelectItem value="Static">Static</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        )}
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
    

      