
"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { collection, getDocs, doc, updateDoc, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/context/auth-context';
import { User, Role, Project, CertificateStatus, ConcreteCubeRegisterEntry, PaverRegisterEntry, BricksBlocksRegisterEntry, WaterAbsorptionRegisterEntry } from '@/lib/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { HasPermission } from '@/components/auth/has-permission';
import { ApprovalTaskTable } from './dashboard/components/approval-task-table';
import { ProjectAssignmentList } from './dashboard/components/project-assignment-list';
import { TechnicianTaskList } from './dashboard/components/technician-task-list';
import { ConcreteCubeCertificate } from './test-certificates/components/ConcreteCubeCertificate';
import { PaverCertificate } from './test-certificates/components/PaverCertificate';
import { BrickCertificate } from './test-certificates/components/BrickCertificate';
import { HollowBlockCertificate } from './test-certificates/components/HollowBlockCertificate';
import { SolidBlockCertificate } from './test-certificates/components/SolidBlockCertificate';
import { WaterAbsorptionCertificate } from './test-certificates/components/WaterAbsorptionCertificate';


type Certificate = any; 

const REGISTER_COLLECTIONS = ["concrete_cubes_register", "cylinders_register", "pavers_register", "bricks_blocks_register", "water_absorption_register"];

export default function DashboardPage() {
    const { user, laboratoryId, laboratory, refresh, permissions } = useAuth();
    const { toast } = useToast();

    // Data states
    const [engineers, setEngineers] = useState<User[]>([]);
    const [initialApprovalTasks, setInitialApprovalTasks] = useState<Certificate[]>([]);
    const [finalApprovalTasks, setFinalApprovalTasks] = useState<Certificate[]>([]);
    const [unassignedProjects, setUnassignedProjects] = useState<Project[]>([]);
    const [technicianTasks, setTechnicianTasks] = useState<Project[]>([]);
    const [rejectedCertsForTech, setRejectedCertsForTech] = useState<Certificate[]>([]);

    // UI and loading states
    const [isEngineerListLoading, setIsEngineerListLoading] = useState(true);
    const [isInitialTasksLoading, setIsInitialTasksLoading] = useState(true);
    const [isFinalTasksLoading, setIsFinalTasksLoading] = useState(true);
    const [isProjectsLoading, setIsProjectsLoading] = useState(true);
    const [isTechnicianTasksLoading, setIsTechnicianTasksLoading] = useState(true);
    
    const [selectedEngineerOnDuty, setSelectedEngineerOnDuty] = useState(laboratory?.engineerOnDuty || '');
    const [isSavingEngineer, setIsSavingEngineer] = useState(false);

    const [viewingCertificate, setViewingCertificate] = useState<Certificate | null>(null);


    // Permission flags for easier conditional rendering
    const canAssignEngineer = permissions.includes('dashboard:assign-engineer-on-duty');
    const canApproveInitial = permissions.includes('certificates:approve-initial');
    const canApproveFinal = permissions.includes('certificates:approve-final');
    const canAssignProjects = permissions.includes('dashboard:assign-projects');
    const canViewMyTasks = permissions.includes('dashboard:view-my-tasks');

    // Fetch Engineers and Unassigned Projects (for admins/managers)
    useEffect(() => {
        if (!laboratoryId || !(canAssignEngineer || canAssignProjects)) {
            setIsEngineerListLoading(false);
            setIsProjectsLoading(false);
            return;
        };
        
        const fetchAdminData = async () => {
            setIsEngineerListLoading(true);
            setIsProjectsLoading(true);
            try {
                const usersQuery = query(collection(db, "users"), where("laboratoryId", "==", laboratoryId));
                const rolesQuery = query(collection(db, "roles"), where("laboratoryId", "==", laboratoryId));
                const projectsQuery = query(collection(db, "projects"), where("laboratoryId", "==", laboratoryId), where("engineer", "==", ""));

                const [usersSnapshot, rolesSnapshot, projectsSnapshot] = await Promise.all([getDocs(usersQuery), getDocs(rolesQuery), getDocs(projectsQuery)]);
                
                const allUsers = usersSnapshot.docs.map(doc => doc.data() as User);
                const engineerRoleId = rolesSnapshot.docs.find(doc => doc.data().name === "Engineer")?.id;
                
                if (engineerRoleId) {
                    setEngineers(allUsers.filter(u => u.roleId === engineerRoleId));
                }
                
                setUnassignedProjects(projectsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Project)));

            } catch (error) {
                console.error("Error fetching admin data:", error);
                toast({ variant: 'destructive', title: 'Error', description: 'Failed to load engineer or project data.' });
            } finally {
                setIsEngineerListLoading(false);
                setIsProjectsLoading(false);
            }
        };

        fetchAdminData();
    }, [laboratoryId, canAssignEngineer, canAssignProjects, toast]);

    const fetchApprovalTasks = useCallback(async (status: CertificateStatus, setter: React.Dispatch<React.SetStateAction<any[]>>, loadingSetter: React.Dispatch<React.SetStateAction<boolean>>) => {
        if (!laboratoryId || !user) return;
        loadingSetter(true);
        try {
            const allTasks: Certificate[] = [];
            for (const coll of REGISTER_COLLECTIONS) {
                const q = query(collection(db, coll), where('status', '==', status));
                
                const snapshot = await getDocs(q);
                const tasks = snapshot.docs.map(doc => ({ id: doc.id, collection: doc.ref.parent.id, ...doc.data() }));
                allTasks.push(...tasks);
            }
            setter(allTasks);
        } catch (error) {
            console.error(`Error fetching tasks for status ${status}:`, error);
        } finally {
            loadingSetter(false);
        }
    }, [laboratoryId, user]);


    const fetchInitialTasks = useCallback(() => {
        fetchApprovalTasks('Pending Initial Approval', setInitialApprovalTasks, setIsInitialTasksLoading);
    }, [fetchApprovalTasks]);

    const fetchFinalTasks = useCallback(() => {
        fetchApprovalTasks('Pending Final Approval', setFinalApprovalTasks, setIsFinalTasksLoading);
    }, [fetchApprovalTasks]);

    useEffect(() => {
        if (canApproveInitial) {
            fetchInitialTasks();
        } else {
            setIsInitialTasksLoading(false);
        }
    }, [canApproveInitial, fetchInitialTasks]);
    
    useEffect(() => {
        if (canApproveFinal) {
            fetchFinalTasks();
        } else {
            setIsFinalTasksLoading(false);
        }
    }, [canApproveFinal, fetchFinalTasks]);

    // Fetch Technician Tasks and Rejected Certs
    useEffect(() => {
        if (!laboratoryId || !user || !canViewMyTasks) {
            setIsTechnicianTasksLoading(false);
            return;
        }
        
        const fetchTechData = async () => {
            setIsTechnicianTasksLoading(true);
            try {
                // Fetch projects with tasks assigned to the technician
                const projectsWithTechTasks: Project[] = [];
                const projectsQuery = query(collection(db, "projects"), where("laboratoryId", "==", laboratoryId));
                const projectsSnapshot = await getDocs(projectsQuery);
                projectsSnapshot.forEach(doc => {
                    const project = { id: doc.id, ...doc.data() } as Project;
                    if (project.tasks && project.tasks.some(t => t.technician === user.uid)) {
                        projectsWithTechTasks.push(project);
                    }
                });
                setTechnicianTasks(projectsWithTechTasks);

                // Fetch certificates rejected back to the technician
                const rejectedForTech: Certificate[] = [];
                for (const coll of REGISTER_COLLECTIONS) {
                    const q = query(collection(db, coll), where('status', '==', 'Rejected'), where('technicianId', '==', user.uid));
                    const snapshot = await getDocs(q);
                    const tasks = snapshot.docs.map(doc => ({ id: doc.id, collection: doc.ref.parent.id, ...doc.data() }));
                    rejectedForTech.push(...tasks);
                }
                setRejectedCertsForTech(rejectedForTech);

            } catch (error) {
                 console.error("Error fetching technician tasks:", error);
            } finally {
                setIsTechnicianTasksLoading(false);
            }
        };

        fetchTechData();
    }, [laboratoryId, user, canViewMyTasks]);
    
    // Set initial state for engineer on duty dropdown
    useEffect(() => {
        if(laboratory) {
            setSelectedEngineerOnDuty(laboratory.engineerOnDuty || '');
        }
    }, [laboratory]);

    const handleSetEngineerOnDuty = async () => {
        if (!selectedEngineerOnDuty) {
            toast({ variant: "destructive", title: "No Engineer Selected", description: "Please select an engineer to set as on duty." });
            return;
        }
        if (!laboratoryId) return;
        setIsSavingEngineer(true);
        try {
            const labDocRef = doc(db, 'laboratories', laboratoryId);
            await updateDoc(labDocRef, { engineerOnDuty: selectedEngineerOnDuty });
            toast({ title: 'Success', description: 'Engineer on duty has been updated.' });
            refresh();
        } catch (error) {
            console.error("Error setting engineer on duty:", error);
            toast({ variant: 'destructive', title: 'Error', description: 'Could not update engineer on duty.' });
        } finally {
            setIsSavingEngineer(false);
        }
    };
    
    const handleRefresh = () => {
        if (canApproveInitial) fetchInitialTasks();
        if (canApproveFinal) fetchFinalTasks();
    };

    const handleViewCertificate = (certificate: Certificate) => {
        setViewingCertificate(certificate);
    };

    const getCertificateComponent = () => {
        if (!viewingCertificate) return null;
        
        const onBack = () => setViewingCertificate(null);

        switch (viewingCertificate.collection) {
            case 'concrete_cubes_register':
                return <ConcreteCubeCertificate certificateData={viewingCertificate as ConcreteCubeRegisterEntry} onBack={onBack} />;
            case 'pavers_register':
                 return <PaverCertificate certificateData={viewingCertificate as PaverRegisterEntry} onBack={onBack} />;
            case 'water_absorption_register':
                return <WaterAbsorptionCertificate certificateData={viewingCertificate as WaterAbsorptionRegisterEntry} onBack={onBack} />;
            case 'bricks_blocks_register':
                const cert = viewingCertificate as BricksBlocksRegisterEntry;
                if (cert.sampleType === 'Solid') return <SolidBlockCertificate certificateData={cert} onBack={onBack} />;
                if (cert.sampleType === 'Brick') return <BrickCertificate certificateData={cert} onBack={onBack} />;
                if (cert.sampleType === 'Hollow') return <HollowBlockCertificate certificateData={cert} onBack={onBack} />;
                return null;
            default:
                return null;
        }
    };

    if (viewingCertificate) {
        return getCertificateComponent();
    }
    
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Dashboard</h1>
                    <p className="text-muted-foreground">Manage approvals, assignments, and tasks.</p>
                </div>
                <HasPermission permissionId="dashboard:assign-engineer-on-duty">
                    <div className="flex items-center gap-2">
                        <Select onValueChange={setSelectedEngineerOnDuty} value={selectedEngineerOnDuty}>
                            <SelectTrigger className="w-[250px]">
                                <SelectValue placeholder="Select Engineer on Duty..." />
                            </SelectTrigger>
                            <SelectContent>
                                {isEngineerListLoading ? <SelectItem value="loading" disabled>Loading...</SelectItem> : engineers.map(e => (
                                    <SelectItem key={e.uid} value={e.uid}>{e.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <Button onClick={handleSetEngineerOnDuty} disabled={isSavingEngineer || isEngineerListLoading}>
                            {isSavingEngineer && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Set Engineer on Duty
                        </Button>
                    </div>
                </HasPermission>
            </div>

            <Tabs defaultValue="initial-approval" className="w-full">
                <TabsList>
                    {canApproveInitial && <TabsTrigger value="initial-approval">Initial Approval</TabsTrigger>}
                    {canApproveFinal && <TabsTrigger value="final-approval">Final Approval</TabsTrigger>}
                    {(canAssignProjects || canViewMyTasks) && <TabsTrigger value="tasks">Tasks</TabsTrigger>}
                </TabsList>
                
                <TabsContent value="initial-approval">
                     <HasPermission permissionId="certificates:approve-initial">
                        <ApprovalTaskTable
                            title="Initial Certificate Approval"
                            description="Certificates awaiting initial review and approval."
                            tasks={initialApprovalTasks}
                            onRefresh={handleRefresh}
                            approvalLevel="initial"
                            loading={isInitialTasksLoading}
                            onViewCertificate={handleViewCertificate}
                        />
                     </HasPermission>
                </TabsContent>
                <TabsContent value="final-approval">
                    <HasPermission permissionId="certificates:approve-final">
                        <ApprovalTaskTable
                            title="Final Certificate Approval"
                            description="Certificates approved by the engineer and awaiting final review."
                            tasks={finalApprovalTasks}
                            onRefresh={handleRefresh}
                            approvalLevel="final"
                            loading={isFinalTasksLoading}
                             onViewCertificate={handleViewCertificate}
                        />
                    </HasPermission>
                </TabsContent>
                <TabsContent value="tasks">
                    <div className="space-y-6">
                        <HasPermission permissionId="dashboard:assign-projects">
                            <ProjectAssignmentList
                                projects={unassignedProjects}
                                engineers={engineers}
                                onRefresh={() => { /* Add refresh logic if needed */}}
                                loading={isProjectsLoading}
                            />
                        </HasPermission>
                        <HasPermission permissionId="dashboard:view-my-tasks">
                             <TechnicianTaskList
                                projects={technicianTasks}
                                rejectedCerts={rejectedCertsForTech}
                                onRefresh={() => { /* Add refresh logic if needed */}}
                                loading={isTechnicianTasksLoading}
                            />
                        </HasPermission>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}
