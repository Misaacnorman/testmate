
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
import { GroupedConcreteCubeSample, ConcreteCubeSample } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/use-auth';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Calendar } from '@/components/ui/calendar';
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
  sampleSet: GroupedConcreteCubeSample;
  onSave: (data: Partial<GroupedConcreteCubeSample>) => void;
}

export function EditSampleSetDialog({ open, onOpenChange, sampleSet, onSave }: EditSampleSetDialogProps) {
  const [currentStep, setCurrentStep] = React.useState(0);
  const { user } = useAuth();
  const { toast } = useToast();

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
    defaultValues: {
      clientName: sampleSet.clientName,
      projectTitle: sampleSet.projectTitle,
      samples: sampleSet.samples.map(s => ({
        length: s.length,
        width: s.width,
        height: s.height,
        weight: s.weight,
        load: s.load,
        modeOfFailure: s.modeOfFailure,
      })),
      machineUsed: sampleSet.machineUsed,
      recordedTemp: sampleSet.recordedTemp,
      certificateNumber: sampleSet.certificateNumber,
      comment: sampleSet.comment,
      technician: sampleSet.technician || user?.displayName || user?.email || '',
      dateOfIssue: sampleSet.dateOfIssue ? format(parseISO(sampleSet.dateOfIssue), 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd'),
      issueId: sampleSet.issueId,
      takenBy: sampleSet.takenBy,
      dateTaken: sampleSet.dateTaken ? format(parseISO(sampleSet.dateTaken), 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd'),
      contact: sampleSet.contact,
    },
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

  const processForm = async (event: React.MouseEvent<HTMLButtonElement>) => {
    let isValid = false;
    const currentStepName = steps[currentStep];

    if (currentStepName === 'Receipt Details') {
      isValid = await form.trigger(['clientName', 'projectTitle']);
    } else if (currentStepName === 'Test Results') {
      isValid = await form.trigger(['samples', 'machineUsed', 'recordedTemp']);
    } else if (currentStepName === 'Issue Details') {
      isValid = await form.trigger(['certificateNumber', 'takenBy', 'contact']);
    } else {
        isValid = true;
    }
    
    if (!isValid) return;

    const buttonName = event.currentTarget.name;

    if (buttonName === 'next' && currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else if (buttonName === 'save') {
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Edit Sample Set</DialogTitle>
          <DialogDescription>
            Editing data for Receipt ID: {sampleSet.receiptId}
          </DialogDescription>
        </DialogHeader>

        {/* The form tag is now just a container */}
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
                            <Button type="button" name="next" onClick={processForm}>Next</Button>
                        ) : (
                            <Button type="button" name="save" onClick={processForm}>Save Changes</Button>
                        )}
                    </div>
                </div>
            </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
