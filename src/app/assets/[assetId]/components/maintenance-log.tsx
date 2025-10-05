
"use client";

import React, { useState } from 'react';
import { MaintenanceRecord, MAINTENANCE_TYPES, User } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { PlusCircle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DatePicker } from '@/app/samples/components/date-picker';
import { Loader2 } from 'lucide-react';

const formSchema = z.object({
    date: z.date({ required_error: 'Maintenance date is required.' }),
    technician: z.string().min(1, 'Technician name is required.'),
    type: z.enum(MAINTENANCE_TYPES),
    description: z.string().min(1, 'Description is required.'),
    cost: z.coerce.number().optional(),
});

type MaintenanceFormData = z.infer<typeof formSchema>;

interface MaintenanceLogProps {
    maintenance: MaintenanceRecord[];
    onAddMaintenance: (data: MaintenanceFormData) => Promise<void>;
    currentUser: User | null;
}

export function MaintenanceLog({ maintenance, onAddMaintenance, currentUser }: MaintenanceLogProps) {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const form = useForm<MaintenanceFormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            date: new Date(),
            technician: currentUser?.displayName || '',
            type: 'Preventive',
            description: '',
        },
    });

    const handleSubmit = async (data: MaintenanceFormData) => {
        setIsSubmitting(true);
        await onAddMaintenance(data);
        setIsSubmitting(false);
        setIsDialogOpen(false);
        form.reset();
    };

    return (
        <>
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle>Maintenance History</CardTitle>
                            <CardDescription>Log and view all maintenance events for this asset.</CardDescription>
                        </div>
                        <Button onClick={() => setIsDialogOpen(true)}><PlusCircle className="mr-2 h-4 w-4"/>Log Maintenance</Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Date</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>Technician</TableHead>
                                <TableHead>Description</TableHead>
                                <TableHead>Cost</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {maintenance.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="h-24 text-center">
                                        No maintenance records found.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                maintenance.map(maint => (
                                    <TableRow key={maint.id}>
                                        <TableCell>{format(new Date(maint.date), 'PPP')}</TableCell>
                                        <TableCell>{maint.type}</TableCell>
                                        <TableCell>{maint.technician}</TableCell>
                                        <TableCell>{maint.description}</TableCell>
                                        <TableCell>{maint.cost ? `$${maint.cost.toLocaleString()}` : 'N/A'}</TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Log New Maintenance</DialogTitle>
                    </DialogHeader>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                            <FormField control={form.control} name="date" render={({ field }) => (
                                <FormItem className="flex flex-col"><FormLabel>Date *</FormLabel><DatePicker value={field.value} onChange={field.onChange} /><FormMessage /></FormItem>
                            )}/>
                            <FormField control={form.control} name="technician" render={({ field }) => (
                                <FormItem><FormLabel>Technician *</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                            )}/>
                            <FormField control={form.control} name="type" render={({ field }) => (
                                <FormItem><FormLabel>Type *</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl><SelectContent>{MAINTENANCE_TYPES.map(t => (<SelectItem key={t} value={t}>{t}</SelectItem>))}</SelectContent></Select><FormMessage /></FormItem>
                            )}/>
                            <FormField control={form.control} name="description" render={({ field }) => (
                                <FormItem><FormLabel>Description *</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>
                            )}/>
                            <FormField control={form.control} name="cost" render={({ field }) => (
                                <FormItem><FormLabel>Cost</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                            )}/>
                            <DialogFooter>
                                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)} disabled={isSubmitting}>Cancel</Button>
                                <Button type="submit" disabled={isSubmitting}>
                                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin"/>}
                                    Save Record
                                </Button>
                            </DialogFooter>
                        </form>
                    </Form>
                </DialogContent>
            </Dialog>
        </>
    );
}
