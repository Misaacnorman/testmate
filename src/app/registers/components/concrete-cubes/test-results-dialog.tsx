
'use client';

import * as React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { GroupedConcreteCubeSample, ConcreteCubeSample } from '@/lib/types';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const testResultSchema = z.object({
  length: z.coerce.number().min(1, 'Required'),
  width: z.coerce.number().min(1, 'Required'),
  height: z.coerce.number().min(1, 'Required'),
  weight: z.coerce.number().min(0, 'Required'),
  load: z.coerce.number().min(0, 'Required'),
  machineUsed: z.string().min(1, 'Required'),
  modeOfFailure: z.string().min(1, 'Required'),
  recordedTemp: z.coerce.number(),
});

const formSchema = z.object({
  samples: z.array(testResultSchema),
});

type FormValues = z.infer<typeof formSchema>;

interface TestResultsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sampleSet: GroupedConcreteCubeSample;
  onSave: (updatedSamples: ConcreteCubeSample[]) => void;
}

export function TestResultsDialog({ open, onOpenChange, sampleSet, onSave }: TestResultsDialogProps) {
  const [currentStep, setCurrentStep] = React.useState(0);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      samples: sampleSet.samples.map(s => ({
        length: s.length || 0,
        width: s.width || 0,
        height: s.height || 0,
        weight: s.weight || 0,
        load: s.load || 0,
        machineUsed: sampleSet.machineUsed || '',
        modeOfFailure: s.modeOfFailure || '',
        recordedTemp: s.recordedTemp || 0,
      })),
    },
  });

  const { fields } = useFieldArray({
    control: form.control,
    name: 'samples',
  });
  
  React.useEffect(() => {
    // Reset form when dialog reopens with new data
    form.reset({
      samples: sampleSet.samples.map(s => ({
        length: s.length || 0,
        width: s.width || 0,
        height: s.height || 0,
        weight: s.weight || 0,
        load: s.load || 0,
        machineUsed: sampleSet.machineUsed || s.machineUsed || '',
        modeOfFailure: s.modeOfFailure || '',
        recordedTemp: s.recordedTemp || 0,
      }))
    });
    setCurrentStep(0);
  }, [sampleSet, form, open]);


  const totalSteps = fields.length;
  const progress = ((currentStep + 1) / totalSteps) * 100;
  const currentSample = sampleSet.samples[currentStep];

  const handleNext = async () => {
    const isValid = await form.trigger(`samples.${currentStep}`);
    if (isValid && currentStep < totalSteps - 1) {
      const currentValues = form.getValues(`samples.${currentStep}`);
      const nextStepIndex = currentStep + 1;
      
      // Carry over values to the next step if they haven't been touched yet.
      const nextStepValues = form.getValues(`samples.${nextStepIndex}`);
      const isNextStepPristine = Object.values(nextStepValues).every(val => val === 0 || val === '');

      if (isNextStepPristine) {
        form.setValue(`samples.${nextStepIndex}.machineUsed`, currentValues.machineUsed);
        form.setValue(`samples.${nextStepIndex}.modeOfFailure`, currentValues.modeOfFailure);
        form.setValue(`samples.${nextStepIndex}.recordedTemp`, currentValues.recordedTemp);
      }
      
      setCurrentStep(nextStepIndex);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const onSubmit = (data: FormValues) => {
    const updatedSamples = sampleSet.samples.map((originalSample, index) => ({
      ...originalSample,
      ...data.samples[index],
    }));
    onSave(updatedSamples);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Enter Test Results</DialogTitle>
          <DialogDescription>
            For Sample Set from Receipt ID: {sampleSet.receiptId}
          </DialogDescription>
        </DialogHeader>

        <div className="p-1 space-y-4">
          <Progress value={progress} className="w-full" />
          <div className="text-center text-sm font-medium">
            Sample {currentStep + 1} of {totalSteps} (ID: {currentSample.sampleSerialNumber || currentSample.id})
          </div>
          <Separator />
          
           <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
              <div className="space-y-2">
                <Label>Dimensions (mm)</Label>
                <div className="flex gap-2">
                   <Controller
                      name={`samples.${currentStep}.length`}
                      control={form.control}
                      render={({ field }) => <Input placeholder="Length" {...field} type="number" />}
                    />
                    <Controller
                      name={`samples.${currentStep}.width`}
                      control={form.control}
                      render={({ field }) => <Input placeholder="Width" {...field} type="number" />}
                    />
                     <Controller
                      name={`samples.${currentStep}.height`}
                      control={form.control}
                      render={({ field }) => <Input placeholder="Height" {...field} type="number" />}
                    />
                </div>
                {form.formState.errors.samples?.[currentStep]?.length && <p className="text-destructive text-xs">{form.formState.errors.samples[currentStep]?.length?.message}</p>}
              </div>

               <div className="space-y-2">
                  <Label htmlFor={`weight-${currentStep}`}>Weight (kg)</Label>
                  <Controller
                      name={`samples.${currentStep}.weight`}
                      control={form.control}
                      render={({ field }) => <Input id={`weight-${currentStep}`} type="number" {...field} />}
                    />
                  {form.formState.errors.samples?.[currentStep]?.weight && <p className="text-destructive text-xs">{form.formState.errors.samples[currentStep]?.weight?.message}</p>}
               </div>
               
               <div className="space-y-2">
                  <Label htmlFor={`load-${currentStep}`}>Load (kN)</Label>
                   <Controller
                      name={`samples.${currentStep}.load`}
                      control={form.control}
                      render={({ field }) => <Input id={`load-${currentStep}`} type="number" {...field} />}
                    />
                  {form.formState.errors.samples?.[currentStep]?.load && <p className="text-destructive text-xs">{form.formState.errors.samples[currentStep]?.load?.message}</p>}
               </div>

                <div className="space-y-2">
                  <Label htmlFor={`machineUsed-${currentStep}`}>Machine Used</Label>
                  <Controller
                      name={`samples.${currentStep}.machineUsed`}
                      control={form.control}
                      render={({ field }) => <Input id={`machineUsed-${currentStep}`} {...field} />}
                    />
                  {form.formState.errors.samples?.[currentStep]?.machineUsed && <p className="text-destructive text-xs">{form.formState.errors.samples[currentStep]?.machineUsed?.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`modeOfFailure-${currentStep}`}>Mode of Failure</Label>
                   <Controller
                      name={`samples.${currentStep}.modeOfFailure`}
                      control={form.control}
                      render={({ field }) => <Input id={`modeOfFailure-${currentStep}`} {...field} />}
                    />
                  {form.formState.errors.samples?.[currentStep]?.modeOfFailure && <p className="text-destructive text-xs">{form.formState.errors.samples[currentStep]?.modeOfFailure?.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`recordedTemp-${currentStep}`}>Temperature (°C)</Label>
                   <Controller
                      name={`samples.${currentStep}.recordedTemp`}
                      control={form.control}
                      render={({ field }) => <Input id={`recordedTemp-${currentStep}`} type="number" {...field} />}
                    />
                </div>
            </div>
        </div>

        <DialogFooter className="pt-4">
            <div className="w-full flex justify-between">
                <Button variant="outline" onClick={handleBack} disabled={currentStep === 0}>
                    Back
                </Button>
                <div className="flex gap-2">
                    <DialogClose asChild>
                      <Button variant="ghost">Cancel</Button>
                    </DialogClose>
                    {currentStep < totalSteps - 1 ? (
                    <Button onClick={handleNext}>Next</Button>
                    ) : (
                    <Button onClick={form.handleSubmit(onSubmit)}>Save Results</Button>
                    )}
                </div>
            </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
