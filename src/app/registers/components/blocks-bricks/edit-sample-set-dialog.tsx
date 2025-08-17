
'use client';

import * as React from 'react';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { format, parseISO } from 'date-fns';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
  DialogClose,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { GroupedBlockBrickSample } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/use-auth';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';

const receiptDetailsSchema = z.object({
  clientName: z.string().min(1, 'Client name is required'),
  projectTitle: z.string().min(1, 'Project title is required'),
});

const testResultSampleSchema = z.object({
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

const testResultsSchema = z.object({
  samples: z.array(testResultSampleSchema),
  machineUsed: z.string().optional(),
  recordedTemp: z.coerce.number().optional(),
});

const issueSchema = z.object({
  certificateNumber: z.string().min(1, 'Certificate No. is required'),
  comment: z.string().optional(),
  technician: z.string(),
  dateOfIssue: z.string(),
  issueId: z.string().optional(),
  takenBy: z.string().min(1, 'Required'),
  dateTaken: z.string(),
  contact: z.string().min(1, 'Required'),
});

// Combine schemas for a complete form validation
const formSchema = receiptDetailsSchema.merge(testResultsSchema).merge(issueSchema);
type FormValues = z.infer<typeof formSchema>;


interface EditSampleSetDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sampleSet: GroupedBlockBrickSample;
  onSave: (data: Partial<GroupedBlockBrickSample>) => void;
}

export function EditSampleSetDialog({ open, onOpenChange, sampleSet, onSave }: EditSampleSetDialogProps) {
  const [currentStep, setCurrentStep] = React.useState(0);
  const { user } = useAuth();

  const steps = React.useMemo(() => {
    const availableSteps = ['Receipt Details'];
    if (sampleSet.samples.some(s => s.load)) {
        availableSteps.push('Test Results');
    }
    if (sampleSet.certificateNumber) {
        availableSteps.push('Issue Details');
    }
    return availableSteps;
  }, [sampleSet]);

  const form = useForm<FormValues>({
    // resolver: zodResolver(formSchema), // We'll trigger validation manually per step
    defaultValues: {},
  });

  const { fields } = useFieldArray({
    control: form.control,
    name: 'samples',
  });
  
  React.useEffect(() => {
    if (sampleSet && open) {
      form.reset({
        clientName: sampleSet.clientName,
        projectTitle: sampleSet.projectTitle,
        samples: sampleSet.samples.map(s => ({
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
        machineUsed: sampleSet.machineUsed || undefined,
        recordedTemp: sampleSet.recordedTemp || undefined,
        certificateNumber: sampleSet.certificateNumber || '',
        comment: sampleSet.comment || '',
        technician: sampleSet.technician || user?.displayName || user?.email || '',
        dateOfIssue: sampleSet.dateOfIssue ? format(parseISO(sampleSet.dateOfIssue), 'yyyy-MM-dd') : (sampleSet.testingDate ? format(parseISO(sampleSet.testingDate), 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd')),
        issueId: sampleSet.issueId || '',
        takenBy: sampleSet.takenBy || '',
        dateTaken: sampleSet.dateTaken ? format(parseISO(sampleSet.dateTaken), 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd'),
        contact: sampleSet.contact || '',
      });
      setCurrentStep(0);
    }
  }, [sampleSet, user, open, form]);

  const validateStep = async () => {
    const currentStepName = steps[currentStep];
    if (currentStepName === 'Receipt Details') {
      return await form.trigger(['clientName', 'projectTitle']);
    }
    if (currentStepName === 'Test Results') {
      return await form.trigger(['samples', 'machineUsed', 'recordedTemp']);
    }
    if (currentStepName === 'Issue Details') {
      return await form.trigger(['certificateNumber', 'takenBy', 'contact']);
    }
    return true;
  };

  const handleNext = async () => {
    const isValid = await validateStep();
    if (!isValid) return;

    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleSave = async () => {
    const isValid = await validateStep();
    if (!isValid) return;

    const data = form.getValues();
    const finalData: Partial<GroupedBlockBrickSample> = {
      ...data,
      samples: sampleSet.samples.map((originalSample, index) => ({
        ...originalSample,
        ...data.samples[index],
      })),
    };
    onSave(finalData);
  };


  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Edit Sample Set</DialogTitle>
          <DialogDescription>
            Editing data for Receipt ID: {sampleSet.receiptId}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 p-1">
            <div className="flex items-center justify-center space-x-4 p-2">
                {steps.map((stepName, index) => (
                    <div key={stepName} className="flex items-center space-x-2">
                        <div
                            className={cn(
                                "w-6 h-6 rounded-full flex items-center justify-center text-sm",
                                index === currentStep ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground",
                                index < currentStep ? "bg-primary/50 text-primary-foreground" : ""
                            )}
                        >
                            {index + 1}
                        </div>
                        <span className={cn("font-medium", index === currentStep ? "text-primary" : "text-muted-foreground")}>
                            {stepName}
                        </span>
                    </div>
                ))}
            </div>
            <Separator />
            
            {steps[currentStep] === 'Receipt Details' && (
                <div className="p-4 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Client Name</Label>
                          <Controller name="clientName" control={form.control} render={({ field }) => <Input {...field} />} />
                          {form.formState.errors.clientName && <p className="text-destructive text-xs">{form.formState.errors.clientName.message}</p>}
                        </div>
                        <div className="space-y-2">
                          <Label>Project Title</Label>
                          <Controller name="projectTitle" control={form.control} render={({ field }) => <Input {...field} />} />
                          {form.formState.errors.projectTitle && <p className="text-destructive text-xs">{form.formState.errors.projectTitle.message}</p>}
                        </div>
                    </div>
                </div>
            )}
            
            {steps[currentStep] === 'Test Results' && (
                 <ScrollArea className="h-[50vh] p-4">
                    {fields.map((field, index) => (
                        <div key={field.id} className="p-4 border rounded-lg space-y-4 mb-4">
                            <h4 className="font-semibold text-center">Sample ID: {sampleSet.samples[index].sampleSerialNumber}</h4>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <Label>Dimensions (mm)</Label>
                                    <div className="flex gap-2">
                                        <Controller name={`samples.${index}.length`} control={form.control} render={({ field }) => <Input placeholder="L" {...field} type="number" />} />
                                        <Controller name={`samples.${index}.width`} control={form.control} render={({ field }) => <Input placeholder="W" {...field} type="number" />} />
                                        <Controller name={`samples.${index}.height`} control={form.control} render={({ field }) => <Input placeholder="H" {...field} type="number" />} />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label>Weight (kg)</Label>
                                    <Controller name={`samples.${index}.weight`} control={form.control} render={({ field }) => <Input {...field} type="number" />} />
                                </div>
                                <div className="space-y-2">
                                    <Label>Load (kN)</Label>
                                    <Controller name={`samples.${index}.load`} control={form.control} render={({ field }) => <Input {...field} type="number" />} />
                                </div>
                                 <div className="space-y-2 md:col-span-3">
                                    <Label>Mode of Failure</Label>
                                    <Controller name={`samples.${index}.modeOfFailure`} control={form.control} render={({ field }) => <Input {...field} />} />
                                </div>
                            </div>
                            <Separator />
                            <Label className="font-semibold">Hole Dimensions</Label>
                             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <Label className="text-xs">Hole A</Label>
                                    <div className="flex gap-2">
                                        <Controller name={`samples.${index}.holeA_number`} control={form.control} render={({ field }) => <Input placeholder="No." {...field} type="number" />} />
                                        <Controller name={`samples.${index}.holeA_length`} control={form.control} render={({ field }) => <Input placeholder="L" {...field} type="number" />} />
                                        <Controller name={`samples.${index}.holeA_width`} control={form.control} render={({ field }) => <Input placeholder="W" {...field} type="number" />} />
                                    </div>
                                </div>
                                <div>
                                    <Label className="text-xs">Hole B</Label>
                                    <div className="flex gap-2">
                                        <Controller name={`samples.${index}.holeB_number`} control={form.control} render={({ field }) => <Input placeholder="No." {...field} type="number" />} />
                                        <Controller name={`samples.${index}.holeB_length`} control={form.control} render={({ field }) => <Input placeholder="L" {...field} type="number" />} />
                                        <Controller name={`samples.${index}.holeB_width`} control={form.control} render={({ field }) => <Input placeholder="W" {...field} type="number" />} />
                                    </div>
                                </div>
                                 <div>
                                    <Label className="text-xs">Notch</Label>
                                    <div className="flex gap-2">
                                        <Controller name={`samples.${index}.notch_number`} control={form.control} render={({ field }) => <Input placeholder="No." {...field} type="number" />} />
                                        <Controller name={`samples.${index}.notch_length`} control={form.control} render={({ field }) => <Input placeholder="L" {...field} type="number" />} />
                                        <Controller name={`samples.${index}.notch_width`} control={form.control} render={({ field }) => <Input placeholder="W" {...field} type="number" />} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                    <Separator />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                        <div className="space-y-2">
                            <Label>Machine Used</Label>
                            <Controller name="machineUsed" control={form.control} render={({ field }) => <Input {...field} />} />
                        </div>
                        <div className="space-y-2">
                            <Label>Temperature (°C)</Label>
                            <Controller name="recordedTemp" control={form.control} render={({ field }) => <Input type="number" {...field} value={field.value ?? ''} />} />
                        </div>
                    </div>
                </ScrollArea>
            )}
            
            {steps[currentStep] === 'Issue Details' && (
                <ScrollArea className="h-[50vh] p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Certificate No.</Label>
                            <Controller name="certificateNumber" control={form.control} render={({ field }) => <Input {...field} />} />
                            {form.formState.errors.certificateNumber && <p className="text-destructive text-xs">{form.formState.errors.certificateNumber.message}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label>Issue ID/Serial No.</Label>
                            <Controller name="issueId" control={form.control} render={({ field }) => <Input {...field} />} />
                        </div>
                         <div className="space-y-2 md:col-span-2">
                            <Label>Comment/Remark</Label>
                            <Controller name="comment" control={form.control} render={({ field }) => <Textarea {...field} />} />
                        </div>
                        <div className="space-y-2">
                            <Label>Technician</Label>
                            <Controller name="technician" control={form.control} render={({ field }) => <Input {...field} readOnly className="bg-muted/50" />} />
                        </div>
                        <div className="space-y-2">
                            <Label>Date of Issue</Label>
                            <Controller name="dateOfIssue" control={form.control} render={({ field }) => <Input {...field} type="date" />} />
                        </div>
                        <div className="space-y-2">
                            <Label>Taken By</Label>
                            <Controller name="takenBy" control={form.control} render={({ field }) => <Input {...field} />} />
                            {form.formState.errors.takenBy && <p className="text-destructive text-xs">{form.formState.errors.takenBy.message}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label>Date Taken</Label>
                            <Controller name="dateTaken" control={form.control} render={({ field }) => <Input {...field} type="date" />} />
                        </div>
                        <div className="space-y-2">
                            <Label>Contact</Label>
                            <Controller name="contact" control={form.control} render={({ field }) => <Input {...field} />} />
                            {form.formState.errors.contact && <p className="text-destructive text-xs">{form.formState.errors.contact.message}</p>}
                        </div>
                    </div>
                </ScrollArea>
            )}

            <DialogFooter className="pt-4">
                <div className="w-full flex justify-between">
                    <Button variant="outline" type="button" onClick={handleBack} disabled={currentStep === 0}>
                        Back
                    </Button>
                    <div className="flex gap-2">
                        <DialogClose asChild>
                            <Button variant="ghost" type="button">Cancel</Button>
                        </DialogClose>
                        {currentStep < steps.length - 1 ? (
                             <Button type="button" name="next" onClick={handleNext}>Next</Button>
                        ) : (
                             <Button type="button" name="save" onClick={handleSave}>Save Changes</Button>
                        )}
                    </div>
                </div>
            </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
