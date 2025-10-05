
"use client";

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Project, CertificateStatus } from '@/lib/types';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { useAuth } from '@/context/auth-context';
import { Loader2, TestTube, AlertCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface TechnicianTaskListProps {
    projects: Project[];
    rejectedCerts: any[]; // Add rejected certs to props
    onRefresh: () => void;
    loading: boolean;
}

export function TechnicianTaskList({ projects, rejectedCerts, loading }: TechnicianTaskListProps) {
    const { user } = useAuth();
    
    if (loading) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>My Assigned Lab Tests</CardTitle>
                    <CardDescription>A list of all lab tests assigned to you.</CardDescription>
                </CardHeader>
                <CardContent className="flex items-center justify-center h-40">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </CardContent>
            </Card>
        )
    }

    const myTasks = projects.flatMap(p => 
        (p.tasks || [])
            .filter(t => t.technician === user?.uid)
            .map(t => ({
                id: `${p.id}-${t.testId}`,
                type: 'project' as const,
                projectTitle: p.project,
                clientName: p.client,
                testName: t.materialTest,
                quantity: t.quantity
            }))
    );
    
    const myRejectedTasks = rejectedCerts
        .filter(c => c.technicianId === user?.uid)
        .map(c => ({
            id: c.id,
            type: 'rejection' as const,
            projectTitle: c.project,
            clientName: c.client,
            testName: c.certificateNumber,
            rejectionReason: c.rejectionReason,
            quantity: c.sampleIds.length,
        }));

    const allTasks = [...myTasks, ...myRejectedTasks];

    return (
        <Card>
            <CardHeader>
                <CardTitle>My Tasks</CardTitle>
                <CardDescription>A list of all lab tests and rejected certificates assigned to you.</CardDescription>
            </CardHeader>
            <CardContent>
                 {allTasks.length === 0 ? (
                    <p className="text-muted-foreground text-center py-8">You have no assigned tasks.</p>
                ) : (
                    <div className="space-y-2">
                        {allTasks.map((task) => (
                            <div key={task.id} className="flex items-center justify-between p-3 border rounded-lg bg-muted/50">
                                <div className="flex items-center gap-4">
                                     {task.type === 'project' ? (
                                        <TestTube className="h-5 w-5 text-primary"/>
                                     ) : (
                                        <AlertCircle className="h-5 w-5 text-destructive"/>
                                     )}
                                    <div>
                                        <p className="font-semibold">{task.testName}</p>
                                        <p className="text-sm text-muted-foreground">{task.projectTitle} / {task.clientName}</p>
                                        {task.type === 'rejection' && <p className="text-xs text-destructive mt-1">Reason: {task.rejectionReason}</p>}
                                    </div>
                                </div>
                                <p className="text-sm font-medium">Quantity: {task.quantity}</p>
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
