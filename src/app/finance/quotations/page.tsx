
"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { collection, getDocs, doc, addDoc, updateDoc, writeBatch, query, where, deleteDoc, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Quote, Test, Invoice } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { PlusCircle, MoreHorizontal, FileText } from 'lucide-react';
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
import { format, addDays } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { QuoteDialog } from '../components/quote-dialog';
import { HasPermission } from '@/components/auth/has-permission';
import { useRouter } from 'next/navigation';

export default function FinanceQuotationsPage() {
  const router = useRouter();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingQuote, setEditingQuote] = useState<Quote | null>(null);

  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [tests, setTests] = useState<Test[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { laboratoryId } = useAuth();
  
  const [deletingQuote, setDeletingQuote] = useState<Quote | null>(null);

  const fetchData = useCallback(async () => {
    if (!laboratoryId) return;
    setLoading(true);
    
    try {
      const [quotesSnapshot, testsSnapshot] = await Promise.all([
        getDocs(query(collection(db, "quotations"), where("laboratoryId", "==", laboratoryId), orderBy("date", "desc"))),
        getDocs(query(collection(db, "tests"))),
      ]);
      const quotesData = quotesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Quote));
      const testsData = testsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Test));
      setQuotes(quotesData);
      setTests(testsData);
    } catch (error) {
      console.error("Error fetching data: ", error);
      toast({
        variant: "destructive",
        title: "Failed to fetch data",
        description: "Could not load quotations from Firestore.",
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

  const handleOpenDialog = (quote: Quote | null = null) => {
    setEditingQuote(quote);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setEditingQuote(null);
    setIsDialogOpen(false);
  };

  const handleFormSubmit = async (quoteData: Partial<Omit<Quote, 'id' | 'laboratoryId'>>) => {
    if (!laboratoryId) return;
    
    try {
      if (editingQuote) {
        const quoteRef = doc(db, "quotations", editingQuote.id);
        await updateDoc(quoteRef, quoteData);
        toast({ title: "Quote Updated", description: `Quote "${quoteData.quoteId}" has been updated.` });
      } else {
        const dataToSave = { ...quoteData, laboratoryId, date: new Date().toISOString() };
        await addDoc(collection(db, "quotations"), dataToSave);
        toast({ title: "Quote Created", description: `Quote "${quoteData.quoteId}" has been created.` });
      }
      fetchData();
      handleCloseDialog();
    } catch (error) {
      console.error("Error saving quote:", error);
      toast({
        variant: "destructive",
        title: "Save Failed",
        description: "Could not save the quote.",
      });
    }
  };

  const openDeleteDialog = (quote: Quote) => {
    setDeletingQuote(quote);
  };

  const handleDeleteQuote = async () => {
    if (!deletingQuote) return;
    try {
      await deleteDoc(doc(db, 'quotations', deletingQuote.id));
      toast({ title: "Quote Deleted", description: `Quote "${deletingQuote.quoteId}" has been deleted.` });
      fetchData();
    } catch (error) {
      console.error("Error deleting quote:", error);
      toast({ variant: "destructive", title: "Deletion Failed", description: "Could not delete the quote." });
    } finally {
      setDeletingQuote(null);
    }
  };

  const handleConvertToInvoice = async (quote: Quote) => {
    if (!laboratoryId) return;
    try {
      const batch = writeBatch(db);

      // 1. Create the new invoice document
      const newInvoiceRef = doc(collection(db, 'invoices'));
      const newInvoice: Omit<Invoice, 'id'> = {
          invoiceId: `INV-${Date.now().toString().slice(-6)}`,
          clientId: quote.clientId,
          clientName: quote.clientName,
          projectTitle: quote.projectTitle,
          date: new Date().toISOString(),
          dueDate: addDays(new Date(), 30).toISOString(),
          items: quote.items,
          subtotal: quote.subtotal,
          tax: quote.tax,
          total: quote.total,
          status: 'Draft',
          laboratoryId,
          quoteId: quote.id,
          amountPaid: 0,
      }
      batch.set(newInvoiceRef, newInvoice);

      // 2. Update the quote status to 'Accepted'
      const quoteRef = doc(db, 'quotations', quote.id);
      batch.update(quoteRef, { status: 'Accepted' });

      await batch.commit();

      toast({ title: "Invoice Created", description: `Invoice ${newInvoice.invoiceId} has been created from quote ${quote.quoteId}.` });
      router.push('/finance/invoices');
    } catch (error) {
        console.error("Error converting quote to invoice:", error);
        toast({ variant: "destructive", title: "Conversion Failed" });
    }
  };


  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Quotations</CardTitle>
              <CardDescription>Create and manage quotations for clients.</CardDescription>
            </div>
             <HasPermission permissionId="finance:quotes:create">
                <Button onClick={() => handleOpenDialog()}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Create Quote
                </Button>
            </HasPermission>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Quote ID</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Project</TableHead>
                  <TableHead>Date</TableHead>
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
                ) : quotes.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center">
                      No quotations found.
                    </TableCell>
                  </TableRow>
                ) : (
                  quotes.map((quote) => (
                    <TableRow key={quote.id}>
                      <TableCell className="font-medium">{quote.quoteId}</TableCell>
                      <TableCell>{quote.clientName}</TableCell>
                      <TableCell>{quote.projectTitle}</TableCell>
                      <TableCell>{format(new Date(quote.date), 'PPP')}</TableCell>
                      <TableCell>{quote.total.toLocaleString()}</TableCell>
                      <TableCell><Badge variant="secondary">{quote.status}</Badge></TableCell>
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
                            <DropdownMenuItem><FileText className="mr-2 h-4 w-4" />View Quote</DropdownMenuItem>
                            <HasPermission permissionId="finance:quotes:update">
                                <DropdownMenuItem onClick={() => handleOpenDialog(quote)} disabled={quote.status !== 'Draft'}>Edit</DropdownMenuItem>
                            </HasPermission>
                             <HasPermission permissionId="finance:invoices:create">
                                <DropdownMenuItem onClick={() => handleConvertToInvoice(quote)} disabled={quote.status !== 'Sent' && quote.status !== 'Draft'}>Convert to Invoice</DropdownMenuItem>
                            </HasPermission>
                             <DropdownMenuSeparator />
                             <HasPermission permissionId="finance:quotes:delete">
                                <DropdownMenuItem className="text-destructive" onClick={() => openDeleteDialog(quote)}>Delete</DropdownMenuItem>
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
      
      <QuoteDialog
        isOpen={isDialogOpen}
        onClose={handleCloseDialog}
        onSubmit={handleFormSubmit}
        quote={editingQuote}
        tests={tests}
      />
      
      <AlertDialog open={!!deletingQuote} onOpenChange={(open) => !open && setDeletingQuote(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action will permanently delete quote "{deletingQuote?.quoteId}". This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteQuote}>
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
