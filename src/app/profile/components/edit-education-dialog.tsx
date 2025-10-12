"use client";

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Loader2, Upload, X, FileText } from 'lucide-react';
import { ProfileEducation } from '@/lib/types';
import { DatePicker } from '@/app/samples/components/date-picker';

const educationSchema = z.object({
    institution: z.string().min(2, "Institution name is required."),
    degree: z.string().min(2, "Degree is required."),
    fieldOfStudy: z.string().min(2, "Field of study is required."),
    startDate: z.date({ required_error: "Start date is required." }),
    endDate: z.date().optional(),
    isCurrentEducation: z.boolean().optional(),
    documents: z.array(z.object({
        id: z.string(),
        name: z.string(),
        file: z.any(),
    })).optional(),
});

type EducationFormData = z.infer<typeof educationSchema>;

interface EditEducationDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: ProfileEducation, documents: File[]) => Promise<void>;
    education: ProfileEducation | null;
}

export function EditEducationDialog({ isOpen, onClose, onSave, education }: EditEducationDialogProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
    const [dragActive, setDragActive] = useState(false);

    const form = useForm<EducationFormData>({
        resolver: zodResolver(educationSchema),
        defaultValues: {
            institution: '',
            degree: '',
            fieldOfStudy: '',
            isCurrentEducation: false,
            documents: [],
        },
    });

    useEffect(() => {
        if (education && isOpen) {
            form.reset({
                institution: education.institution,
                degree: education.degree,
                fieldOfStudy: education.fieldOfStudy,
                startDate: new Date(education.startDate),
                endDate: education.endDate ? new Date(education.endDate) : undefined,
                isCurrentEducation: !education.endDate,
            });
            setUploadedFiles([]);
        }
    }, [education, isOpen, form]);

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

    const handleFormSubmit = async (data: EducationFormData) => {
        if (!education) return;
        
        setIsSubmitting(true);
        
        // Prepare the data object, filtering out undefined values
        const dataToSave: ProfileEducation = {
            ...education,
            institution: data.institution,
            degree: data.degree,
            fieldOfStudy: data.fieldOfStudy,
            startDate: data.startDate.toISOString(),
        };

        // Only include endDate if it's not current education and has a value
        if (!data.isCurrentEducation && data.endDate) {
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
        const isCurrentEducation = form.watch('isCurrentEducation');
        if (isCurrentEducation) {
            form.setValue('endDate', undefined);
        }
    }, [form.watch('isCurrentEducation'), form]);

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-lg max-h-[80vh] flex flex-col">
                <DialogHeader>
                    <DialogTitle>Edit Education</DialogTitle>
                    <DialogDescription>Update the details of your academic background.</DialogDescription>
                </DialogHeader>
                <div className="flex-1 overflow-y-auto pr-2">
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
                           <div className="space-y-2">
                               <FormField control={form.control} name="endDate" render={({ field }) => (
                                   <FormItem className="flex flex-col"><FormLabel>End Date</FormLabel><DatePicker value={form.watch('isCurrentEducation') ? undefined : field.value} onChange={field.onChange} /><FormMessage /></FormItem>
                               )}/>
                               <FormField control={form.control} name="isCurrentEducation" render={({ field }) => (
                                   <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                       <FormControl>
                                           <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                                       </FormControl>
                                       <div className="space-y-1 leading-none">
                                           <FormLabel>To Date (Current Education)</FormLabel>
                                       </div>
                                   </FormItem>
                               )}/>
                           </div>
                       </div>

                        {/* Document Upload Section */}
                        <div className="space-y-4">
                            <div>
                                <FormLabel>Academic Documents</FormLabel>
                                <p className="text-sm text-muted-foreground mb-2">Upload additional certificates, transcripts, or other academic documents related to this education entry.</p>
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
                                    id="file-upload-edit"
                                />
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => document.getElementById('file-upload-edit')?.click()}
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
                        Update Education
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
