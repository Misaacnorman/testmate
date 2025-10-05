
"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/auth-context';
import { RejectionDialog } from './rejection-dialog';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { CertificateStatus } from '@/lib/types';
import { useRouter } from 'next/navigation';

type Certificate = any;

interface ApprovalTaskTableProps {
  title: string;
  description: string;
  tasks: Certificate[];
  onRefresh: () => void;
  approvalLevel: 'initial' | 'final';
  loading: boolean;
  onViewCertificate: (cert: Certificate) => void;
}

export function ApprovalTaskTable({ title, description, tasks, onRefresh, approvalLevel, loading, onViewCertificate }: ApprovalTaskTableProps) {
    const { toast } = useToast();
    const { user } = useAuth();
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState<string | null>(null);
    const [rejectingTask, setRejectingTask] = useState<Certificate | null>(null);

    const handleApprove = async (task: Certificate) => {
        if (!user) return;
        
        if (!user.signatureURL) {
            toast({
                variant: 'destructive',
                title: 'Signature Required',
                description: 'Please upload your signature in your profile before approving certificates.',
            });
            router.push('/profile');
            return;
        }

        setIsSubmitting(task.id);
        
        const nextStatus = approvalLevel === 'initial' ? 'Pending Final Approval' : 'Approved';
        const approvalField = approvalLevel === 'initial' ? 'approvedByEngineer' : 'approvedByManager';

        try {
            const docRef = doc(db, task.collection, task.id);
            await updateDoc(docRef, {
                status: nextStatus,
                [approvalField]: { uid: user.uid, name: user.name, date: new Date().toISOString() }
            });
            toast({ title: 'Approved', description: `Certificate ${task.certificateNumber} has been approved.` });
            onRefresh();
        } catch (error) {
            console.error("Error approving certificate:", error);
            toast({ variant: 'destructive', title: 'Error', description: 'Failed to approve certificate.' });
        } finally {
            setIsSubmitting(null);
        }
    };

    const handleReject = async (reason: string) => {
        if (!rejectingTask || !user) return;
        setIsSubmitting(rejectingTask.id);

        const nextStatus = approvalLevel === 'final' ? 'Pending Initial Approval' : 'Rejected';

        try {
            const docRef = doc(db, rejectingTask.collection, rejectingTask.id);
            await updateDoc(docRef, {
                status: nextStatus,
                rejectionReason: reason,
                rejectedBy: { uid: user.uid, name: user.name, date: new Date().toISOString() }
            });
            toast({ title: 'Rejected', description: `Certificate ${rejectingTask.certificateNumber} has been sent back.` });
            onRefresh();
        } catch (error) {
            console.error("Error rejecting certificate:", error);
            toast({ variant: 'destructive', title: 'Error', description: 'Failed to reject certificate.' });
        } finally {
            setIsSubmitting(null);
            setRejectingTask(null);
        }
    };

    return (
        <>
            <Card>
                <CardHeader>
                    <CardTitle>{title}</CardTitle>
                    <CardDescription>{description}</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Cert. No</TableHead>
                                    <TableHead>Client</TableHead>
                                    <TableHead>Project</TableHead>
                                    <TableHead>Tested By</TableHead>
                                    <TableHead>Date of Issue</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {loading ? (
                                    <TableRow>
                                        <TableCell colSpan={6} className="h-24 text-center">
                                            <Loader2 className="mx-auto h-6 w-6 animate-spin" />
                                        </TableCell>
                                    </TableRow>
                                ) : tasks.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={6} className="h-24 text-center">
                                            No tasks found.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    tasks.map((task) => (
                                        <TableRow key={task.id}>
                                            <TableCell>
                                              <Button variant="link" className="p-0 h-auto font-medium" onClick={() => onViewCertificate(task)}>
                                                {task.certificateNumber}
                                              </Button>
                                              {task.status === 'Pending Initial Approval' && task.rejectionReason && (
                                                  <Badge variant="destructive" className="ml-2">Rejected</Badge>
                                              )}
                                            </TableCell>
                                            <TableCell>{task.client}</TableCell>
                                            <TableCell>{task.project}</TableCell>
                                            <TableCell>{task.technician}</TableCell>
                                            <TableCell>{format(new Date(task.dateOfIssue), 'PP')}</TableCell>
                                            <TableCell className="space-x-2">
                                                <Button size="sm" onClick={() => handleApprove(task)} disabled={isSubmitting === task.id}>
                                                    {isSubmitting === task.id && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                                    Approve
                                                </Button>
                                                <Button size="sm" variant="destructive" onClick={() => setRejectingTask(task)} disabled={isSubmitting === task.id}>
                                                    Reject
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
            <RejectionDialog 
                isOpen={!!rejectingTask}
                onClose={() => setRejectingTask(null)}
                onSubmit={handleReject}
            />
        </>
    );
}

    
