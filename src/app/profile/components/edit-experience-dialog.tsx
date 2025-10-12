"use client";

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Loader2, Upload, X, FileText } from 'lucide-react';
import { ProfileExperience } from '@/lib/types';
import { DatePicker } from '@/app/samples/components/date-picker';

const experienceSchema = z.object({
    title: z.string().min(2, "Title is required."),
    company: z.string().min(2, "Company name is required."),
    location: z.string().optional(),
    startDate: z.date({ required_error: "Start date is required." }),
    endDate: z.date().optional(),
    isCurrentRole: z.boolean().optional(),
    description: z.string().optional(),
    documents: z.array(z.object({
        id: z.string(),
        name: z.string(),
        file: z.any(),
    })).optional(),
});

type ExperienceFormData = z.infer<typeof experienceSchema>;

interface EditExperienceDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: ProfileExperience, documents: File[]) => Promise<void>;
    experience: ProfileExperience | null;
}

export function EditExperienceDialog({ isOpen, onClose, onSave, experience }: EditExperienceDialogProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
    const [dragActive, setDragActive] = useState(false);

    const form = useForm<ExperienceFormData>({
        resolver: zodResolver(experienceSchema),
        defaultValues: {
            title: '',
            company: '',
            location: '',
            description: '',
            isCurrentRole: false,
            documents: [],
        },
    });

    useEffect(() => {
        if (experience && isOpen) {
            form.reset({
                title: experience.title,
                company: experience.company,
                location: experience.location || '',
                description: experience.description || '',
                startDate: new Date(experience.startDate),
                endDate: experience.endDate ? new Date(experience.endDate) : undefined,
                isCurrentRole: !experience.endDate,
            });
            setUploadedFiles([]);
        }
    }, [experience, isOpen, form]);

    const handleFileUpload = (files: FileList | null) => {
        if (files) {
            const newFiles = Array.from(files);
            setUploadedFiles(prev => [...prev, ...newFiles]);
        }
    };

    const removeFile = (index: number) => {
        setUploadedFiles(prev => prev.filter((_, i) => i !== index));
    };

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFileUpload(e.dataTransfer.files);
        }
    };

    const handleFormSubmit = async (data: ExperienceFormData) => {
        if (!experience) return;
        
        setIsSubmitting(true);
        
        // Prepare the data object, filtering out undefined values
        const dataToSave: ProfileExperience = {
            ...experience,
            title: data.title,
            company: data.company,
            location: data.location,
            startDate: data.startDate.toISOString(),
            description: data.description,
        };

        // Only include endDate if it's not a current role and has a value
        if (!data.isCurrentRole && data.endDate) {
            dataToSave.endDate = data.endDate.toISOString();
        } else {
            delete dataToSave.endDate;
        }

        await onSave(dataToSave, uploadedFiles);
        setIsSubmitting(false);
        form.reset();
        setUploadedFiles([]);
    };
    
    React.useEffect(() => {
        if (!isOpen) {
            form.reset();
            setUploadedFiles([]);
        }
    }, [isOpen, form]);

    React.useEffect(() => {
        const isCurrentRole = form.watch('isCurrentRole');
        if (isCurrentRole) {
            form.setValue('endDate', undefined);
        }
    }, [form.watch('isCurrentRole'), form]);

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-lg max-h-[80vh] flex flex-col">
                <DialogHeader>
                    <DialogTitle>Edit Work Experience</DialogTitle>
                    <DialogDescription>Update the details of your work experience.</DialogDescription>
                </DialogHeader>
                <div className="flex-1 overflow-y-auto pr-2">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                             <FormField control={form.control} name="company" render={({ field }) => (
                                <FormItem><FormLabel>Company Name *</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                            )}/>
                             <FormField control={form.control} name="title" render={({ field }) => (
                                <FormItem><FormLabel>Job Title *</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                            )}/>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <FormField control={form.control} name="startDate" render={({ field }) => (
                                <FormItem className="flex flex-col"><FormLabel>Start Date *</FormLabel><DatePicker value={field.value} onChange={field.onChange} /><FormMessage /></FormItem>
                            )}/>
                            <div className="space-y-2">
                                <FormField control={form.control} name="endDate" render={({ field }) => (
                                    <FormItem className="flex flex-col"><FormLabel>End Date</FormLabel><DatePicker value={form.watch('isCurrentRole') ? undefined : field.value} onChange={field.onChange} /><FormMessage /></FormItem>
                                )}/>
                                <FormField control={form.control} name="isCurrentRole" render={({ field }) => (
                                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                        <FormControl>
                                            <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                                        </FormControl>
                                        <div className="space-y-1 leading-none">
                                            <FormLabel>To Date (Current Role)</FormLabel>
                                        </div>
                                    </FormItem>
                                )}/>
                            </div>
                        </div>
                        <FormField control={form.control} name="location" render={({ field }) => (
                            <FormItem><FormLabel>Location</FormLabel><FormControl><Input {...field} placeholder="e.g., Kampala, Uganda"/></FormControl><FormMessage /></FormItem>
                        )}/>
                        <FormField control={form.control} name="description" render={({ field }) => (
                            <FormItem><FormLabel>Description</FormLabel><FormControl><Textarea {...field} rows={8} placeholder="Describe your responsibilities..." /></FormControl><FormMessage /></FormItem>
                        )}/>

                        {/* Document Upload Section */}
                        <div className="space-y-4">
                            <div>
                                <FormLabel>Work Documents</FormLabel>
                                <p className="text-sm text-muted-foreground mb-2">Upload additional certificates, contracts, or other work-related documents for this experience.</p>
                            </div>
                            
                            {/* File Upload Area */}
                            <div
                                className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                                    dragActive 
                                        ? 'border-primary bg-primary/5' 
                                        : 'border-muted-foreground/25 hover:border-primary/50'
                                }`}
                                onDragEnter={handleDrag}
                                onDragLeave={handleDrag}
                                onDragOver={handleDrag}
                                onDrop={handleDrop}
                            >
                                <Upload className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                                <p className="text-sm text-muted-foreground mb-2">
                                    Drag and drop files here, or click to select files
                                </p>
                                <input
                                    type="file"
                                    multiple
                                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                                    onChange={(e) => handleFileUpload(e.target.files)}
                                    className="hidden"
                                    id="file-upload-experience-edit"
                                />
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => document.getElementById('file-upload-experience-edit')?.click()}
                                >
                                    Select Files
                                </Button>
                            </div>

                            {/* Uploaded Files List */}
                            {uploadedFiles.length > 0 && (
                                <div className="space-y-2">
                                    <p className="text-sm font-medium">New Files to Upload:</p>
                                    {uploadedFiles.map((file, index) => (
                                        <div key={index} className="flex items-center justify-between p-2 bg-muted/50 rounded-md">
                                            <div className="flex items-center gap-2">
                                                <FileText className="h-4 w-4 text-muted-foreground" />
                                                <span className="text-sm">{file.name}</span>
                                                <span className="text-xs text-muted-foreground">
                                                    ({(file.size / 1024 / 1024).toFixed(2)} MB)
                                                </span>
                                            </div>
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon"
                                                className="h-6 w-6"
                                                onClick={() => removeFile(index)}
                                            >
                                                <X className="h-3 w-3" />
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                        </form>
                    </Form>
                </div>
                <DialogFooter className="mt-4">
                    <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>Cancel</Button>
                    <Button type="submit" disabled={isSubmitting} onClick={form.handleSubmit(handleFormSubmit)}>
                        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Update Experience
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
