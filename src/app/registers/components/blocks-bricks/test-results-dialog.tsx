
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
import { GroupedBlockBrickSample } from '@/lib/types';
import { ScrollArea } from '@/components/ui/scroll-area';


const sampleSchema = z.object({
  id: z.string(),
  sampleSerialNumber: z.string(),
  length: z.coerce.number().optional(),
  width: z.coerce.number().optional(),
  height: z.coerce.number().optional(),
  weight: z.coerce.number().optional(),
  load: z.coerce.number().optional(),
  modeOfFailure: z.string().optional(),
  holeA_number: z.coerce.number().optional(),
  holeA_length: z.coerce.number().optional(),
  holeA_width: z.coerce.number().optional(),
  holeB_number: z.coerce.number().optional(),
  holeB_length: z.coerce.number().optional(),
  holeB_width: z.coerce.number().optional(),
  notch_number: z.coerce.number().optional(),
  notch_length: z.coerce.number().optional(),
  notch_width: z.coerce.number().optional(),
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
  sampleSet: GroupedBlockBrickSample;
  onSave: (data: Partial<GroupedBlockBrickSample>) => void;
}

export function TestResultsDialog({ open, onOpenChange, sampleSet, onSave }: TestResultsDialogProps) {
  const [currentStep, setCurrentStep] = React.useState(0);

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
            holeA_number: s.holeA_number || undefined,
            holeA_length: s.holeA_length || undefined,
            holeA_width: s.holeA_width || undefined,
            holeB_number: s.holeB_number || undefined,
            holeB_length: s.holeB_length || undefined,
            holeB_width: s.holeB_width || undefined,
            notch_number: s.notch_number || undefined,
            notch_length: s.notch_length || undefined,
            notch_width: s.notch_width || undefined,
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
            holeA_number: currentValues.holeA_number,
            holeA_length: currentValues.holeA_length,
            holeA_width: currentValues.holeA_width,
            holeB_number: currentValues.holeB_number,
            holeB_length: currentValues.holeB_length,
            holeB_width: currentValues.holeB_width,
            notch_number: currentValues.notch_number,
            notch_length: currentValues.notch_length,
            notch_width: currentValues.notch_width,
        });
        setCurrentStep(currentStep + 1);
    } else {
        const data = form.getValues();
         const finalData: Partial<GroupedBlockBrickSample> = {
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
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Enter Test Results</DialogTitle>
          <DialogDescription>
            Step {currentStep + 1} of {sampleSet.samples.length} for Sample ID: {currentSample?.sampleSerialNumber}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 p-1">
          <ScrollArea className="h-[60vh] p-4">
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

               <Separator />
               <Label className="font-semibold">Hole Dimensions</Label>
               <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                      <Label className="text-xs">Hole A</Label>
                      <div className="flex gap-2">
                          <Controller name={`samples.${currentStep}.holeA_number`} control={form.control} render={({ field }) => <Input placeholder="No." {...field} type="number" value={field.value ?? ''} />} />
                          <Controller name={`samples.${currentStep}.holeA_length`} control={form.control} render={({ field }) => <Input placeholder="L" {...field} type="number" value={field.value ?? ''} />} />
                          <Controller name={`samples.${currentStep}.holeA_width`} control={form.control} render={({ field }) => <Input placeholder="W" {...field} type="number" value={field.value ?? ''} />} />
                      </div>
                  </div>
                  <div>
                      <Label className="text-xs">Hole B</Label>
                      <div className="flex gap-2">
                          <Controller name={`samples.${currentStep}.holeB_number`} control={form.control} render={({ field }) => <Input placeholder="No." {...field} type="number" value={field.value ?? ''} />} />
                          <Controller name={`samples.${currentStep}.holeB_length`} control={form.control} render={({ field }) => <Input placeholder="L" {...field} type="number" value={field.value ?? ''} />} />
                          <Controller name={`samples.${currentStep}.holeB_width`} control={form.control} render={({ field }) => <Input placeholder="W" {...field} type="number" value={field.value ?? ''} />} />
                      </div>
                  </div>
                   <div>
                      <Label className="text-xs">Notch</Label>
                      <div className="flex gap-2">
                          <Controller name={`samples.${currentStep}.notch_number`} control={form.control} render={({ field }) => <Input placeholder="No." {...field} type="number" value={field.value ?? ''} />} />
                          <Controller name={`samples.${currentStep}.notch_length`} control={form.control} render={({ field }) => <Input placeholder="L" {...field} type="number" value={field.value ?? ''} />} />
                          <Controller name={`samples.${currentStep}.notch_width`} control={form.control} render={({ field }) => <Input placeholder="W" {...field} type="number" value={field.value ?? ''} />} />
                      </div>
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
          </ScrollArea>
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
