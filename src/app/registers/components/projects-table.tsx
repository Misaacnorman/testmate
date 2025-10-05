

"use client";

import * as React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { collection, getDocs, doc, query, updateDoc, orderBy, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { Project, ProjectLabTest, User, Role } from "@/lib/types";
import { format } from "date-fns";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AddProjectDialog } from "./add-project-dialog";
import { useAuth } from "@/context/auth-context";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    try {
        const date = new Date(dateString);
        return format(date, "dd/MM/yyyy");
    } catch {
        return '-'
    }
};

export function ProjectsTable() {
  const { laboratoryId } = useAuth();
  const [data, setData] = React.useState<Project[]>([]);
  const [engineers, setEngineers] = React.useState<User[]>([]);
  const [technicians, setTechnicians] = React.useState<User[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = React.useState(false);
  const [savingId, setSavingId] = React.useState<string | null>(null);
  const { toast } = useToast();


  const fetchData = React.useCallback(async () => {
    if (!laboratoryId) return;
    setLoading(true);
    try {
        const projectsQuery = query(collection(db, "projects"), orderBy("date", "desc"));
        const usersQuery = query(collection(db, "users"), where("laboratoryId", "==", laboratoryId));
        const rolesQuery = query(collection(db, "roles"), where("laboratoryId", "==", laboratoryId));

        const [projectsSnapshot, usersSnapshot, rolesSnapshot] = await Promise.all([
          getDocs(projectsQuery),
          getDocs(usersQuery),
          getDocs(rolesQuery),
        ]);

        const projectsData: Project[] = projectsSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        } as Project));
        setData(projectsData);
        
        const usersData = usersSnapshot.docs.map(doc => doc.data() as User);
        const rolesData = rolesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() as Role }));
        
        const engineerRoleId = rolesData.find(r => r.name.toLowerCase() === 'engineer')?.id;
        const technicianRoleId = rolesData.find(r => r.name.toLowerCase() === 'technician')?.id;

        setEngineers(usersData.filter(u => u.roleId === engineerRoleId));
        setTechnicians(usersData.filter(u => u.roleId === technicianRoleId));

    } catch (error) {
        console.error("Error fetching data:", error);
        toast({ variant: "destructive", title: "Failed to load data" });
    } finally {
        setLoading(false);
    }
  }, [laboratoryId, toast]);

  React.useEffect(() => {
      fetchData();
  }, [fetchData]);

  const handleFieldChange = (projectId: string, field: keyof Project | `tasks.${number}.technician`, value: string) => {
    setData(prevData => prevData.map(p => {
        if (p.id === projectId) {
            const updatedProject = { ...p };
            if (typeof field === 'string' && field.startsWith('tasks.')) {
                const [, index, key] = field.split('.');
                const testIndex = parseInt(index, 10);
                if (updatedProject.tasks && updatedProject.tasks[testIndex]) {
                    (updatedProject.tasks[testIndex] as any)[key] = value;
                }
            } else {
                (updatedProject as any)[field as keyof Project] = value;
            }
            return updatedProject;
        }
        return p;
    }));
  };
  
  const handleSave = async (projectId: string) => {
    const projectToSave = data.find(p => p.id === projectId);
    if (!projectToSave) return;
    
    setSavingId(projectId);
    try {
      const docRef = doc(db, "projects", projectId);
      const { id, ...projectData } = projectToSave;
      await updateDoc(docRef, projectData);
      toast({ title: "Project Updated" });
    } catch (error) {
      console.error("Error updating project:", error);
      toast({ variant: "destructive", title: "Update Failed" });
    } finally {
      setSavingId(null);
    }
  };
  
  const groupTestsByCategory = (tests: ProjectLabTest[]) => {
    if (!tests) return {};
    return tests.reduce((acc, test) => {
        (acc[test.materialCategory] = acc[test.materialCategory] || []).push(test);
        return acc;
    }, {} as Record<string, ProjectLabTest[]>);
  }

  return (
    <>
      <Card>
        <CardHeader>
             <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                    <CardTitle>Projects Overview</CardTitle>
                    <p className="text-muted-foreground text-sm mt-1">A consolidated view of all ongoing and completed projects.</p>
                </div>
                <Button onClick={() => setIsAddDialogOpen(true)}>Add New Project</Button>
            </div>
        </CardHeader>
        <CardContent>
          <ScrollArea className="w-full whitespace-nowrap rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead rowSpan={3}>Date</TableHead>
                  <TableHead colSpan={2} className="text-center">PROJECT ID NUMBER</TableHead>
                  <TableHead rowSpan={3}>CLIENT</TableHead>
                  <TableHead rowSpan={3}>PROJECT</TableHead>
                  <TableHead rowSpan={3}>ENGINEER IN CHARGE</TableHead>
                  <TableHead colSpan={5} className="text-center border-l">FIELD WORK INSTRUCTIONS</TableHead>
                  <TableHead colSpan={2} className="text-center border-l">SCOPE OF WORK (LABORATORY TESTING)</TableHead>
                  <TableHead rowSpan={3}>Start Date</TableHead>
                  <TableHead colSpan={5} className="text-center border-l">RESULTS/REPORTS</TableHead>
                  <TableHead rowSpan={3} className="border-l">Acknowledgement after Delivery</TableHead>
                  <TableHead rowSpan={3}>Report Issued By</TableHead>
                  <TableHead rowSpan={3}>Report Picked/ Delivered to</TableHead>
                  <TableHead rowSpan={3}>Contact</TableHead>
                  <TableHead rowSpan={3}>Date and Time</TableHead>
                  <TableHead rowSpan={3}>Sample Receipt Number</TableHead>
                  <TableHead rowSpan={3}>Actions</TableHead>
                </TableRow>
                <TableRow>
                    <TableHead rowSpan={2}>BIG PROJECTS</TableHead>
                    <TableHead rowSpan={2}>SMALL PROJECTS & SAMPLES</TableHead>
                    <TableHead rowSpan={2} className="border-l">Field Tests</TableHead>
                    <TableHead rowSpan={2}>Technician in Charge</TableHead>
                    <TableHead rowSpan={2}>Start Date</TableHead>
                    <TableHead rowSpan={2}>End Date</TableHead>
                    <TableHead rowSpan={2}>Remark(s)</TableHead>
                    <TableHead className="border-l">Lab Tests</TableHead>
                    <TableHead>Technician in Charge</TableHead>
                    <TableHead rowSpan={2}>Agreed Delivery Date</TableHead>
                    <TableHead rowSpan={2}>Signature</TableHead>
                    <TableHead rowSpan={2}>Actual Delivery date</TableHead>
                    <TableHead rowSpan={2}>Signature</TableHead>
                </TableRow>
                 <TableRow>
                    <TableHead className="border-l"></TableHead>
                    <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={24} className="h-24 text-center">
                      <Loader2 className="mx-auto h-8 w-8 animate-spin"/>
                    </TableCell>
                  </TableRow>
                ) : data.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={24} className="h-24 text-center">
                      No projects found.
                    </TableCell>
                  </TableRow>
                ) : (
                  data.map((row) => {
                    const groupedLabTests = groupTestsByCategory(row.tasks || row.labTests);
                    const isSavingThis = savingId === row.id;
                    return (
                    <TableRow key={row.id}>
                      <TableCell>{formatDate(row.date)}</TableCell>
                      <TableCell>{row.projectIdBig || '-'}</TableCell>
                      <TableCell>{row.projectIdSmall || '-'}</TableCell>
                      <TableCell>{row.client}</TableCell>
                      <TableCell>{row.project}</TableCell>
                      <TableCell>
                          <Select value={row.engineer || ''} onValueChange={value => handleFieldChange(row.id, 'engineer', value)}>
                            <SelectTrigger className="min-w-[150px] h-8"><SelectValue placeholder="Assign..."/></SelectTrigger>
                            <SelectContent>
                              {engineers.map(e => <SelectItem key={e.uid} value={e.uid}>{e.name}</SelectItem>)}
                            </SelectContent>
                          </Select>
                      </TableCell>
                      <TableCell>{row.fieldTestDetails || '-'}</TableCell>
                      <TableCell>{row.fieldTechnician || '-'}</TableCell>
                      <TableCell>{formatDate(row.fieldStartDate)}</TableCell>
                      <TableCell>{formatDate(row.fieldEndDate)}</TableCell>
                      <TableCell>{row.fieldRemarks || '-'}</TableCell>
                      <TableCell colSpan={2} className="align-top">
                          <div className="flex flex-col gap-2 py-1 min-w-[400px]">
                            {Object.entries(groupedLabTests).map(([category, tests]) => {
                              const categoryQuantity = tests[0]?.categoryQuantity ?? 0;
                              return (
                                <div key={category} className="space-y-1">
                                    <p className="font-semibold text-muted-foreground">{category} (Qty: {categoryQuantity})</p>
                                    {tests.map((test) => {
                                      const originalIndex = (row.tasks || row.labTests).findIndex(t => t.testId === test.testId);
                                      return(
                                        <div key={test.testId} className="grid grid-cols-2 items-center gap-2 pl-2">
                                            <span className="whitespace-normal">{test.materialTest} (Qty: {test.quantity})</span>
                                             <Select value={test.technician || ''} onValueChange={value => handleFieldChange(row.id, `tasks.${originalIndex}.technician`, value)}>
                                                <SelectTrigger className="h-8"><SelectValue placeholder="Assign..."/></SelectTrigger>
                                                <SelectContent>
                                                  {technicians.map(t => <SelectItem key={t.uid} value={t.uid}>{t.name}</SelectItem>)}
                                                </SelectContent>
                                              </Select>
                                        </div>
                                      )
                                    })}
                                </div>
                              )
                            })}
                          </div>
                      </TableCell>
                      <TableCell>{formatDate(row.labStartDate)}</TableCell>
                      <TableCell>{formatDate(row.agreedDelivery)}</TableCell>
                      <TableCell>{row.agreedSignature || '-'}</TableCell>
                      <TableCell>{formatDate(row.actualDelivery)}</TableCell>
                      <TableCell>{row.actualSignature || '-'}</TableCell>
                      <TableCell>{row.ackAfterDelivery || '-'}</TableCell>
                      <TableCell>{row.reportIssuedBy || '-'}</TableCell>
                      <TableCell>{row.reportPickedBy || '-'}</TableCell>
                      <TableCell>{row.contact || '-'}</TableCell>
                      <TableCell>{formatDate(row.dateTime)}</TableCell>
                      <TableCell>{row.sampleReceipt}</TableCell>
                      <TableCell>
                        <Button size="sm" onClick={() => handleSave(row.id)} disabled={isSavingThis}>
                           {isSavingThis && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                           Save
                        </Button>
                      </TableCell>
                    </TableRow>
                    )
                  })
                )}
              </TableBody>
            </Table>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </CardContent>
      </Card>
      <AddProjectDialog 
        isOpen={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        onSuccess={fetchData}
        allTests={[]}
      />
    </>
  );
}
