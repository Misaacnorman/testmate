
'use client';

import * as React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { format, parseISO } from 'date-fns';

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
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { GroupedWaterAbsorptionSample } from '@/lib/types';
import { useAuth } from '@/hooks/use-auth';

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

type FormValues = z.infer<typeof issueSchema>;

interface IssueCertificateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sampleSet: GroupedWaterAbsorptionSample;
  onSave: (data: FormValues) => void;
}

export function IssueCertificateDialog({ open, onOpenChange, sampleSet, onSave }: IssueCertificateDialogProps) {
  const { user } = useAuth();
  
  const form = useForm<FormValues>({
    resolver: zodResolver(issueSchema),
    defaultValues: {
      certificateNumber: sampleSet.certificateNumber || '',
      comment: sampleSet.comment || '',
      technician: sampleSet.technician || user?.displayName || user?.email || '',
      dateOfIssue: sampleSet.dateOfIssue ? format(parseISO(sampleSet.dateOfIssue), 'yyyy-MM-dd') : (sampleSet.testingDate ? format(parseISO(sampleSet.testingDate), 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd')),
      issueId: sampleSet.issueId || '',
      takenBy: sampleSet.takenBy || '',
      dateTaken: sampleSet.dateTaken ? format(parseISO(sampleSet.dateTaken), 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd'),
      contact: sampleSet.contact || '',
    },
  });

  React.useEffect(() => {
    if (sampleSet) {
      form.reset({
        certificateNumber: sampleSet.certificateNumber || '',
        comment: sampleSet.comment || '',
        technician: sampleSet.technician || user?.displayName || user?.email || '',
        dateOfIssue: sampleSet.dateOfIssue ? format(parseISO(sampleSet.dateOfIssue), 'yyyy-MM-dd') : (sampleSet.testingDate ? format(parseISO(sampleSet.testingDate), 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd')),
        issueId: sampleSet.issueId || '',
        takenBy: sampleSet.takenBy || '',
        dateTaken: sampleSet.dateTaken ? format(parseISO(sampleSet.dateTaken), 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd'),
        contact: sampleSet.contact || '',
      });
    }
  }, [sampleSet, user, form]);

  const handleSubmit = (data: FormValues) => {
    onSave(data);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Issue Certificate</DialogTitle>
          <DialogDescription>
            Enter the final details for the certificate for Receipt ID: {sampleSet.receiptId}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 p-1">
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
            <div className="space-y-2 md:col-span-2">
              <Label>Contact</Label>
              <Controller name="contact" control={form.control} render={({ field }) => <Input {...field} />} />
              {form.formState.errors.contact && <p className="text-destructive text-xs">{form.formState.errors.contact.message}</p>}
            </div>
          </div>
          <DialogFooter className="pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit">Save & Issue</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
