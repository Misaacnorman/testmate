
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
import { AcademicDocument } from '@/lib/types';

const documentSchema = z.object({
    name: z.string().min(3, "Document name must be at least 3 characters."),
    url: z.string().url("Please enter a valid URL."),
});

type DocumentFormData = Omit<AcademicDocument, 'id' | 'uploadedAt'>;

interface AddDocumentDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: DocumentFormData) => Promise<void>;
}

export function AddDocumentDialog({ isOpen, onClose, onSave }: AddDocumentDialogProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const form = useForm<DocumentFormData>({
        resolver: zodResolver(documentSchema),
        defaultValues: {
            name: '',
            url: '',
        },
    });

    const handleFormSubmit = async (data: DocumentFormData) => {
        setIsSubmitting(true);
        await onSave(data);
        setIsSubmitting(false);
        form.reset();
    };
    
    // Reset form when dialog closes
    React.useEffect(() => {
        if (!isOpen) {
            form.reset();
        }
    }, [isOpen, form]);

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Add Academic Document</DialogTitle>
                    <DialogDescription>Upload your document to a cloud service (e.g., Google Drive, Dropbox) and paste the public link here.</DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Document Name</FormLabel>
                                    <FormControl><Input {...field} placeholder="e.g., Bachelor's Degree Certificate" /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                         <FormField
                            control={form.control}
                            name="url"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Document URL</FormLabel>
                                    <FormControl><Input {...field} placeholder="https://..." /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>Cancel</Button>
                            <Button type="submit" disabled={isSubmitting}>
                                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Save Document
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
