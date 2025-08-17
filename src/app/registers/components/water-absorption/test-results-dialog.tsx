
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
import { GroupedWaterAbsorptionSample } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

const sampleSchema = z.object({
  id: z.string(),
  sampleSerialNumber: z.string(),
  length: z.coerce.number().optional(),
  width: z.coerce.number().optional(),
  height: z.coerce.number().optional(),
  ovenDriedWeight: z.coerce.number().optional(),
  weightAfterSoaking: z.coerce.number().optional(),
});

const formSchema = z.object({
  samples: z.array(sampleSchema),
});

type FormValues = z.infer<typeof formSchema>;

interface TestResultsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sampleSet: GroupedWaterAbsorptionSample;
  onSave: (data: Partial<GroupedWaterAbsorptionSample>) => void;
}

export function TestResultsDialog({ open, onOpenChange, sampleSet, onSave }: TestResultsDialogProps) {
  const [currentStep, setCurrentStep] = React.useState(0);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    defaultValues: {
      samples: sampleSet.samples,
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
            ovenDriedWeight: s.ovenDriedWeight || undefined,
            weightAfterSoaking: s.weightAfterSoaking || undefined,
        })),
      });
      setCurrentStep(0);
    }
  }, [sampleSet, open, form]);

  const processStep = () => {
    const data = form.getValues();
    const calculatedSamples = data.samples.map(s => {
        const ovenDriedWeight = s.ovenDriedWeight || 0;
        const weightAfterSoaking = s.weightAfterSoaking || 0;
        const weightOfWater = weightAfterSoaking - ovenDriedWeight;
        const calculatedWaterAbsorption = ovenDriedWeight > 0 ? (weightOfWater / ovenDriedWeight) * 100 : 0;
        return {
            ...s,
            weightOfWater: parseFloat(weightOfWater.toFixed(2)),
            calculatedWaterAbsorption: parseFloat(calculatedWaterAbsorption.toFixed(2)),
        }
    });

    if (currentStep < sampleSet.samples.length - 1) {
        const currentValues = calculatedSamples[currentStep];
        form.setValue(`samples.${currentStep + 1}`, {
            ...form.getValues(`samples.${currentStep + 1}`),
            length: currentValues.length,
            width: currentValues.width,
            height: currentValues.height,
            ovenDriedWeight: currentValues.ovenDriedWeight,
            weightAfterSoaking: currentValues.weightAfterSoaking,
        });
        setCurrentStep(currentStep + 1);
    } else {
        // This is the final step, so we submit the form data
         const finalData: Partial<GroupedWaterAbsorptionSample> = {
          ...data,
          samples: sampleSet.samples.map((originalSample, index) => ({
            ...originalSample,
            ...calculatedSamples[index],
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
                    <Label>Oven Dried Weight (kg)</Label>
                    <Controller name={`samples.${currentStep}.ovenDriedWeight`} control={form.control} render={({ field }) => <Input {...field} type="number" value={field.value ?? ''} />} />
                </div>
                <div className="space-y-2">
                    <Label>Weight After Soaking (kg)</Label>
                    <Controller name={`samples.${currentStep}.weightAfterSoaking`} control={form.control} render={({ field }) => <Input {...field} type="number" value={field.value ?? ''} />} />
                </div>
            </div>
          </div>
          
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
