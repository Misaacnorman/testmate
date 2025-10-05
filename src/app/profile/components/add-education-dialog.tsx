
"use client";

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Loader2 } from 'lucide-react';
import { ProfileEducation } from '@/lib/types';
import { DatePicker } from '@/app/samples/components/date-picker';

const educationSchema = z.object({
    institution: z.string().min(2, "Institution name is required."),
    degree: z.string().min(2, "Degree is required."),
    fieldOfStudy: z.string().min(2, "Field of study is required."),
    startDate: z.date({ required_error: "Start date is required." }),
    endDate: z.date().optional(),
});

type EducationFormData = z.infer<typeof educationSchema>;

interface AddEducationDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: Omit<ProfileEducation, 'id'>) => Promise<void>;
}

export function AddEducationDialog({ isOpen, onClose, onSave }: AddEducationDialogProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const form = useForm<EducationFormData>({
        resolver: zodResolver(educationSchema),
        defaultValues: {
            institution: '',
            degree: '',
            fieldOfStudy: '',
        },
    });

    const handleFormSubmit = async (data: EducationFormData) => {
        setIsSubmitting(true);
        const dataToSave = {
            ...data,
            startDate: data.startDate.toISOString(),
            endDate: data.endDate?.toISOString(),
        }
        await onSave(dataToSave);
        setIsSubmitting(false);
        form.reset();
    };
    
    React.useEffect(() => {
        if (!isOpen) {
            form.reset();
        }
    }, [isOpen, form]);

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>Add Education</DialogTitle>
                    <DialogDescription>Fill in the details of your academic background.</DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4">
                        <FormField control={form.control} name="institution" render={({ field }) => (
                           <FormItem><FormLabel>Institution *</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                       )}/>
                       <FormField control={form.control} name="degree" render={({ field }) => (
                           <FormItem><FormLabel>Degree *</FormLabel><FormControl><Input {...field} placeholder="e.g., Bachelor of Science" /></FormControl><FormMessage /></FormItem>
                       )}/>
                       <FormField control={form.control} name="fieldOfStudy" render={({ field }) => (
                           <FormItem><FormLabel>Field of Study *</FormLabel><FormControl><Input {...field} placeholder="e.g., Civil Engineering" /></FormControl><FormMessage /></FormItem>
                       )}/>
                       <div className="grid grid-cols-2 gap-4">
                           <FormField control={form.control} name="startDate" render={({ field }) => (
                               <FormItem className="flex flex-col"><FormLabel>Start Date *</FormLabel><DatePicker value={field.value} onChange={field.onChange} /><FormMessage /></FormItem>
                           )}/>
                            <FormField control={form.control} name="endDate" render={({ field }) => (
                               <FormItem className="flex flex-col"><FormLabel>End Date</FormLabel><DatePicker value={field.value} onChange={field.onChange} /><FormMessage /></FormItem>
                           )}/>
                       </div>

                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>Cancel</Button>
                            <Button type="submit" disabled={isSubmitting}>
                                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Save Education
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
