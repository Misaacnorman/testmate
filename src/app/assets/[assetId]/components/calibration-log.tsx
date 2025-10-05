
"use client";

import React, { useState } from 'react';
import { CalibrationRecord, CALIBRATION_RESULTS, User, Asset } from '@/lib/types';
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
  DialogDescription,
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
    date: z.date({ required_error: 'Calibration date is required.' }),
    technician: z.string().min(1, 'Technician name is required.'),
    result: z.enum(CALIBRATION_RESULTS),
    notes: z.string().optional(),
    certificateUrl: z.string().url().optional().or(z.literal('')),
});

type CalibrationFormData = z.infer<typeof formSchema>;

interface CalibrationLogProps {
    calibrations: CalibrationRecord[];
    onAddCalibration: (data: CalibrationFormData) => Promise<void>;
    asset: Asset;
    currentUser: User | null;
}

export function CalibrationLog({ calibrations, onAddCalibration, asset, currentUser }: CalibrationLogProps) {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const form = useForm<CalibrationFormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            date: new Date(),
            technician: currentUser?.displayName || '',
            result: 'Passed',
            notes: '',
            certificateUrl: ''
        },
    });

    const handleSubmit = async (data: CalibrationFormData) => {
        setIsSubmitting(true);
        await onAddCalibration(data);
        setIsSubmitting(false);
        setIsDialogOpen(false);
        form.reset();
    };
    
    if (!asset.isCalibrated) {
        return (
             <Card>
                <CardContent className="pt-6 text-center text-muted-foreground">
                    This asset does not require calibration.
                </CardContent>
            </Card>
        )
    }

    return (
        <>
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle>Calibration History</CardTitle>
                            <CardDescription>Log and view all calibration events for this asset.</CardDescription>
                        </div>
                        <Button onClick={() => setIsDialogOpen(true)}><PlusCircle className="mr-2 h-4 w-4"/>Log Calibration</Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Date</TableHead>
                                <TableHead>Technician</TableHead>
                                <TableHead>Result</TableHead>
                                <TableHead>Notes</TableHead>
                                <TableHead>Certificate</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {calibrations.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="h-24 text-center">
                                        No calibration records found.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                calibrations.map(cal => (
                                    <TableRow key={cal.id}>
                                        <TableCell>{format(new Date(cal.date), 'PPP')}</TableCell>
                                        <TableCell>{cal.technician}</TableCell>
                                        <TableCell>{cal.result}</TableCell>
                                        <TableCell>{cal.notes || 'N/A'}</TableCell>
                                        <TableCell>
                                            {cal.certificateUrl ? (
                                                <a href={cal.certificateUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">View</a>
                                            ) : 'N/A'}
                                        </TableCell>
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
                        <DialogTitle>Log New Calibration</DialogTitle>
                    </DialogHeader>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                            <FormField control={form.control} name="date" render={({ field }) => (
                                <FormItem className="flex flex-col"><FormLabel>Date *</FormLabel><DatePicker value={field.value} onChange={field.onChange} /><FormMessage /></FormItem>
                            )}/>
                            <FormField control={form.control} name="technician" render={({ field }) => (
                                <FormItem><FormLabel>Technician *</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                            )}/>
                             <FormField control={form.control} name="result" render={({ field }) => (
                                <FormItem><FormLabel>Result *</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl><SelectContent>{CALIBRATION_RESULTS.map(r => (<SelectItem key={r} value={r}>{r}</SelectItem>))}</SelectContent></Select><FormMessage /></FormItem>
                            )}/>
                            <FormField control={form.control} name="notes" render={({ field }) => (
                                <FormItem><FormLabel>Notes</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>
                            )}/>
                            <FormField control={form.control} name="certificateUrl" render={({ field }) => (
                                <FormItem><FormLabel>Certificate URL</FormLabel><FormControl><Input placeholder="https://..." {...field} /></FormControl><FormMessage /></FormItem>
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
