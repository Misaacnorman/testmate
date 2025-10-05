
"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Card,
  CardContent,
  CardDescription,
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
import { Button } from "@/components/ui/button";
import { Loader2, MoreHorizontal, PlusCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { db } from "@/lib/firebase";
import { collection, getDocs, doc, addDoc, updateDoc, deleteDoc, query } from "firebase/firestore";
import { useAuth } from "@/context/auth-context";
import { CorrectionFactorMachine } from "@/lib/types";
import { MachineDialog } from "./machine-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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

export function MachineSettings() {
  const { laboratoryId } = useAuth();
  const [machines, setMachines] = useState<CorrectionFactorMachine[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingMachine, setEditingMachine] = useState<Partial<CorrectionFactorMachine> | null>(null);
  const [deletingMachine, setDeletingMachine] = useState<CorrectionFactorMachine | null>(null);
  const { toast } = useToast();

  const fetchMachines = useCallback(async () => {
    if (!laboratoryId) return;
    setIsLoading(true);
    try {
      const q = query(collection(db, "laboratories", laboratoryId, "machines"));
      const querySnapshot = await getDocs(q);
      const machinesData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as CorrectionFactorMachine));
      setMachines(machinesData);
    } catch (error) {
      console.error("Error fetching machines:", error);
      toast({ variant: "destructive", title: "Failed to load machines" });
    } finally {
      setIsLoading(false);
    }
  }, [laboratoryId, toast]);

  useEffect(() => {
    fetchMachines();
  }, [fetchMachines]);
  
  const handleOpenDialog = (machine: Partial<CorrectionFactorMachine> | null = null) => {
    setEditingMachine(machine);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setEditingMachine(null);
    setIsDialogOpen(false);
  };
  
  const handleSubmit = async (machineData: Partial<CorrectionFactorMachine>) => {
    if (!laboratoryId) return;
    
    try {
      if (editingMachine?.id) {
        const { id, ...dataToUpdate } = machineData;
        await updateDoc(doc(db, "laboratories", laboratoryId, "machines", editingMachine.id), dataToUpdate);
        toast({ title: "Machine Updated" });
      } else {
        await addDoc(collection(db, "laboratories", laboratoryId, "machines"), { ...machineData, laboratoryId });
        toast({ title: "Machine Added" });
      }
      fetchMachines();
      handleCloseDialog();
    } catch (error) {
      console.error("Error saving machine:", error);
      toast({ variant: "destructive", title: "Save failed" });
    }
  };

  const handleDelete = async () => {
    if (!deletingMachine || !laboratoryId) return;
    try {
        await deleteDoc(doc(db, "laboratories", laboratoryId, "machines", deletingMachine.id));
        toast({ title: "Machine Deleted" });
        fetchMachines();
    } catch (error) {
        console.error("Error deleting machine:", error);
        toast({ variant: "destructive", title: "Deletion failed" });
    } finally {
        setDeletingMachine(null);
    }
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Machine Correction Factors</CardTitle>
              <CardDescription>
                Manage correction factors for compressive strength machines (y = mx + c).
              </CardDescription>
            </div>
            <Button onClick={() => handleOpenDialog()}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Machine
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Machine Name</TableHead>
                  <TableHead>Tag ID</TableHead>
                  <TableHead>Factor 'm'</TableHead>
                  <TableHead>Factor 'c'</TableHead>
                  <TableHead><span className="sr-only">Actions</span></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                      <Loader2 className="mx-auto h-6 w-6 animate-spin" />
                    </TableCell>
                  </TableRow>
                ) : machines.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                      No machines configured.
                    </TableCell>
                  </TableRow>
                ) : (
                  machines.map((machine) => (
                    <TableRow key={machine.id}>
                      <TableCell>{machine.name}</TableCell>
                      <TableCell>{machine.tagId}</TableCell>
                      <TableCell>{machine.factorM}</TableCell>
                      <TableCell>{machine.factorC}</TableCell>
                      <TableCell>
                         <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">Open menu</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => handleOpenDialog(machine)}>Edit</DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive" onClick={() => setDeletingMachine(machine)}>Delete</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      <MachineDialog
        isOpen={isDialogOpen}
        onClose={handleCloseDialog}
        onSubmit={handleSubmit}
        machine={editingMachine}
      />
       <AlertDialog open={!!deletingMachine} onOpenChange={(open) => !open && setDeletingMachine(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the machine "{deletingMachine?.name}". This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
