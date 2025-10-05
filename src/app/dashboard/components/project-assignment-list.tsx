
"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Project, User } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

interface ProjectAssignmentListProps {
    projects: Project[];
    engineers: User[];
    onRefresh: () => void;
    loading: boolean;
}

interface ProjectAssignmentState {
    [projectId: string]: {
        engineerId?: string;
        isAssigning?: boolean;
    }
}

export function ProjectAssignmentList({ projects, engineers, onRefresh, loading }: ProjectAssignmentListProps) {
    const [assignments, setAssignments] = useState<ProjectAssignmentState>({});
    const { toast } = useToast();

    const handleEngineerSelect = (projectId: string, engineerId: string) => {
        setAssignments(prev => ({
            ...prev,
            [projectId]: { ...prev[projectId], engineerId }
        }));
    };

    const handleAssign = async (projectId: string) => {
        const engineerId = assignments[projectId]?.engineerId;
        if (!engineerId) {
            toast({ variant: 'destructive', title: 'Please select an engineer.' });
            return;
        }

        setAssignments(prev => ({ ...prev, [projectId]: { ...prev[projectId], isAssigning: true }}));

        try {
            const projectRef = doc(db, 'projects', projectId);
            await updateDoc(projectRef, { engineer: engineerId });
            toast({ title: 'Project Assigned!', description: 'The engineer has been assigned to the project.'});
            onRefresh();
        } catch (error) {
            console.error("Error assigning project:", error);
            toast({ variant: 'destructive', title: 'Assignment Failed' });
        } finally {
            setAssignments(prev => ({ ...prev, [projectId]: { ...prev[projectId], isAssigning: false }}));
        }
    };

    const getProjectSummary = (project: Project) => {
        const labTests = project.labTests || [];
        const uniqueCategories = new Set(labTests.map(t => t.materialCategory));
        const totalTests = labTests.reduce((sum, test) => sum + test.quantity, 0);
        return {
            categoryCount: uniqueCategories.size,
            testCount: totalTests,
        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Unassigned Projects</CardTitle>
                <CardDescription>Projects from the registry awaiting engineer assignment.</CardDescription>
            </CardHeader>
            <CardContent>
                {loading ? (
                    <div className="flex items-center justify-center h-40">
                        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                    </div>
                ) : projects.length === 0 ? (
                    <p className="text-muted-foreground text-center py-8">No unassigned projects found.</p>
                ) : (
                    <Accordion type="multiple" className="w-full space-y-4">
                        {projects.map(project => {
                            const summary = getProjectSummary(project);
                            const isAssigning = assignments[project.id]?.isAssigning;

                            return (
                                <AccordionItem key={project.id} value={project.id} className="border rounded-lg">
                                    <AccordionTrigger className="p-4 hover:no-underline">
                                        <div className="flex justify-between items-center w-full">
                                            <div>
                                                <p className="font-bold text-base">{project.project}</p>
                                                <p className="text-sm text-muted-foreground">{project.client}</p>
                                            </div>
                                            <div className="flex items-center gap-6 text-sm">
                                                <div>
                                                    <span className="font-semibold">{summary.categoryCount}</span>
                                                    <span className="text-muted-foreground"> Categories</span>
                                                </div>
                                                 <div>
                                                    <span className="font-semibold">{summary.testCount}</span>
                                                    <span className="text-muted-foreground"> Total Tests</span>
                                                </div>
                                            </div>
                                        </div>
                                    </AccordionTrigger>
                                    <AccordionContent className="p-4 border-t">
                                         <div className="flex items-center gap-4">
                                            <Select onValueChange={(value) => handleEngineerSelect(project.id, value)}>
                                                <SelectTrigger className="w-[300px]">
                                                    <SelectValue placeholder="Select engineer to assign..." />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {engineers.map(e => <SelectItem key={e.uid} value={e.uid}>{e.name}</SelectItem>)}
                                                </SelectContent>
                                            </Select>
                                            <Button onClick={() => handleAssign(project.id)} disabled={isAssigning}>
                                                {isAssigning && <Loader2 className="mr-2 h-4 w-4 animate-spin"/>}
                                                Assign to Engineer
                                            </Button>
                                         </div>
                                    </AccordionContent>
                                </AccordionItem>
                            )
                        })}
                    </Accordion>
                )}
            </CardContent>
        </Card>
    );
}

    