

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
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { collection, getDocs, doc, query, updateDoc, orderBy, deleteDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import type { BricksBlocksRegisterEntry, BricksBlocksTestResult, HoleDimension, BrickType, CorrectionFactorMachine } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { EditEntryDialog } from "./edit-entry-dialog";
import { Checkbox } from "@/components/ui/checkbox";
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
import { BricksBlocksTestDialog } from "./bricks-blocks-test-dialog";
import { SolidBlockCertificate } from "@/app/test-certificates/components/SolidBlockCertificate";
import { BrickCertificate } from "@/app/test-certificates/components/BrickCertificate";
import { HollowBlockCertificate } from "@/app/test-certificates/components/HollowBlockCertificate";
import { useAuth } from "@/context/auth-context";
import { differenceInDays } from "date-fns";


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
    'Age (Days)': true,
    'Area of Use': true,
    'Sample ID': true,
    'Sample Type': true,
    'Dimensions (mm)': true,
    'Dimensions of Holes & No. for Hollow Blocks': true,
    'Weight (kg)': true,
    'Machine Used': true,
    'Load (kN)': true,
    'Mode of Failure': true,
    'Temp. (°C)': true,
    'Cert. No.': false,
    'Comment': false,
    'Technician': false,
    'Date of Issue': false,
    'Issue ID': false,
    'Taken by': false,
    'Date Taken': false,
    'Contact': false,
    'Receipt No.': false,
    'Actions': true,
};

export function BricksBlocksTable() {
  const [data, setData] = React.useState<BricksBlocksRegisterEntry[]>([]);
  const [machines, setMachines] = React.useState<CorrectionFactorMachine[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [selectedRow, setSelectedRow] = React.useState<BricksBlocksRegisterEntry | null>(null);
  const [isTestDialogOpen, setIsTestDialogOpen] = React.useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false);
  const [firestoreError, setFirestoreError] = React.useState(false);
  const [deletingEntry, setDeletingEntry] = React.useState<BricksBlocksRegisterEntry | null>(null);
  const [viewingCertificate, setViewingCertificate] = React.useState<BricksBlocksRegisterEntry | null>(null);
  const [showDateWarning, setShowDateWarning] = React.useState(false);
  const [pendingTestEntry, setPendingTestEntry] = React.useState<BricksBlocksRegisterEntry | null>(null);
  const { toast } = useToast();
  const { laboratoryId, user, laboratory } = useAuth();
  const [columnVisibility, setColumnVisibility] = React.useState(initialColumnVisibility);


  const fetchData = React.useCallback(async () => {
    setLoading(true);
    setFirestoreError(false);
     if (!laboratoryId) return;
    try {
        const q = query(
          collection(db, "bricks_blocks_register"),
          orderBy("dateReceived", "desc"),
          orderBy("setId", "asc")
        );
        const machinesQuery = query(collection(db, "laboratories", laboratoryId, "machines"));
        
        const [querySnapshot, machinesSnapshot] = await Promise.all([getDocs(q), getDocs(machinesQuery)]);

        const samplesData: BricksBlocksRegisterEntry[] = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        } as BricksBlocksRegisterEntry));
        setData(samplesData);
        const machinesData = machinesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as CorrectionFactorMachine));
        setMachines(machinesData);

    } catch (error: any) {
         console.error("Error fetching bricks/blocks register data:", error);
         if (error.code === 'failed-precondition') {
             setFirestoreError(true);
              // As a fallback, fetch without sorting to at least show the data
            const fallbackQuery = query(collection(db, "bricks_blocks_register"));
            const querySnapshot = await getDocs(fallbackQuery);
             const samplesData: BricksBlocksRegisterEntry[] = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            } as BricksBlocksRegisterEntry));
            setData(samplesData.sort((a, b) => new Date(b.dateReceived).getTime() - new Date(a.dateReceived).getTime() || a.setId - b.setId));
         }
    } finally {
        setLoading(false);
    }
  }, [laboratoryId]);

  React.useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSelectRow = (row: BricksBlocksRegisterEntry) => {
    if (selectedRow?.id === row.id) {
      setSelectedRow(null);
    } else {
      setSelectedRow(row);
    }
  };

  const openEditDialog = (entry: BricksBlocksRegisterEntry) => {
    setSelectedRow(entry);
    setIsEditDialogOpen(true);
  };
  
  const checkTestingDate = (testingDate: any): { canTest: boolean; isBefore: boolean; isAfter: boolean } => {
    if (!testingDate) return { canTest: true, isBefore: false, isAfter: false };
    
    try {
        let scheduledDate: Date;
        if (testingDate && typeof testingDate.seconds === 'number') {
            scheduledDate = testingDate.toDate();
        } else {
            scheduledDate = new Date(testingDate);
        }
        
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        scheduledDate.setHours(0, 0, 0, 0);
        
        const isBefore = today < scheduledDate;
        const isAfter = today > scheduledDate;
        
        return { canTest: !isBefore, isBefore, isAfter };
    } catch (e) {
        return { canTest: true, isBefore: false, isAfter: false };
    }
  };
  
  const openTestDialog = (entry: BricksBlocksRegisterEntry) => {
    const dateCheck = checkTestingDate(entry.testingDate);
    
    if (dateCheck.isBefore) {
        setPendingTestEntry(entry);
        setShowDateWarning(true);
    } else {
        setSelectedRow(entry);
        setIsTestDialogOpen(true);
    }
  };
  
  const handleOverrideDate = () => {
    if (pendingTestEntry) {
        setSelectedRow(pendingTestEntry);
        setIsTestDialogOpen(true);
        setShowDateWarning(false);
        setPendingTestEntry(null);
    }
  };

  const calculateAge = (castingDate: any, testingDate: any): number | string => {
    try {
        let casting: Date;
        let testing: Date;
        
        if (castingDate && typeof castingDate.seconds === 'number') {
            casting = castingDate.toDate();
        } else {
            casting = new Date(castingDate);
        }
        
        if (testingDate && typeof testingDate.seconds === 'number') {
            testing = testingDate.toDate();
        } else {
            testing = new Date(testingDate);
        }
        
        if (isNaN(casting.getTime()) || isNaN(testing.getTime())) {
            return '';
        }
        
        const days = differenceInDays(testing, casting);
        return days > 28 ? ">28" : days;
    } catch (e) {
        return '';
    }
  };

  const handleTestSubmit = async (results: BricksBlocksTestResult[], machineUsed: string, temperature: number, solidBlockType?: 'Regular concrete blocks' | 'Stabilised earth Blocks' | null, modeOfCompaction?: 'Not Specified' | 'Static' | null, brickType?: BrickType | null) => {
    if (!selectedRow || !user) return;

    try {
      const docRef = doc(db, "bricks_blocks_register", selectedRow.id);
      const dateCheck = checkTestingDate(selectedRow.testingDate);
      const updateData: any = {
        results,
        machineUsed,
        temperature,
        solidBlockType: solidBlockType || null,
        brickType: brickType || null,
        modeOfCompaction: modeOfCompaction || null,
        status: 'Pending Initial Approval',
        dateOfIssue: new Date().toISOString(),
        engineerOnDutyId: laboratory?.engineerOnDuty || null,
        technicianId: user.uid,
        technician: user.name,
      };
      
      // Update testing date if testing on a different date
      if (dateCheck.isBefore || dateCheck.isAfter) {
        updateData.testingDate = new Date().toISOString();
      }
      
      // Calculate and update age based on casting date and testing date
      const finalTestingDate = updateData.testingDate || selectedRow.testingDate;
      updateData.age = calculateAge(selectedRow.castingDate, finalTestingDate);
      
      await updateDoc(docRef, updateData);
      toast({
        title: "Success",
        description: "Test results have been saved successfully.",
      });
      setIsTestDialogOpen(false);
      setSelectedRow(null);
      fetchData();
    } catch (error) {
      console.error("Error updating test results:", error);
      toast({
        variant: "destructive",
        title: "Update Failed",
        description: "Could not save the test results. Please try again.",
      });
    }
  };

  const handleMetadataSubmit = async (updatedData: Partial<BricksBlocksRegisterEntry>) => {
    if (!selectedRow) return;

    try {
      const docRef = doc(db, "bricks_blocks_register", selectedRow.id);
      await updateDoc(docRef, updatedData);
      toast({
        title: "Success",
        description: "Register entry has been updated successfully.",
      });
      setIsEditDialogOpen(false);
      setSelectedRow(null);
      fetchData();
    } catch (error) {
      console.error("Error updating entry:", error);
      toast({
        variant: "destructive",
        title: "Update Failed",
        description: "Could not update the register entry. Please try again.",
      });
    }
  };

  const getResultForRow = (row: BricksBlocksRegisterEntry, sampleId: string, field: keyof Omit<BricksBlocksTestResult, 'sampleId' | 'holeA' | 'holeB' | 'notch'>) => {
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
  
  const getHoleResult = (row: BricksBlocksRegisterEntry, sampleId: string, hole: 'holeA' | 'holeB' | 'notch', field: keyof HoleDimension) => {
      const result = row.results?.find(r => r.sampleId === sampleId);
      const value = result?.[hole]?.[field];
      if (value === undefined || value === null || (typeof value === 'number' && isNaN(value))) {
          return '-';
      }
      return value;
  }

  const openDeleteDialog = (entry: BricksBlocksRegisterEntry) => {
    setDeletingEntry(entry);
  };
  
  const openCertificateView = (entry: BricksBlocksRegisterEntry) => {
      setViewingCertificate(entry);
  }

  const handleDeleteEntry = async () => {
    if (!deletingEntry) return;
    try {
      await deleteDoc(doc(db, "bricks_blocks_register", deletingEntry.id));
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
    if(viewingCertificate.sampleType === 'Solid') {
       return <SolidBlockCertificate certificateData={viewingCertificate} onBack={() => setViewingCertificate(null)} />;
    }
    if(viewingCertificate.sampleType === 'Brick') {
       return <BrickCertificate certificateData={viewingCertificate} onBack={() => setViewingCertificate(null)} />;
    }
    if(viewingCertificate.sampleType === 'Hollow') {
       return <HollowBlockCertificate certificateData={viewingCertificate} onBack={() => setViewingCertificate(null)} />;
    }
  }

  return (
    <>
      <Card>
        <CardHeader>
             <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                    <CardTitle>Bricks &amp; Blocks Register</CardTitle>
                    <p className="text-muted-foreground text-sm mt-1">Detailed records of all brick and block samples.</p>
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
                    <Button 
                        onClick={() => openTestDialog(selectedRow!)} 
                        disabled={!selectedRow || (selectedRow && selectedRow.results && selectedRow.results.length > 0)}
                    >
                        <FlaskConical className="mr-2 h-4 w-4" />
                        Test Sample
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
                  <TableHead rowSpan={3}></TableHead>
                  {columnVisibility['Date Received'] && <TableHead rowSpan={3}>Date<br/>Received</TableHead>}
                  {columnVisibility['Client'] && <TableHead rowSpan={3}>Client</TableHead>}
                  {columnVisibility['Project'] && <TableHead rowSpan={3}>Project</TableHead>}
                  {columnVisibility['Casting Date'] && <TableHead rowSpan={3}>Casting<br/>Date</TableHead>}
                  {columnVisibility['Testing Date'] && <TableHead rowSpan={3}>Testing<br/>Date</TableHead>}
                  {columnVisibility['Age (Days)'] && <TableHead rowSpan={3}>Age<br/>(Days)</TableHead>}
                  {columnVisibility['Area of Use'] && <TableHead rowSpan={3}>Area of<br/>Use</TableHead>}
                  {columnVisibility['Sample ID'] && <TableHead rowSpan={3}>Sample<br/>ID</TableHead>}
                  {columnVisibility['Sample Type'] && <TableHead rowSpan={3}>Sample<br/>Type</TableHead>}
                  {columnVisibility['Dimensions (mm)'] && <TableHead colSpan={3} className="text-center border-l">Dimensions (mm)</TableHead>}
                  {columnVisibility['Dimensions of Holes & No. for Hollow Blocks'] && <TableHead colSpan={9} className="text-center border-l">Dimensions of Holes &amp; No. for Hollow Blocks</TableHead>}
                  {columnVisibility['Weight (kg)'] && <TableHead rowSpan={3} className="border-l">Weight<br/>(kg)</TableHead>}
                  {columnVisibility['Machine Used'] && <TableHead rowSpan={3}>Machine<br/>Used</TableHead>}
                  {columnVisibility['Load (kN)'] && <TableHead rowSpan={3}>Load<br/>(kN)</TableHead>}
                  {columnVisibility['Mode of Failure'] && <TableHead rowSpan={3}>Mode of<br/>Failure</TableHead>}
                  {columnVisibility['Temp. (°C)'] && <TableHead rowSpan={3}>Temp.<br/>(°C)</TableHead>}
                  {columnVisibility['Cert. No.'] && <TableHead rowSpan={3}>Cert.<br/>No.</TableHead>}
                  {columnVisibility['Comment'] && <TableHead rowSpan={3}>Comment</TableHead>}
                  {columnVisibility['Technician'] && <TableHead rowSpan={3}>Technician</TableHead>}
                  {columnVisibility['Date of Issue'] && <TableHead rowSpan={3}>Date of<br/>Issue</TableHead>}
                  {columnVisibility['Issue ID'] && <TableHead rowSpan={3}>Issue ID</TableHead>}
                  {columnVisibility['Taken by'] && <TableHead rowSpan={3}>Taken by</TableHead>}
                  {columnVisibility['Date Taken'] && <TableHead rowSpan={3}>Date<br/>Taken</TableHead>}
                  {columnVisibility['Contact'] && <TableHead rowSpan={3}>Contact</TableHead>}
                  {columnVisibility['Receipt No.'] && <TableHead rowSpan={3}>Receipt<br/>No.</TableHead>}
                  {columnVisibility['Actions'] && <TableHead rowSpan={3}>Actions</TableHead>}
                </TableRow>
                <TableRow>
                  {columnVisibility['Dimensions (mm)'] && <>
                    <TableHead rowSpan={2} className="border-l">Length</TableHead>
                    <TableHead rowSpan={2}>Width</TableHead>
                    <TableHead rowSpan={2}>Height</TableHead>
                  </>}
                  {columnVisibility['Dimensions of Holes & No. for Hollow Blocks'] && <>
                    <TableHead colSpan={3} className="text-center border-l">Hole a</TableHead>
                    <TableHead colSpan={3} className="text-center border-l">Hole b</TableHead>
                    <TableHead colSpan={3} className="text-center border-l">Notch</TableHead>
                  </>}
                </TableRow>
                <TableRow>
                  {columnVisibility['Dimensions of Holes & No. for Hollow Blocks'] && <>
                      <TableHead className="border-l">L (mm)</TableHead>
                      <TableHead>W (mm)</TableHead>
                      <TableHead>No.</TableHead>
                      <TableHead className="border-l">L (mm)</TableHead>
                      <TableHead>W (mm)</TableHead>
                      <TableHead>No.</TableHead>
                      <TableHead className="border-l">L (mm)</TableHead>
                      <TableHead>W (mm)</TableHead>
                      <TableHead>No.</TableHead>
                  </>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={28} className="h-24 text-center">
                      Loading bricks &amp; blocks register...
                    </TableCell>
                  </TableRow>
                ) : data.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={28} className="h-24 text-center">
                      No brick or block samples have been registered yet.
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
                    const isHollow = row.sampleType === 'Hollow';
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
                          {columnVisibility['Age (Days)'] && <TableCell>{age}</TableCell>}
                          {columnVisibility['Area of Use'] && <TableCell>{row.areaOfUse || '-'}</TableCell>}
                          {columnVisibility['Sample ID'] && <TableCell><div className="flex flex-col">{sortedSampleIds.map(id => <span key={id}>{id}</span>)}</div></TableCell>}
                          {columnVisibility['Sample Type'] && <TableCell>{row.sampleType || '-'}</TableCell>}
                          
                          {columnVisibility['Dimensions (mm)'] && <>
                            <TableCell><div className="flex flex-col">{sortedSampleIds.map(id => <span key={id}>{getResultForRow(row, id, 'length')}</span>)}</div></TableCell>
                            <TableCell><div className="flex flex-col">{sortedSampleIds.map(id => <span key={id}>{getResultForRow(row, id, 'width')}</span>)}</div></TableCell>
                            <TableCell><div className="flex flex-col">{sortedSampleIds.map(id => <span key={id}>{getResultForRow(row, id, 'height')}</span>)}</div></TableCell>
                          </>}

                          {columnVisibility['Dimensions of Holes & No. for Hollow Blocks'] && <>
                              <TableCell><div className="flex flex-col">{sortedSampleIds.map(id => <span key={id}>{isHollow ? getHoleResult(row, id, 'holeA', 'l') : '-'}</span>)}</div></TableCell>
                              <TableCell><div className="flex flex-col">{sortedSampleIds.map(id => <span key={id}>{isHollow ? getHoleResult(row, id, 'holeA', 'w') : '-'}</span>)}</div></TableCell>
                              <TableCell><div className="flex flex-col">{sortedSampleIds.map(id => <span key={id}>{isHollow ? getHoleResult(row, id, 'holeA', 'no') : '-'}</span>)}</div></TableCell>
                              <TableCell><div className="flex flex-col">{sortedSampleIds.map(id => <span key={id}>{isHollow ? getHoleResult(row, id, 'holeB', 'l') : '-'}</span>)}</div></TableCell>
                              <TableCell><div className="flex flex-col">{sortedSampleIds.map(id => <span key={id}>{isHollow ? getHoleResult(row, id, 'holeB', 'w') : '-'}</span>)}</div></TableCell>
                              <TableCell><div className="flex flex-col">{sortedSampleIds.map(id => <span key={id}>{isHollow ? getHoleResult(row, id, 'holeB', 'no') : '-'}</span>)}</div></TableCell>
                              <TableCell><div className="flex flex-col">{sortedSampleIds.map(id => <span key={id}>{isHollow ? getHoleResult(row, id, 'notch', 'l') : '-'}</span>)}</div></TableCell>
                              <TableCell><div className="flex flex-col">{sortedSampleIds.map(id => <span key={id}>{isHollow ? getHoleResult(row, id, 'notch', 'w') : '-'}</span>)}</div></TableCell>
                              <TableCell><div className="flex flex-col">{sortedSampleIds.map(id => <span key={id}>{isHollow ? getHoleResult(row, id, 'notch', 'no') : '-'}</span>)}</div></TableCell>
                          </>}

                          {columnVisibility['Weight (kg)'] && <TableCell><div className="flex flex-col">{sortedSampleIds.map(id => <span key={id}>{getResultForRow(row, id, 'weight')}</span>)}</div></TableCell>}
                          {columnVisibility['Machine Used'] && <TableCell>{machineName}</TableCell>}
                          {columnVisibility['Load (kN)'] && <TableCell><div className="flex flex-col">{sortedSampleIds.map(id => <span key={id}>{getResultForRow(row, id, 'load')}</span>)}</div></TableCell>}
                          {columnVisibility['Mode of Failure'] && <TableCell><div className="flex flex-col">{sortedSampleIds.map(id => <span key={id}>{getResultForRow(row, id, 'modeOfFailure')}</span>)}</div></TableCell>}
                          {columnVisibility['Temp. (°C)'] && <TableCell>{row.temperature ?? '-'}</TableCell>}
                          {columnVisibility['Cert. No.'] && <TableCell>
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
                          {columnVisibility['Receipt No.'] && <TableCell>{row.receiptId || '-'}</TableCell>}
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
                                    <DropdownMenuItem onClick={() => openEditDialog(row)}>Edit</DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem className="text-destructive" onClick={() => openDeleteDialog(row)}>Delete</DropdownMenuItem>
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
        <BricksBlocksTestDialog
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
            entryType="bricks_blocks_register"
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
              <AlertDialogAction onClick={handleDeleteEntry}>Continue</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <AlertDialog open={showDateWarning} onOpenChange={(open) => !open && setShowDateWarning(false)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Sample Not Yet Due for Testing</AlertDialogTitle>
              <AlertDialogDescription>
                This sample is scheduled for testing on <strong>{pendingTestEntry?.testingDate ? formatDate(pendingTestEntry.testingDate) : 'N/A'}</strong>. 
                <br /><br />
                Do you want to proceed with testing anyway? The testing date will be updated to today's date.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => {
                setShowDateWarning(false);
                setPendingTestEntry(null);
              }}>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleOverrideDate}>
                Proceed Anyway
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
    </>
  );
}

    

    