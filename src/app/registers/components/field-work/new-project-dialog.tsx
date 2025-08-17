
'use client';

import * as React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { format } from 'date-fns';
import { Loader2, CalendarIcon } from 'lucide-react';

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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { FieldWorkInstruction } from '@/lib/types';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';

const projectSchema = z.object({
  date: z.date().optional(),
  projectIdBig: z.string().optional(),
  projectIdSmall: z.string().optional(),
  client: z.string().optional(),
  project: z.string().optional(),
  engineerInCharge: z.string().optional(),

  // Field Work
  fieldTests: z.string().optional(),
  fieldTechnician: z.string().optional(),
  fieldStartDate: z.date().optional(),
  fieldEndDate: z.date().optional(),
  fieldRemarks: z.string().optional(),

  // Lab Work
  labTestsDescription: z.string().optional(),
  labTechnician: z.string().optional(),
  labStartDate: z.date().optional(),
  labAgreedDeliveryDate: z.date().optional(),
  labAgreedDeliverySignature: z.string().optional(),
  labActualDeliveryDate: z.date().optional(),
  labActualDeliverySignature: z.string().optional(),
  labRemarks: z.string().optional(),

  // Reporting
  acknowledgement: z.string().optional(),
  reportIssuedBy: z.string().optional(),
  reportPickedBy: z.string().optional(),
  reportContact: z.string().optional(),
  reportDateTime: z.date().optional(),
  sampleReceiptNumber: z.string().optional(),
});

type ProjectFormValues = z.infer<typeof projectSchema>;

interface NewProjectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: Omit<FieldWorkInstruction, 'id'>) => void;
  processing: boolean;
}

const steps = [
  {
    title: 'Project & Client',
    fields: ['date', 'projectIdBig', 'projectIdSmall', 'client', 'project', 'engineerInCharge'],
  },
  {
    title: 'Field Work',
    fields: ['fieldTests', 'fieldTechnician', 'fieldStartDate', 'fieldEndDate', 'fieldRemarks'],
  },
  {
    title: 'Lab Testing',
    fields: [
      'labTestsDescription',
      'labTechnician',
      'labStartDate',
      'labAgreedDeliveryDate',
      'labAgreedDeliverySignature',
      'labActualDeliveryDate',
      'labActualDeliverySignature',
      'labRemarks',
    ],
  },
  {
    title: 'Reporting',
    fields: [
      'acknowledgement',
      'reportIssuedBy',
      'reportPickedBy',
      'reportContact',
      'reportDateTime',
      'sampleReceiptNumber',
    ],
  },
  { title: 'Review & Confirm', fields: [] },
];

export function NewProjectDialog({
  open,
  onOpenChange,
  onSubmit,
  processing,
}: NewProjectDialogProps) {
  const [currentStep, setCurrentStep] = React.useState(0);

  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      date: new Date(),
      projectIdBig: '',
      projectIdSmall: '',
      client: '',
      project: '',
      engineerInCharge: '',
      fieldTests: '',
      fieldTechnician: '',
      fieldRemarks: '',
      labTestsDescription: '',
      labTechnician: '',
      labAgreedDeliverySignature: '',
      labActualDeliverySignature: '',
      labRemarks: '',
      acknowledgement: '',
      reportIssuedBy: '',
      reportPickedBy: '',
      reportContact: '',
      sampleReceiptNumber: '',
    },
  });

  const handleSubmit = (data: ProjectFormValues) => {
    const formattedData = {
        ...data,
        date: data.date ? format(data.date, 'yyyy-MM-dd') : '',
        fieldStartDate: data.fieldStartDate ? format(data.fieldStartDate, 'yyyy-MM-dd') : '',
        fieldEndDate: data.fieldEndDate ? format(data.fieldEndDate, 'yyyy-MM-dd') : '',
        labStartDate: data.labStartDate ? format(data.labStartDate, 'yyyy-MM-dd') : '',
        labAgreedDeliveryDate: data.labAgreedDeliveryDate ? format(data.labAgreedDeliveryDate, 'yyyy-MM-dd') : '',
        labActualDeliveryDate: data.labActualDeliveryDate ? format(data.labActualDeliveryDate, 'yyyy-MM-dd') : '',
        reportDateTime: data.reportDateTime ? data.reportDateTime.toISOString() : '',
    };
    onSubmit(formattedData as any);
  };

  const handleNext = async () => {
    const fields = steps[currentStep].fields as (keyof ProjectFormValues)[];
    const isValid = await form.trigger(fields);
    if (isValid && currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };
  
   React.useEffect(() => {
    if (!open) {
      form.reset();
      setCurrentStep(0);
    }
  }, [open, form]);
  
  const formData = form.watch();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>New Project Instruction</DialogTitle>
          <DialogDescription>
            Step {currentStep + 1} of {steps.length}: {steps[currentStep].title}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)}>
            <ScrollArea className="h-[60vh] p-1">
              <div className="px-4">
                {currentStep === 0 && ( // Project & Client
                  <div className="grid grid-cols-2 gap-4">
                    <FormField control={form.control} name="date" render={({ field }) => <FormItem><FormLabel>Date</FormLabel><FormControl><Input type="date" defaultValue={format(new Date(), 'yyyy-MM-dd')} onChange={e => field.onChange(new Date(e.target.value))} /></FormControl><FormMessage /></FormItem>} />
                    <FormField control={form.control} name="engineerInCharge" render={({ field }) => <FormItem><FormLabel>Engineer In Charge</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>} />
                    <FormField control={form.control} name="projectIdBig" render={({ field }) => <FormItem><FormLabel>Project ID (BIG)</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>} />
                    <FormField control={form.control} name="projectIdSmall" render={({ field }) => <FormItem><FormLabel>Project ID (Small/Samples)</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>} />
                    <FormField control={form.control} name="client" render={({ field }) => <FormItem className="col-span-2"><FormLabel>Client</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>} />
                    <FormField control={form.control} name="project" render={({ field }) => <FormItem className="col-span-2"><FormLabel>Project</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>} />
                  </div>
                )}
                {currentStep === 1 && ( // Field Work
                  <div className="space-y-4">
                     <FormField control={form.control} name="fieldTests" render={({ field }) => <FormItem><FormLabel>Field Tests in Detail</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>} />
                     <FormField control={form.control} name="fieldTechnician" render={({ field }) => <FormItem><FormLabel>Field Technician</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>} />
                     <div className="grid grid-cols-2 gap-4">
                        <FormField control={form.control} name="fieldStartDate" render={({ field }) => <FormItem><FormLabel>Start Date</FormLabel><FormControl><Input type="date" onChange={e => field.onChange(new Date(e.target.value))} /></FormControl><FormMessage /></FormItem>} />
                        <FormField control={form.control} name="fieldEndDate" render={({ field }) => <FormItem><FormLabel>End Date</FormLabel><FormControl><Input type="date" onChange={e => field.onChange(new Date(e.target.value))} /></FormControl><FormMessage /></FormItem>} />
                     </div>
                     <FormField control={form.control} name="fieldRemarks" render={({ field }) => <FormItem><FormLabel>Field Remarks</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>} />
                  </div>
                )}
                {currentStep === 2 && ( // Lab Testing
                  <div className="space-y-4">
                    <FormField control={form.control} name="labTestsDescription" render={({ field }) => <FormItem><FormLabel>Lab Test Description</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>} />
                    <div className="grid grid-cols-2 gap-4">
                        <FormField control={form.control} name="labTechnician" render={({ field }) => <FormItem><FormLabel>Lab Technician</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>} />
                        <FormField control={form.control} name="labAgreedDeliverySignature" render={({ field }) => <FormItem><FormLabel>Signature (Agreed)</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>} />
                    </div>
                     <div className="grid grid-cols-2 gap-4">
                        <FormField control={form.control} name="labStartDate" render={({ field }) => <FormItem><FormLabel>Start Date</FormLabel><FormControl><Input type="date" onChange={e => field.onChange(new Date(e.target.value))} /></FormControl><FormMessage /></FormItem>} />
                        <FormField control={form.control} name="labAgreedDeliveryDate" render={({ field }) => <FormItem><FormLabel>Agreed Delivery Date</FormLabel><FormControl><Input type="date" onChange={e => field.onChange(new Date(e.target.value))} /></FormControl><FormMessage /></FormItem>} />
                    </div>
                     <div className="grid grid-cols-2 gap-4">
                        <FormField control={form.control} name="labActualDeliveryDate" render={({ field }) => <FormItem><FormLabel>Actual Delivery Date</FormLabel><FormControl><Input type="date" onChange={e => field.onChange(new Date(e.target.value))} /></FormControl><FormMessage /></FormItem>} />
                        <FormField control={form.control} name="labActualDeliverySignature" render={({ field }) => <FormItem><FormLabel>Signature (Actual)</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>} />
                    </div>
                    <FormField control={form.control} name="labRemarks" render={({ field }) => <FormItem><FormLabel>Lab Remarks</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>} />
                  </div>
                )}
                {currentStep === 3 && ( // Reporting
                   <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <FormField control={form.control} name="reportIssuedBy" render={({ field }) => <FormItem><FormLabel>Report Issued By</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>} />
                            <FormField control={form.control} name="reportPickedBy" render={({ field }) => <FormItem><FormLabel>Report Picked By/Delivered To</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>} />
                            <FormField control={form.control} name="reportContact" render={({ field }) => <FormItem><FormLabel>Contact</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>} />
                            <FormField control={form.control} name="reportDateTime" render={({ field }) => <FormItem><FormLabel>Date & Time</FormLabel><FormControl><Input type="datetime-local" onChange={e => field.onChange(new Date(e.target.value))} /></FormControl><FormMessage /></FormItem>} />
                        </div>
                         <FormField control={form.control} name="sampleReceiptNumber" render={({ field }) => <FormItem><FormLabel>Sample Receipt Number</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>} />
                         <FormField control={form.control} name="acknowledgement" render={({ field }) => <FormItem><FormLabel>Acknowledgement after Delivery</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>} />
                   </div>
                )}
                 {currentStep === 4 && (
                   <div className="space-y-4 text-sm">
                       <h3 className="font-bold text-lg text-center mb-4">Review Details</h3>
                       <div className="grid grid-cols-2 gap-x-8 gap-y-4 p-4 border rounded-lg">
                           <div><strong>Date:</strong> {formData.date ? format(new Date(formData.date), 'PPP') : 'N/A'}</div>
                           <div><strong>Engineer:</strong> {formData.engineerInCharge || 'N/A'}</div>
                           <div className="col-span-2"><strong>Client:</strong> {formData.client || 'N/A'}</div>
                           <div className="col-span-2"><strong>Project:</strong> {formData.project || 'N/A'}</div>
                           <div><strong>Project ID (Big):</strong> {formData.projectIdBig || 'N/A'}</div>
                           <div><strong>Project ID (Small):</strong> {formData.projectIdSmall || 'N/A'}</div>
                           
                           <div className="col-span-2"><Separator className="my-2"/></div>

                           <div className="col-span-2"><strong>Field Work:</strong> {formData.fieldTests || 'N/A'}</div>
                           <div><strong>Field Tech:</strong> {formData.fieldTechnician || 'N/A'}</div>
                           <div><strong>Dates:</strong> {formData.fieldStartDate ? format(new Date(formData.fieldStartDate), 'PPP') : 'N/A'} to {formData.fieldEndDate ? format(new Date(formData.fieldEndDate), 'PPP') : 'N/A'}</div>
                           
                           <div className="col-span-2"><Separator className="my-2"/></div>

                           <div className="col-span-2"><strong>Lab Work:</strong> {formData.labTestsDescription || 'N/A'}</div>
                           <div><strong>Lab Tech:</strong> {formData.labTechnician || 'N/A'}</div>
                           <div><strong>Lab Dates:</strong> {formData.labStartDate ? format(new Date(formData.labStartDate), 'PPP') : 'N/A'} to {formData.labAgreedDeliveryDate ? format(new Date(formData.labAgreedDeliveryDate), 'PPP') : 'N/A'}</div>
                           
                           <div className="col-span-2"><Separator className="my-2"/></div>

                           <div><strong>Report Issued By:</strong> {formData.reportIssuedBy || 'N/A'}</div>
                           <div><strong>Report Picked By:</strong> {formData.reportPickedBy || 'N/A'}</div>
                       </div>
                   </div>
                )}
              </div>
            </ScrollArea>
            <DialogFooter className="pt-4 mt-4 border-t">
              <div className="w-full flex justify-between">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={handleBack}
                  disabled={currentStep === 0 || processing}
                >
                  Back
                </Button>
                <div className="flex gap-2">
                  <DialogClose asChild>
                    <Button type="button" variant="outline" disabled={processing}>
                      Cancel
                    </Button>
                  </DialogClose>
                  {currentStep < steps.length - 1 ? (
                    <Button type="button" onClick={handleNext}>
                      Next
                    </Button>
                  ) : (
                    <Button type="submit" disabled={processing}>
                      {processing && (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      )}
                      Confirm & Create
                    </Button>
                  )}
                </div>
              </div>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
