
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
import type { WaterAbsorptionRegisterEntry, WaterAbsorptionTestResult } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { EditEntryDialog } from "./edit-entry-dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { FlaskConical, Loader2, MoreHorizontal, Terminal, Columns } from "lucide-react";
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
import { WaterAbsorptionCertificate } from "@/app/test-certificates/components/WaterAbsorptionCertificate";
import { WaterAbsorptionTestDialog } from "./water-absorption-test-dialog";
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
    'Date of Receipt': true,
    'Client': true,
    'Project': true,
    'Casting Date': true,
    'Testing Date': true,
    'Age (Days)': true,
    'Area of Use': true,
    'Sample ID': true,
    'Sample Type': true,
    'Dimensions (mm)': true,
    'Oven Dried Weight Before soaking (kg)': true,
    'Weight After soaking (kg)': true,
    'Weight of Water (kg)': true,
    'Calculated Water Absorption (%)': true,
    'Certificate Number': false,
    'Comment/Remark': false,
    'Technician (Name & Signature)': false,
    'Date of Issue': false,
    'Issue ID/Serial No.': false,
    'Taken by': false,
    'Date Taken': false,
    'Contact': false,
    'Sample Receipt Number': false,
    'Actions': true,
};

export function WaterAbsorptionTable() {
  const [data, setData] = React.useState<WaterAbsorptionRegisterEntry[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [selectedRow, setSelectedRow] = React.useState<WaterAbsorptionRegisterEntry | null>(null);
  const [isTestDialogOpen, setIsTestDialogOpen] = React.useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false);
  const [firestoreError, setFirestoreError] = React.useState(false);
  const [deletingEntry, setDeletingEntry] = React.useState<WaterAbsorptionRegisterEntry | null>(null);
  const [viewingCertificate, setViewingCertificate] = React.useState<WaterAbsorptionRegisterEntry | null>(null);
  const [showDateWarning, setShowDateWarning] = React.useState(false);
  const [pendingTestEntry, setPendingTestEntry] = React.useState<WaterAbsorptionRegisterEntry | null>(null);
  const { toast } = useToast();
  const { user, laboratory } = useAuth();
  const [columnVisibility, setColumnVisibility] = React.useState(initialColumnVisibility);


  const fetchData = React.useCallback(async () => {
    setLoading(true);
    setFirestoreError(false);
    try {
        const q = query(
          collection(db, "water_absorption_register"),
          orderBy("dateReceived", "desc"),
          orderBy("setId", "asc")
        );
        const querySnapshot = await getDocs(q);
        const samplesData: WaterAbsorptionRegisterEntry[] = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        } as WaterAbsorptionRegisterEntry));
        setData(samplesData);
    } catch (error: any) {
         console.error("Error fetching water absorption register data:", error);
         if (error.code === 'failed-precondition') {
             setFirestoreError(true);
            const fallbackQuery = query(collection(db, "water_absorption_register"));
            const querySnapshot = await getDocs(fallbackQuery);
             const samplesData: WaterAbsorptionRegisterEntry[] = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            } as WaterAbsorptionRegisterEntry));
            setData(samplesData.sort((a, b) => new Date(b.dateReceived).getTime() - new Date(a.dateReceived).getTime() || a.setId - b.setId));
         }
    } finally {
        setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSelectRow = (row: WaterAbsorptionRegisterEntry) => {
    if (selectedRow?.id === row.id) {
      setSelectedRow(null);
    } else {
      setSelectedRow(row);
    }
  };

  const openEditDialog = (entry: WaterAbsorptionRegisterEntry) => {
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
  
  const openTestDialog = (entry: WaterAbsorptionRegisterEntry) => {
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
  
  const handleTestSubmit = async (results: WaterAbsorptionTestResult[], machineUsed: string, temperature: number) => {
    if (!selectedRow || !user) return;

    try {
      const docRef = doc(db, "water_absorption_register", selectedRow.id);
      const dateCheck = checkTestingDate(selectedRow.testingDate);
      const updateData: any = {
        results,
        machineUsed,
        temperature,
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
        description: "Test results have been saved and certificate is pending approval.",
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

  const handleMetadataSubmit = async (updatedData: Partial<WaterAbsorptionRegisterEntry>) => {
    if (!selectedRow) return;

    try {
      const docRef = doc(db, "water_absorption_register", selectedRow.id);
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

  const getResultForRow = (row: WaterAbsorptionRegisterEntry, sampleId: string, field: keyof Omit<WaterAbsorptionTestResult, 'sampleId'>) => {
    const result = row.results?.find(r => r.sampleId === sampleId);
    if (!result) return '-';
    
    const value = result[field] as number | undefined;

    if (value === undefined || value === null || isNaN(value)) {
        return '-';
    }

    return value.toFixed(field === 'waterAbsorption' ? 1 : 2);
  };
  
  const openDeleteDialog = (entry: WaterAbsorptionRegisterEntry) => {
    setDeletingEntry(entry);
  };
  
  const openCertificateView = (entry: WaterAbsorptionRegisterEntry) => {
    setViewingCertificate(entry);
  }

  const handleDeleteEntry = async () => {
    if (!deletingEntry) return;
    try {
      await deleteDoc(doc(db, "water_absorption_register", deletingEntry.id));
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
    return <WaterAbsorptionCertificate certificateData={viewingCertificate} onBack={() => setViewingCertificate(null)} />;
  }


  return (
    <>
      <Card>
        <CardHeader>
             <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                    <CardTitle>Water Absorption Register</CardTitle>
                    <p className="text-muted-foreground text-sm mt-1">Detailed records of all water absorption tests.</p>
                </div>
                 <div className="flex items-center gap-2">
                     <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline">
                                <Columns className="mr-2 h-4 w-4" />
                                Columns
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
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
                  <TableHead rowSpan={2}></TableHead>
                  {columnVisibility['Date of Receipt'] && <TableHead rowSpan={2}>Date of<br/>Receipt</TableHead>}
                  {columnVisibility['Client'] && <TableHead rowSpan={2}>Client</TableHead>}
                  {columnVisibility['Project'] && <TableHead rowSpan={2}>Project</TableHead>}
                  {columnVisibility['Casting Date'] && <TableHead rowSpan={2}>Casting<br/>Date</TableHead>}
                  {columnVisibility['Testing Date'] && <TableHead rowSpan={2}>Testing<br/>Date</TableHead>}
                  {columnVisibility['Age (Days)'] && <TableHead rowSpan={2}>Age<br/>(Days)</TableHead>}
                  {columnVisibility['Area of Use'] && <TableHead rowSpan={2}>Area of<br/>Use</TableHead>}
                  {columnVisibility['Sample ID'] && <TableHead rowSpan={2}>Sample<br/>ID</TableHead>}
                  {columnVisibility['Sample Type'] && <TableHead rowSpan={2}>Sample<br/>Type</TableHead>}
                  {columnVisibility['Dimensions (mm)'] && <TableHead colSpan={3} className="text-center border-l">Dimensions (mm)</TableHead>}
                  {columnVisibility['Oven Dried Weight Before soaking (kg)'] && <TableHead rowSpan={2} className="border-l">Oven Dried<br/>Weight Before<br/>soaking (kg)</TableHead>}
                  {columnVisibility['Weight After soaking (kg)'] && <TableHead rowSpan={2}>Weight<br/>After<br/>soaking (kg)</TableHead>}
                  {columnVisibility['Weight of Water (kg)'] && <TableHead rowSpan={2}>Weight of<br/>Water (kg)</TableHead>}
                  {columnVisibility['Calculated Water Absorption (%)'] && <TableHead rowSpan={2}>Calculated<br/>Water<br/>Absorption (%)</TableHead>}
                  {columnVisibility['Certificate Number'] && <TableHead rowSpan={2}>Certificate<br/>Number</TableHead>}
                  {columnVisibility['Comment/Remark'] && <TableHead rowSpan={2}>Comment/<br/>Remark</TableHead>}
                  {columnVisibility['Technician (Name & Signature)'] && <TableHead rowSpan={2}>Technician<br/>(Name & Signature)</TableHead>}
                  {columnVisibility['Date of Issue'] && <TableHead rowSpan={2}>Date of<br/>Issue</TableHead>}
                  {columnVisibility['Issue ID/Serial No.'] && <TableHead rowSpan={2}>Issue ID/<br/>Serial No.</TableHead>}
                  {columnVisibility['Taken by'] && <TableHead rowSpan={2}>Taken<br/>by</TableHead>}
                  {columnVisibility['Date Taken'] && <TableHead rowSpan={2}>Date<br/>Taken</TableHead>}
                  {columnVisibility['Contact'] && <TableHead rowSpan={2}>Contact</TableHead>}
                  {columnVisibility['Sample Receipt Number'] && <TableHead rowSpan={2}>Sample<br/>Receipt<br/>Number</TableHead>}
                  {columnVisibility['Actions'] && <TableHead rowSpan={2}>Actions</TableHead>}
                </TableRow>
                <TableRow>
                  {columnVisibility['Dimensions (mm)'] && <>
                    <TableHead className="border-l">Length</TableHead>
                    <TableHead>Width</TableHead>
                    <TableHead>Height</TableHead>
                  </>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={27} className="h-24 text-center">
                      <Loader2 className="h-6 w-6 animate-spin" />
                    </TableCell>
                  </TableRow>
                ) : data.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={27} className="h-24 text-center">
                      No water absorption samples have been registered yet.
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
                    return (
                        <TableRow key={row.id} data-state={selectedRow?.id === row.id ? 'selected' : ''}>
                          <TableCell>
                              <Checkbox
                                  checked={selectedRow?.id === row.id}
                                  onCheckedChange={() => handleSelectRow(row)}
                                  aria-label="Select row"
                              />
                          </TableCell>
                          {columnVisibility['Date of Receipt'] && <TableCell>{formatDate(row.dateReceived)}</TableCell>}
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
                          
                          {columnVisibility['Oven Dried Weight Before soaking (kg)'] && <TableCell><div className="flex flex-col">{sortedSampleIds.map(id => <span key={id}>{getResultForRow(row, id, 'ovenDriedWeight')}</span>)}</div></TableCell>}
                          {columnVisibility['Weight After soaking (kg)'] && <TableCell><div className="flex flex-col">{sortedSampleIds.map(id => <span key={id}>{getResultForRow(row, id, 'weightAfterSoaking')}</span>)}</div></TableCell>}
                          {columnVisibility['Weight of Water (kg)'] && <TableCell><div className="flex flex-col">{sortedSampleIds.map(id => <span key={id}>{getResultForRow(row, id, 'weightOfWater')}</span>)}</div></TableCell>}
                          {columnVisibility['Calculated Water Absorption (%)'] && <TableCell><div className="flex flex-col">{sortedSampleIds.map(id => <span key={id}>{getResultForRow(row, id, 'waterAbsorption')}</span>)}</div></TableCell>}
                          
                          {columnVisibility['Certificate Number'] && <TableCell>
                            {row.certificateNumber ? (
                                <Button variant="link" className="p-0 h-auto" onClick={() => openCertificateView(row)}>
                                    {row.certificateNumber}
                                </Button>
                            ) : '-'}
                          </TableCell>}
                          {columnVisibility['Comment/Remark'] && <TableCell>{row.comment || '-'}</TableCell>}
                          {columnVisibility['Technician (Name & Signature)'] && <TableCell>{row.technician || '-'}</TableCell>}
                          {columnVisibility['Date of Issue'] && <TableCell>{formatDate(row.dateOfIssue)}</TableCell>}
                          {columnVisibility['Issue ID/Serial No.'] && <TableCell>{row.issueId || '-'}</TableCell>}
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
        <WaterAbsorptionTestDialog
            isOpen={isTestDialogOpen}
            onClose={() => {
                setIsTestDialogOpen(false);
                setSelectedRow(null);
            }}
            sampleSet={selectedRow}
            onSubmit={handleTestSubmit}
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
            entryType="water_absorption_register"
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
