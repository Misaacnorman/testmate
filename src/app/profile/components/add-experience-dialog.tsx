
"use client";

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Loader2 } from 'lucide-react';
import { ProfileExperience } from '@/lib/types';
import { DatePicker } from '@/app/samples/components/date-picker';

const experienceSchema = z.object({
    title: z.string().min(2, "Title is required."),
    company: z.string().min(2, "Company name is required."),
    location: z.string().optional(),
    startDate: z.date({ required_error: "Start date is required." }),
    endDate: z.date().optional(),
    description: z.string().optional(),
});

type ExperienceFormData = z.infer<typeof experienceSchema>;

interface AddExperienceDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: Omit<ProfileExperience, 'id'>) => Promise<void>;
}

export function AddExperienceDialog({ isOpen, onClose, onSave }: AddExperienceDialogProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const form = useForm<ExperienceFormData>({
        resolver: zodResolver(experienceSchema),
        defaultValues: {
            title: '',
            company: '',
            location: '',
            description: '',
        },
    });

    const handleFormSubmit = async (data: ExperienceFormData) => {
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
                    <DialogTitle>Add Work Experience</DialogTitle>
                    <DialogDescription>Fill in the details of your past or current role.</DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                             <FormField control={form.control} name="title" render={({ field }) => (
                                <FormItem><FormLabel>Job Title *</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                            )}/>
                             <FormField control={form.control} name="company" render={({ field }) => (
                                <FormItem><FormLabel>Company Name *</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                            )}/>
                        </div>
                        <FormField control={form.control} name="location" render={({ field }) => (
                            <FormItem><FormLabel>Location</FormLabel><FormControl><Input {...field} placeholder="e.g., Kampala, Uganda"/></FormControl><FormMessage /></FormItem>
                        )}/>
                        <div className="grid grid-cols-2 gap-4">
                            <FormField control={form.control} name="startDate" render={({ field }) => (
                                <FormItem className="flex flex-col"><FormLabel>Start Date *</FormLabel><DatePicker value={field.value} onChange={field.onChange} /><FormMessage /></FormItem>
                            )}/>
                             <FormField control={form.control} name="endDate" render={({ field }) => (
                                <FormItem className="flex flex-col"><FormLabel>End Date</FormLabel><DatePicker value={field.value} onChange={field.onChange} /><FormMessage /></FormItem>
                            )}/>
                        </div>
                        <FormField control={form.control} name="description" render={({ field }) => (
                            <FormItem><FormLabel>Description</FormLabel><FormControl><Textarea {...field} rows={4} placeholder="Describe your responsibilities..." /></FormControl><FormMessage /></FormItem>
                        )}/>

                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>Cancel</Button>
                            <Button type="submit" disabled={isSubmitting}>
                                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Save Experience
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
