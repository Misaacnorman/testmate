
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

const testResultSampleSchema = z.object({
  length: z.coerce.number().min(1, 'Required'),
  width: z.coerce.number().min(1, 'Required'),
  height: z.coerce.number().min(1, 'Required'),
  weight: z.coerce.number().min(0.1, 'Required'),
  load: z.coerce.number().min(0.1, 'Required'),
  modeOfFailure: z.string().min(1, 'Required'),
});

const formSchema = z.object({
  samples: z.array(testResultSampleSchema),
  machineUsed: z.string().min(1, 'Required'),
  recordedTemp: z.coerce.number().optional(),
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
        modeOfFailure: s.modeOfFailure || '',
      })),
      machineUsed: sampleSet.machineUsed || '',
      recordedTemp: sampleSet.recordedTemp || undefined,
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
        modeOfFailure: s.modeOfFailure || '',
      })),
      machineUsed: sampleSet.machineUsed || '',
      recordedTemp: sampleSet.recordedTemp || undefined,
    });
    setCurrentStep(0);
  }, [sampleSet, form, open]);


  const totalSteps = fields.length;
  const progress = ((currentStep + 1) / totalSteps) * 100;
  const currentSample = sampleSet.samples[currentStep];

  const handleNext = async () => {
    // Trigger validation for all shared fields and the current sample fields
    const isValid = await form.trigger();
    
    if (isValid && currentStep < totalSteps - 1) {
      const currentValues = form.getValues(`samples.${currentStep}`);
      const nextStepIndex = currentStep + 1;
      
      const nextStepValues = form.getValues(`samples.${nextStepIndex}`);

      // Only carry over individual values if the next step seems untouched
      const isNextStepPristine = (
        !nextStepValues.length &&
        !nextStepValues.width &&
        !nextStepValues.height &&
        !nextStepValues.weight &&
        !nextStepValues.load &&
        !nextStepValues.modeOfFailure
      );

      if (isNextStepPristine) {
        form.setValue(`samples.${nextStepIndex}.length`, currentValues.length);
        form.setValue(`samples.${nextStepIndex}.width`, currentValues.width);
        form.setValue(`samples.${nextStepIndex}.height`, currentValues.height);
        form.setValue(`samples.${nextStepIndex}.weight`, currentValues.weight);
        form.setValue(`samples.${nextStepIndex}.load`, currentValues.load);
        form.setValue(`samples.${nextStepIndex}.modeOfFailure`, currentValues.modeOfFailure);
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
      // Ensure shared values are consistent across the set
      machineUsed: data.machineUsed,
      recordedTemp: data.recordedTemp,
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

        <form onSubmit={form.handleSubmit(onSubmit)} className="p-1 space-y-4">
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
                 {form.formState.errors.samples?.[currentStep]?.width && <p className="text-destructive text-xs">{form.formState.errors.samples[currentStep]?.width?.message}</p>}
                 {form.formState.errors.samples?.[currentStep]?.height && <p className="text-destructive text-xs">{form.formState.errors.samples[currentStep]?.height?.message}</p>}
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
                  <Label htmlFor={`modeOfFailure-${currentStep}`}>Mode of Failure</Label>
                   <Controller
                      name={`samples.${currentStep}.modeOfFailure`}
                      control={form.control}
                      render={({ field }) => <Input id={`modeOfFailure-${currentStep}`} {...field} />}
                    />
                  {form.formState.errors.samples?.[currentStep]?.modeOfFailure && <p className="text-destructive text-xs">{form.formState.errors.samples[currentStep]?.modeOfFailure?.message}</p>}
                </div>
                
                <Separator className="md:col-span-2"/>
                
                <div className="space-y-2">
                  <Label>Machine Used</Label>
                  <Controller
                      name="machineUsed"
                      control={form.control}
                      render={({ field }) => <Input {...field} />}
                    />
                  {form.formState.errors.machineUsed && <p className="text-destructive text-xs">{form.formState.errors.machineUsed.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label>Temperature (°C)</Label>
                   <Controller
                      name="recordedTemp"
                      control={form.control}
                      render={({ field }) => <Input type="number" {...field} />}
                    />
                </div>
            </div>

          <DialogFooter className="pt-4">
              <div className="w-full flex justify-between">
                  <Button variant="outline" type="button" onClick={handleBack} disabled={currentStep === 0}>
                      Back
                  </Button>
                  <div className="flex gap-2">
                      <DialogClose asChild>
                        <Button variant="ghost" type="button">Cancel</Button>
                      </DialogClose>
                      {currentStep < totalSteps - 1 ? (
                      <Button type="button" onClick={handleNext}>Next</Button>
                      ) : (
                      <Button type="submit">Save Results</Button>
                      )}
                  </div>
              </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
