

"use client";

import * as React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { collection, getDocs, doc, query, updateDoc, orderBy, deleteDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import type { ConcreteCubeRegisterEntry, CorrectionFactorMachine, SampleTestResult } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { TestDialog } from "./test-dialog";
import { EditEntryDialog } from "./edit-entry-dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FlaskConical, MoreHorizontal, Terminal, Columns } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
  } from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import { ConcreteCubeCertificate } from "@/app/test-certificates/components/ConcreteCubeCertificate";
import { useAuth } from "@/context/auth-context";


const formatDate = (dateValue: any) => {
    if (!dateValue) return '-';
    try {
        let date: Date;
        if (dateValue && typeof dateValue.seconds === 'number' && typeof dateValue.nanoseconds === 'number') {
            date = dateValue.toDate();
        } 
        else {
            date = new Date(dateValue);
        }
        
        if (isNaN(date.getTime())) {
            return '-';
        }
        return format(date, "dd/MM/yyyy");
    } catch (e) {
        console.error("Error formatting date:", e);
        return '-';
    }
};

const initialColumnVisibility = {
    'Date Received': true,
    'Client': true,
    'Project': true,
    'Casting Date': true,
    'Testing Date': true,
    'Class': true,
    'Age (Days)': true,
    'Area of Use': true,
    'Sample ID': true,
    'Dimensions (mm)': true,
    'Weight (kg)': true,
    'Load (kN)': true,
    'Machine Used': true,
    'Mode of Failure': true,
    'Temperature (°C)': true,
    'Certificate Number': false,
    'Comment': false,
    'Technician': false,
    'Date of Issue': false,
    'Issue ID': false,
    'Taken by': false,
    'Date Taken': false,
    'Contact': false,
    'Sample Receipt Number': false,
    'Actions': true,
};


export function ConcreteCubesTable() {
    const [data, setData] = React.useState<ConcreteCubeRegisterEntry[]>([]);
    const [machines, setMachines] = React.useState<CorrectionFactorMachine[]>([]);
    const [loading, setLoading] = React.useState(true);
    const [selectedRow, setSelectedRow] = React.useState<ConcreteCubeRegisterEntry | null>(null);
    const [isTestDialogOpen, setIsTestDialogOpen] = React.useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false);
    const [firestoreError, setFirestoreError] = React.useState(false);
    const [deletingEntry, setDeletingEntry] = React.useState<ConcreteCubeRegisterEntry | null>(null);
    const [viewingCertificate, setViewingCertificate] = React.useState<ConcreteCubeRegisterEntry | null>(null);
    const { toast } = useToast();
    const { laboratory, laboratoryId, user } = useAuth();
    const [columnVisibility, setColumnVisibility] = React.useState(initialColumnVisibility);

    const fetchData = React.useCallback(async () => {
        setLoading(true);
        setFirestoreError(false);
        if (!laboratoryId) return;

        try {
            // Use laboratory filtering to prevent data leakage
            const cubesQuery = query(
              collection(db, "concrete_cubes_register"),
              where("laboratoryId", "==", laboratoryId),
              orderBy("dateReceived", "desc"),
              orderBy("setId", "asc")
            );
             const machinesQuery = query(collection(db, "laboratories", laboratoryId, "machines"));
            
            const [querySnapshot, machinesSnapshot] = await Promise.all([getDocs(cubesQuery), getDocs(machinesQuery)]);

            const samplesData: ConcreteCubeRegisterEntry[] = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            } as ConcreteCubeRegisterEntry));
            setData(samplesData);
            const machinesData = machinesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as CorrectionFactorMachine));
            setMachines(machinesData);

        } catch (error: any) {
             console.error("Error fetching concrete register data:", error);
             if (error.code === 'failed-precondition') {
                 setFirestoreError(true);
                // Fallback query also needs laboratory filtering
                const fallbackQuery = query(
                  collection(db, "concrete_cubes_register"),
                  where("laboratoryId", "==", laboratoryId)
                );
                const querySnapshot = await getDocs(fallbackQuery);
                 const samplesData: ConcreteCubeRegisterEntry[] = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                } as ConcreteCubeRegisterEntry));
                setData(samplesData.sort((a, b) => new Date(b.dateReceived).getTime() - new Date(a.dateReceived).getTime() || a.setId - b.setId));
             }
        } finally {
            setLoading(false);
        }
    }, [laboratoryId]);

    React.useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleSelectRow = (row: ConcreteCubeRegisterEntry) => {
        if (selectedRow?.id === row.id) {
          setSelectedRow(null); // Deselect if already selected
        } else {
          setSelectedRow(row);
        }
    };
    
    const openEditDialog = (entry: ConcreteCubeRegisterEntry) => {
        setSelectedRow(entry);
        setIsEditDialogOpen(true);
    };
    
    const openTestDialog = (entry: ConcreteCubeRegisterEntry) => {
        setSelectedRow(entry);
        setIsTestDialogOpen(true);
    };

    const openCertificateView = (entry: ConcreteCubeRegisterEntry) => {
        setViewingCertificate(entry);
    }


    const handleTestSubmit = async (results: SampleTestResult[], machineUsed: string, temperature: number) => {
        if (!selectedRow || !user) return;
    
        try {
          const docRef = doc(db, "concrete_cubes_register", selectedRow.id);
          await updateDoc(docRef, {
            results,
            machineUsed,
            temperature,
            dateOfIssue: new Date().toISOString(),
            status: 'Pending Initial Approval',
            engineerOnDutyId: laboratory?.engineerOnDuty || null,
            technicianId: user.uid, // Store who tested it
            technician: user.name,
          });
          toast({
            title: "Success",
            description: "Test results saved. Certificate is pending approval.",
          });
          setIsTestDialogOpen(false);
          setSelectedRow(null);
          fetchData(); // Refresh data
        } catch (error) {
          console.error("Error updating test results:", error);
          toast({
            variant: "destructive",
            title: "Update Failed",
            description: "Could not save the test results. Please try again.",
          });
        }
    };
    
    const handleMetadataSubmit = async (updatedData: Partial<ConcreteCubeRegisterEntry>) => {
        if (!selectedRow) return;
    
        try {
          const docRef = doc(db, "concrete_cubes_register", selectedRow.id);
          await updateDoc(docRef, updatedData);
          toast({
            title: "Success",
            description: "Register entry has been updated successfully.",
          });
          setIsEditDialogOpen(false);
          setSelectedRow(null);
          fetchData(); // Refresh data
        } catch (error) {
          console.error("Error updating entry:", error);
          toast({
            variant: "destructive",
            title: "Update Failed",
            description: "Could not update the register entry. Please try again.",
          });
        }
      };


    const getResultForRow = (row: ConcreteCubeRegisterEntry, sampleId: string, field: keyof Omit<SampleTestResult, 'sampleId'>) => {
        const result = row.results?.find(r => r.sampleId === sampleId);
        const value = result?.[field];
        
        if (value === undefined || value === null || (typeof value === 'number' && isNaN(value))) {
            return '-';
        }
        
        if (typeof value === 'string' && value.trim() === '') {
            return '-';
        }

        return value;
    };

    const openDeleteDialog = (entry: ConcreteCubeRegisterEntry) => {
        setDeletingEntry(entry);
    };

    const handleDeleteEntry = async () => {
        if (!deletingEntry) return;
        try {
          await deleteDoc(doc(db, "concrete_cubes_register", deletingEntry.id));
          toast({
            title: "Entry Deleted",
            description: "The register entry has been successfully deleted.",
          });
          fetchData();
        } catch (error) {
          console.error("Error deleting entry:", error);
          toast({
            variant: "destructive",
            title: "Deletion Failed",
            description: "Could not delete the register entry. Please try again.",
          });
        } finally {
            setDeletingEntry(null);
        }
      };

    if (viewingCertificate) {
        return <ConcreteCubeCertificate certificateData={viewingCertificate} onBack={() => setViewingCertificate(null)} />;
    }


  return (
    <>
    <Card>
        <CardHeader>
             <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                    <CardTitle>Concrete Cubes Register</CardTitle>
                    <p className="text-muted-foreground text-sm mt-1">Detailed records of all concrete cube samples.</p>
                </div>
                <div className="flex items-center gap-2">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline">
                                <Columns className="mr-2 h-4 w-4" />
                                Columns
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="max-h-96 overflow-y-auto">
                            <DropdownMenuLabel>Toggle Columns</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            {Object.entries(initialColumnVisibility).map(([key, value]) => (
                                <DropdownMenuCheckboxItem
                                    key={key}
                                    checked={columnVisibility[key as keyof typeof columnVisibility]}
                                    onCheckedChange={(checked) => setColumnVisibility(prev => ({...prev, [key]: checked}))}
                                >
                                    {key}
                                </DropdownMenuCheckboxItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <Button onClick={() => openTestDialog(selectedRow!)} disabled={!selectedRow}>
                        <FlaskConical className="mr-2 h-4 w-4" />
                        Test
                    </Button>
                </div>
            </div>
             {firestoreError && (
                <Alert variant="destructive" className="mt-4">
                    <Terminal className="h-4 w-4" />
                    <AlertTitle>Action Required: Firestore Index Missing</AlertTitle>
                    <AlertDescription>
                        The database query for sorting samples is not efficient and requires a composite index. While a fallback has been used, for best performance please create the index in your Firebase project.
                    </AlertDescription>
                </Alert>
            )}
        </CardHeader>
        <CardContent>
            <ScrollArea className="w-full whitespace-nowrap rounded-md border">
            <Table>
                <TableHeader>
                <TableRow>
                    <TableHead rowSpan={2}></TableHead>
                    {columnVisibility['Date Received'] && <TableHead rowSpan={2}>Date<br/>Received</TableHead>}
                    {columnVisibility['Client'] && <TableHead rowSpan={2}>Client</TableHead>}
                    {columnVisibility['Project'] && <TableHead rowSpan={2}>Project</TableHead>}
                    {columnVisibility['Casting Date'] && <TableHead rowSpan={2}>Casting<br/>Date</TableHead>}
                    {columnVisibility['Testing Date'] && <TableHead rowSpan={2}>Testing<br/>Date</TableHead>}
                    {columnVisibility['Class'] && <TableHead rowSpan={2}>Class</TableHead>}
                    {columnVisibility['Age (Days)'] && <TableHead rowSpan={2}>Age<br/>(Days)</TableHead>}
                    {columnVisibility['Area of Use'] && <TableHead rowSpan={2}>Area of Use</TableHead>}
                    {columnVisibility['Sample ID'] && <TableHead rowSpan={2}>Sample ID</TableHead>}
                    {columnVisibility['Dimensions (mm)'] && <TableHead colSpan={3} className="text-center">Dimensions (mm)</TableHead>}
                    {columnVisibility['Weight (kg)'] && <TableHead rowSpan={2}>Weight<br/>(kg)</TableHead>}
                    {columnVisibility['Load (kN)'] && <TableHead rowSpan={2}>Load<br/>(kN)</TableHead>}
                    {columnVisibility['Machine Used'] && <TableHead rowSpan={2}>Machine<br/>Used</TableHead>}
                    {columnVisibility['Mode of Failure'] && <TableHead rowSpan={2}>Mode of<br/>Failure</TableHead>}
                    {columnVisibility['Temperature (°C)'] && <TableHead rowSpan={2}>Temperature<br/>(°C)</TableHead>}
                    {columnVisibility['Certificate Number'] && <TableHead rowSpan={2}>Certificate<br/>Number</TableHead>}
                    {columnVisibility['Comment'] && <TableHead rowSpan={2}>Comment/<br/>Remark</TableHead>}
                    {columnVisibility['Technician'] && <TableHead rowSpan={2}>Technician<br/>(Name & Signature)</TableHead>}
                    {columnVisibility['Date of Issue'] && <TableHead rowSpan={2}>Date of<br/>Issue</TableHead>}
                    {columnVisibility['Issue ID'] && <TableHead rowSpan={2}>Issue ID/<br/>Serial No.</TableHead>}
                    {columnVisibility['Taken by'] && <TableHead rowSpan={2}>Taken by</TableHead>}
                    {columnVisibility['Date Taken'] && <TableHead rowSpan={2}>Date<br/>Taken</TableHead>}
                    {columnVisibility['Contact'] && <TableHead rowSpan={2}>Contact</TableHead>}
                    {columnVisibility['Sample Receipt Number'] && <TableHead rowSpan={2}>Sample<br/>Receipt Number</TableHead>}
                    {columnVisibility['Actions'] && <TableHead rowSpan={2}>Actions</TableHead>}
                </TableRow>
                <TableRow>
                    {columnVisibility['Dimensions (mm)'] && <>
                        <TableHead>Length</TableHead>
                        <TableHead>Width</TableHead>
                        <TableHead>Height</TableHead>
                    </>}
                </TableRow>
                </TableHeader>
                <TableBody>
                {loading ? (
                    <TableRow>
                        <TableCell colSpan={27} className="h-24 text-center">
                            Loading register...
                        </TableCell>
                    </TableRow>
                ) : data.length === 0 ? (
                    <TableRow>
                    <TableCell colSpan={27} className="h-24 text-center">
                        No concrete samples have been registered yet.
                    </TableCell>
                    </TableRow>
                ) : (
                    data.map((row) => {
                    const sortedSampleIds = [...row.sampleIds].sort((a, b) => {
                        const numA = parseInt(a.replace(/\D/g, ''), 10) || 0;
                        const numB = parseInt(b.replace(/\D/g, ''), 10) || 0;
                        return numA - numB;
                    });
                    const age = row.age ?? '-';
                    const machineName = machines.find(m => m.id === row.machineUsed)?.name || row.machineUsed || '-';
                    return (
                        <TableRow key={row.id} data-state={selectedRow?.id === row.id ? 'selected' : ''}>
                        <TableCell>
                            <Checkbox
                                checked={selectedRow?.id === row.id}
                                onCheckedChange={() => handleSelectRow(row)}
                                aria-label="Select row"
                            />
                        </TableCell>
                        {columnVisibility['Date Received'] && <TableCell>{formatDate(row.dateReceived)}</TableCell>}
                        {columnVisibility['Client'] && <TableCell>{row.client || '-'}</TableCell>}
                        {columnVisibility['Project'] && <TableCell>{row.project || '-'}</TableCell>}
                        {columnVisibility['Casting Date'] && <TableCell>{formatDate(row.castingDate)}</TableCell>}
                        {columnVisibility['Testing Date'] && <TableCell>{formatDate(row.testingDate)}</TableCell>}
                        {columnVisibility['Class'] && <TableCell>{row.class || '-'}</TableCell>}
                        {columnVisibility['Age (Days)'] && <TableCell>{age}</TableCell>}
                        {columnVisibility['Area of Use'] && <TableCell>{row.areaOfUse || '-'}</TableCell>}
                        {columnVisibility['Sample ID'] && <TableCell>
                            <div className="flex flex-col">
                                {sortedSampleIds.map(id => <span key={id}>{id}</span>)}
                            </div>
                        </TableCell>}
                        {columnVisibility['Dimensions (mm)'] && <>
                            <TableCell>
                                <div className="flex flex-col">
                                    {sortedSampleIds.map(id => <span key={id}>{getResultForRow(row, id, 'length')}</span>)}
                                </div>
                            </TableCell>
                            <TableCell>
                                <div className="flex flex-col">
                                    {sortedSampleIds.map(id => <span key={id}>{getResultForRow(row, id, 'width')}</span>)}
                                </div>
                            </TableCell>
                            <TableCell>
                                <div className="flex flex-col">
                                    {sortedSampleIds.map(id => <span key={id}>{getResultForRow(row, id, 'height')}</span>)}
                                </div>
                            </TableCell>
                        </>}
                        {columnVisibility['Weight (kg)'] && <TableCell>
                            <div className="flex flex-col">
                                {sortedSampleIds.map(id => <span key={id}>{getResultForRow(row, id, 'weight')}</span>)}
                            </div>
                        </TableCell>}
                        {columnVisibility['Load (kN)'] && <TableCell>
                             <div className="flex flex-col">
                                {sortedSampleIds.map(id => <span key={id}>{getResultForRow(row, id, 'load')}</span>)}
                            </div>
                        </TableCell>}
                        {columnVisibility['Machine Used'] && <TableCell>{machineName}</TableCell>}
                        {columnVisibility['Mode of Failure'] && <TableCell>
                            <div className="flex flex-col">
                                {sortedSampleIds.map(id => <span key={id}>{getResultForRow(row, id, 'modeOfFailure')}</span>)}
                            </div>
                        </TableCell>}
                        {columnVisibility['Temperature (°C)'] && <TableCell>{row.temperature ?? '-'}</TableCell>}
                        {columnVisibility['Certificate Number'] && <TableCell>
                            {row.certificateNumber ? (
                                <Button variant="link" className="p-0 h-auto" onClick={() => openCertificateView(row)}>
                                    {row.certificateNumber}
                                </Button>
                            ) : '-'}
                        </TableCell>}
                        {columnVisibility['Comment'] && <TableCell>{row.comment || '-'}</TableCell>}
                        {columnVisibility['Technician'] && <TableCell>{row.technician || '-'}</TableCell>}
                        {columnVisibility['Date of Issue'] && <TableCell>{formatDate(row.dateOfIssue)}</TableCell>}
                        {columnVisibility['Issue ID'] && <TableCell>{row.issueId || '-'}</TableCell>}
                        {columnVisibility['Taken by'] && <TableCell>{row.takenBy || '-'}</TableCell>}
                        {columnVisibility['Date Taken'] && <TableCell>{formatDate(row.dateTaken)}</TableCell>}
                        {columnVisibility['Contact'] && <TableCell>{row.contact || '-'}</TableCell>}
                        {columnVisibility['Sample Receipt Number'] && <TableCell>{row.receiptId || '-'}</TableCell>}
                        {columnVisibility['Actions'] && <TableCell>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="h-8 w-8 p-0">
                                    <span className="sr-only">Open menu</span>
                                    <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                    <DropdownMenuItem onClick={() => openEditDialog(row)}>
                                        Edit
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem
                                    className="text-destructive"
                                    onClick={() => openDeleteDialog(row)}
                                    >
                                    Delete
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </TableCell>}
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

    {selectedRow && (
        <TestDialog
          isOpen={isTestDialogOpen}
          onClose={() => {
            setIsTestDialogOpen(false);
            setSelectedRow(null);
          }}
          sampleSet={selectedRow}
          onSubmit={handleTestSubmit}
          machines={machines}
        />
    )}

    {selectedRow && (
        <EditEntryDialog
            isOpen={isEditDialogOpen}
            onClose={() => {
                setIsEditDialogOpen(false);
                setSelectedRow(null);
            }}
            entry={selectedRow}
            onSubmit={handleMetadataSubmit}
            entryType="concrete_cubes_register"
        />
    )}


    <AlertDialog open={!!deletingEntry} onOpenChange={(open) => !open && setDeletingEntry(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action will permanently delete the register entry for receipt <strong>{deletingEntry?.receiptId}</strong> (Set {deletingEntry?.setId}). This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDeletingEntry(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteEntry}>
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

    