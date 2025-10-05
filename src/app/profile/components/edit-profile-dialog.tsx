
"use client";

import React, { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, X } from 'lucide-react';
import { User } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { Label } from "@/components/ui/label";

const profileSchema = z.object({
    headline: z.string().optional(),
    location: z.string().optional(),
    bio: z.string().optional(),
    skills: z.array(z.string()).optional(),
    contact: z.object({
        phone: z.string().optional(),
    }).optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

interface EditProfileDialogProps {
    isOpen: boolean;
    onClose: () => void;
    user: User;
    onSave: (data: ProfileFormData) => Promise<void>;
}

export function EditProfileDialog({ isOpen, onClose, user, onSave }: EditProfileDialogProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [skillInput, setSkillInput] = useState('');

    const form = useForm<ProfileFormData>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            headline: user.headline || '',
            location: user.location || '',
            bio: user.bio || '',
            skills: user.skills || [],
            contact: {
                phone: user.contact?.phone || '',
            }
        },
    });

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "skills",
    });

    useEffect(() => {
        form.reset({
            headline: user.headline || '',
            location: user.location || '',
            bio: user.bio || '',
            skills: user.skills || [],
            contact: {
                phone: user.contact?.phone || '',
            }
        });
    }, [user, form]);
    
    const handleSkillKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && skillInput.trim() !== '') {
            e.preventDefault();
            if (!fields.some(field => field.value === skillInput.trim())) {
                append(skillInput.trim());
            }
            setSkillInput('');
        }
    };

    const handleFormSubmit = async (data: ProfileFormData) => {
        setIsSubmitting(true);
        await onSave(data);
        setIsSubmitting(false);
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>Edit Profile</DialogTitle>
                    <DialogDescription>Make changes to your public profile.</DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4">
                         <FormField
                            control={form.control}
                            name="headline"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Headline</FormLabel>
                                    <FormControl><Input {...field} placeholder="e.g., Materials Engineer" /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                         <FormField
                            control={form.control}
                            name="location"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Location</FormLabel>
                                    <FormControl><Input {...field} placeholder="e.g., Kampala, Uganda" /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="contact.phone"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Phone Number</FormLabel>
                                    <FormControl><Input {...field} placeholder="+256 123 456789" /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                         <FormField
                            control={form.control}
                            name="bio"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>About</FormLabel>
                                    <FormControl><Textarea {...field} rows={5} placeholder="Write a short professional summary..." /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="space-y-2">
                             <Label>Skills</Label>
                             <div className="flex flex-wrap gap-2 rounded-md border p-2">
                                {fields.map((field, index) => (
                                    <Badge key={field.id} variant="secondary">
                                        {field.value}
                                        <button type="button" onClick={() => remove(index)} className="ml-1 rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2">
                                            <X className="h-3 w-3" />
                                        </button>
                                    </Badge>
                                ))}
                                <Input 
                                    className="flex-1 h-auto p-0 px-1 border-none shadow-none focus-visible:ring-0" 
                                    value={skillInput} 
                                    onChange={e => setSkillInput(e.target.value)} 
                                    onKeyDown={handleSkillKeyDown}
                                    placeholder="Add a skill and press Enter"
                                />
                             </div>
                        </div>

                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>Cancel</Button>
                            <Button type="submit" disabled={isSubmitting}>
                                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Save Changes
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
