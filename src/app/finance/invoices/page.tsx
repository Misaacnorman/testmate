
"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { collection, getDocs, doc, addDoc, updateDoc, writeBatch, query, where, deleteDoc, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Invoice, INVOICE_STATUSES } from '@/lib/types';
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
import { InvoiceView } from '../components/invoice-view';

const statusBadgeVariant: Record<typeof INVOICE_STATUSES[number], 'default' | 'secondary' | 'destructive' | 'outline'> = {
    'Draft': 'secondary',
    'Sent': 'outline',
    'Paid': 'default',
    'Partially Paid': 'outline',
    'Overdue': 'destructive'
}

export default function FinanceInvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { laboratoryId } = useAuth();
  
  const [deletingInvoice, setDeletingInvoice] = useState<Invoice | null>(null);
  const [viewingInvoice, setViewingInvoice] = useState<Invoice | null>(null);

  const fetchData = useCallback(async () => {
    if (!laboratoryId) return;
    setLoading(true);
    
    try {
      const invoicesSnapshot = await getDocs(query(collection(db, "invoices"), where("laboratoryId", "==", laboratoryId), orderBy("date", "desc")));
      const invoicesData = invoicesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Invoice));
      setInvoices(invoicesData);
    } catch (error) {
      console.error("Error fetching data: ", error);
      toast({
        variant: "destructive",
        title: "Failed to fetch data",
        description: "Could not load invoices from Firestore.",
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

  const openDeleteDialog = (invoice: Invoice) => {
    setDeletingInvoice(invoice);
  };
  
  const openViewDialog = (invoice: Invoice) => {
    setViewingInvoice(invoice);
  };

  const handleDeleteInvoice = async () => {
    if (!deletingInvoice) return;
    try {
      await deleteDoc(doc(db, 'invoices', deletingInvoice.id));
      toast({ title: "Invoice Deleted", description: `Invoice "${deletingInvoice.invoiceId}" has been deleted.` });
      fetchData();
    } catch (error) {
      console.error("Error deleting invoice:", error);
      toast({ variant: "destructive", title: "Deletion Failed", description: "Could not delete the invoice." });
    } finally {
      setDeletingInvoice(null);
    }
  };

  if (viewingInvoice) {
    return <InvoiceView invoice={viewingInvoice} onBack={() => setViewingInvoice(null)} />;
  }


  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Invoices</CardTitle>
              <CardDescription>Create and manage client invoices.</CardDescription>
            </div>
             <HasPermission permissionId="finance:invoices:create">
                <Button disabled>
                <PlusCircle className="mr-2 h-4 w-4" />
                Create Invoice
                </Button>
            </HasPermission>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Invoice ID</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Total (UGX)</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead><span className="sr-only">Actions</span></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center">
                      <Loader2 className="mx-auto h-6 w-6 animate-spin" />
                    </TableCell>
                  </TableRow>
                ) : invoices.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center">
                      No invoices found.
                    </TableCell>
                  </TableRow>
                ) : (
                  invoices.map((invoice) => (
                    <TableRow key={invoice.id}>
                      <TableCell className="font-medium">{invoice.invoiceId}</TableCell>
                      <TableCell>{invoice.clientName}</TableCell>
                      <TableCell>{format(new Date(invoice.date), 'PPP')}</TableCell>
                      <TableCell>{format(new Date(invoice.dueDate), 'PPP')}</TableCell>
                      <TableCell>{invoice.total.toLocaleString()}</TableCell>
                      <TableCell><Badge variant={statusBadgeVariant[invoice.status]}>{invoice.status}</Badge></TableCell>
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
                            <DropdownMenuItem onClick={() => openViewDialog(invoice)}>View Invoice</DropdownMenuItem>
                            <HasPermission permissionId="finance:invoices:update">
                                <DropdownMenuItem disabled>Edit</DropdownMenuItem>
                            </HasPermission>
                             <HasPermission permissionId="finance:invoices:delete">
                                <DropdownMenuItem className="text-destructive" onClick={() => openDeleteDialog(invoice)}>Delete</DropdownMenuItem>
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
      
      <AlertDialog open={!!deletingInvoice} onOpenChange={(open) => !open && setDeletingInvoice(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action will permanently delete invoice "{deletingInvoice?.invoiceId}". This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteInvoice}>
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
