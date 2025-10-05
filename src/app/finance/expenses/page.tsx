
"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { collection, getDocs, doc, addDoc, updateDoc, writeBatch, query, where, deleteDoc, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Expense } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { PlusCircle, MoreHorizontal } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/auth-context';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { HasPermission } from '@/components/auth/has-permission';
import { ExpenseDialog } from '../components/expense-dialog';

export default function FinanceExpensesPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);

  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { laboratoryId } = useAuth();
  
  const [deletingExpense, setDeletingExpense] = useState<Expense | null>(null);

  const fetchData = useCallback(async () => {
    if (!laboratoryId) return;
    setLoading(true);
    
    try {
      const expensesSnapshot = await getDocs(query(collection(db, "expenses"), where("laboratoryId", "==", laboratoryId), orderBy("date", "desc")));
      const expensesData = expensesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Expense));
      setExpenses(expensesData);
    } catch (error) {
      console.error("Error fetching data: ", error);
      toast({
        variant: "destructive",
        title: "Failed to fetch data",
        description: "Could not load expenses from Firestore.",
      });
    } finally {
      setLoading(false);
    }
  }, [toast, laboratoryId]);

  useEffect(() => {
    if(laboratoryId) {
      fetchData();
    }
  }, [fetchData, laboratoryId]);

  const handleOpenDialog = (expense: Expense | null = null) => {
    setEditingExpense(expense);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setEditingExpense(null);
    setIsDialogOpen(false);
  };

  const handleFormSubmit = async (expenseData: Partial<Omit<Expense, 'id' | 'laboratoryId'>>) => {
    if (!laboratoryId) return;
    
    try {
      if (editingExpense) {
        const expenseRef = doc(db, "expenses", editingExpense.id);
        await updateDoc(expenseRef, expenseData);
        toast({ title: "Expense Updated" });
      } else {
        const dataToSave = { ...expenseData, laboratoryId };
        await addDoc(collection(db, "expenses"), dataToSave);
        toast({ title: "Expense Added" });
      }
      fetchData();
      handleCloseDialog();
    } catch (error) {
      console.error("Error saving expense:", error);
      toast({
        variant: "destructive",
        title: "Save Failed",
        description: "Could not save the expense.",
      });
    }
  };

  const openDeleteDialog = (expense: Expense) => {
    setDeletingExpense(expense);
  };

  const handleDeleteExpense = async () => {
    if (!deletingExpense) return;
    try {
      await deleteDoc(doc(db, 'expenses', deletingExpense.id));
      toast({ title: "Expense Deleted" });
      fetchData();
    } catch (error) {
      console.error("Error deleting expense:", error);
      toast({ variant: "destructive", title: "Deletion Failed" });
    } finally {
      setDeletingExpense(null);
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Expenses</CardTitle>
              <CardDescription>Track and manage laboratory expenses.</CardDescription>
            </div>
             <HasPermission permissionId="finance:expenses:create">
                <Button onClick={() => handleOpenDialog()}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Expense
                </Button>
            </HasPermission>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Amount (UGX)</TableHead>
                  <TableHead><span className="sr-only">Actions</span></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                      <Loader2 className="mx-auto h-6 w-6 animate-spin" />
                    </TableCell>
                  </TableRow>
                ) : expenses.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                      No expenses recorded.
                    </TableCell>
                  </TableRow>
                ) : (
                  expenses.map((expense) => (
                    <TableRow key={expense.id}>
                      <TableCell>{format(new Date(expense.date), 'PPP')}</TableCell>
                      <TableCell><Badge variant="outline">{expense.category}</Badge></TableCell>
                      <TableCell className="font-medium">{expense.description}</TableCell>
                      <TableCell>{expense.amount.toLocaleString()}</TableCell>
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
                             <HasPermission permissionId="finance:expenses:create">
                                <DropdownMenuItem onClick={() => handleOpenDialog(expense)}>Edit</DropdownMenuItem>
                            </HasPermission>
                             <HasPermission permissionId="finance:expenses:delete">
                                <DropdownMenuItem className="text-destructive" onClick={() => openDeleteDialog(expense)}>Delete</DropdownMenuItem>
                            </HasPermission>
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
      
      <ExpenseDialog
        isOpen={isDialogOpen}
        onClose={handleCloseDialog}
        onSubmit={handleFormSubmit}
        expense={editingExpense}
      />
      
      <AlertDialog open={!!deletingExpense} onOpenChange={(open) => !open && setDeletingExpense(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action will permanently delete this expense record. This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteExpense}>
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
