
'use client';

import * as React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { GroupedConcreteCubeSample } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

const sampleSchema = z.object({
  id: z.string(),
  sampleSerialNumber: z.string(),
  length: z.coerce.number().optional(),
  width: z.coerce.number().optional(),
  height: z.coerce.number().optional(),
  weight: z.coerce.number().optional(),
  load: z.coerce.number().optional(),
  modeOfFailure: z.string().optional(),
});

const formSchema = z.object({
  samples: z.array(sampleSchema),
  machineUsed: z.string().optional(),
  recordedTemp: z.coerce.number().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface TestResultsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sampleSet: GroupedConcreteCubeSample;
  onSave: (data: Partial<GroupedConcreteCubeSample>) => void;
}

export function TestResultsDialog({ open, onOpenChange, sampleSet, onSave }: TestResultsDialogProps) {
  const [currentStep, setCurrentStep] = React.useState(0);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    defaultValues: {
      samples: sampleSet.samples,
      machineUsed: sampleSet.machineUsed || '',
      recordedTemp: sampleSet.recordedTemp,
    },
  });
  
  React.useEffect(() => {
    if (sampleSet && open) {
      form.reset({
        samples: sampleSet.samples.map(s => ({
            ...s,
            length: s.length || undefined,
            width: s.width || undefined,
            height: s.height || undefined,
            weight: s.weight || undefined,
            load: s.load || undefined,
            modeOfFailure: s.modeOfFailure || undefined,
        })),
        machineUsed: sampleSet.machineUsed || '',
        recordedTemp: sampleSet.recordedTemp,
      });
      setCurrentStep(0);
    }
  }, [sampleSet, open, form]);

  const processStep = () => {
    if (currentStep < sampleSet.samples.length - 1) {
        const currentValues = form.getValues(`samples.${currentStep}`);
        form.setValue(`samples.${currentStep + 1}`, {
            ...form.getValues(`samples.${currentStep + 1}`),
            length: currentValues.length,
            width: currentValues.width,
            height: currentValues.height,
            weight: currentValues.weight,
            load: currentValues.load,
            modeOfFailure: currentValues.modeOfFailure,
        });
        setCurrentStep(currentStep + 1);
    } else {
        // This is the final step, so we submit the form data
        const data = form.getValues();
         const finalData: Partial<GroupedConcreteCubeSample> = {
          ...data,
          samples: sampleSet.samples.map((originalSample, index) => ({
            ...originalSample,
            ...data.samples[index],
          })),
        };
        onSave(finalData);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };
  
  const currentSample = form.watch(`samples.${currentStep}`);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Enter Test Results</DialogTitle>
          <DialogDescription>
            Step {currentStep + 1} of {sampleSet.samples.length} for Sample ID: {currentSample?.sampleSerialNumber}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 p-1">
          <div className="p-4 border rounded-lg space-y-4">
             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                    <Label>Dimensions (mm)</Label>
                    <div className="flex gap-2">
                        <Controller name={`samples.${currentStep}.length`} control={form.control} render={({ field }) => <Input placeholder="L" {...field} type="number" value={field.value ?? ''} />} />
                        <Controller name={`samples.${currentStep}.width`} control={form.control} render={({ field }) => <Input placeholder="W" {...field} type="number" value={field.value ?? ''} />} />
                        <Controller name={`samples.${currentStep}.height`} control={form.control} render={({ field }) => <Input placeholder="H" {...field} type="number" value={field.value ?? ''} />} />
                    </div>
                </div>
                <div className="space-y-2">
                    <Label>Weight (kg)</Label>
                    <Controller name={`samples.${currentStep}.weight`} control={form.control} render={({ field }) => <Input {...field} type="number" value={field.value ?? ''} />} />
                </div>
                <div className="space-y-2">
                    <Label>Load (kN)</Label>
                    <Controller name={`samples.${currentStep}.load`} control={form.control} render={({ field }) => <Input {...field} type="number" value={field.value ?? ''} />} />
                </div>
                 <div className="space-y-2 md:col-span-3">
                    <Label>Mode of Failure</Label>
                    <Controller name={`samples.${currentStep}.modeOfFailure`} control={form.control} render={({ field }) => <Input {...field} value={field.value ?? ''} />} />
                </div>
            </div>
          </div>
          
           {currentStep === sampleSet.samples.length - 1 && (
            <>
              <Separator />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                  <div className="space-y-2">
                      <Label>Machine Used</Label>
                      <Controller name="machineUsed" control={form.control} render={({ field }) => <Input {...field} value={field.value ?? ''} />} />
                  </div>
                  <div className="space-y-2">
                      <Label>Temperature (°C)</Label>
                      <Controller name="recordedTemp" control={form.control} render={({ field }) => <Input type="number" {...field} value={field.value ?? ''} />} />
                  </div>
              </div>
            </>
           )}

          <DialogFooter className="pt-4">
            <div className="w-full flex justify-between">
                <Button variant="outline" type="button" onClick={handleBack} disabled={currentStep === 0}>
                    Back
                </Button>
                <div className="flex gap-2">
                    <Button variant="ghost" type="button" onClick={() => onOpenChange(false)}>Cancel</Button>
                    {currentStep < sampleSet.samples.length - 1 ? (
                        <Button type="button" onClick={processStep}>Next</Button>
                    ) : (
                        <Button type="button" onClick={processStep}>Save Results</Button>
                    )}
                </div>
            </div>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
