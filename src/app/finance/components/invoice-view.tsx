
"use client";

import * as React from "react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Printer } from "lucide-react";
import { type Invoice } from "@/lib/types";
import { useAuth } from "@/context/auth-context";
import { Badge } from "@/components/ui/badge";

interface InvoiceViewProps {
  invoice: Invoice;
  onBack: () => void;
}

const statusColorMap: Record<Invoice['status'], string> = {
    'Draft': 'text-gray-500 border-gray-500',
    'Sent': 'text-blue-500 border-blue-500',
    'Paid': 'text-green-500 border-green-500',
    'Partially Paid': 'text-yellow-500 border-yellow-500',
    'Overdue': 'text-red-500 border-red-500'
}

export function InvoiceView({
  invoice,
  onBack,
}: InvoiceViewProps) {
  const { laboratory } = useAuth();

  const handlePrint = () => {
    window.print();
  };
  
  const amountDue = invoice.total - (invoice.amountPaid || 0);

  return (
    <>
      <div className="bg-card sticky top-0 z-10 print:hidden mb-6">
        <div className="flex h-16 items-center justify-between border-b px-4 lg:px-6">
          <Button variant="outline" onClick={onBack}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Invoices
          </Button>
          <h2 className="text-lg font-semibold">Invoice #{invoice.invoiceId}</h2>
          <Button onClick={handlePrint}>
            <Printer className="mr-2 h-4 w-4" />
            Print / Save PDF
          </Button>
        </div>
      </div>

      <main className="bg-background flex justify-center p-4 print:p-0 print:m-0">
        <div className="w-full max-w-4xl p-8 sm:p-12 bg-card shadow-lg rounded-lg border print:border-none print:shadow-none">
          {/* Header */}
          <header className="flex justify-between items-start pb-6 mb-8 border-b">
            <div>
              {laboratory?.logo && <img src={laboratory.logo} alt="Company Logo" className="h-20 mb-4"/>}
              <h1 className="text-2xl font-bold">{laboratory?.name}</h1>
              <p className="text-sm text-muted-foreground">{laboratory?.address}</p>
              <p className="text-sm text-muted-foreground">{laboratory?.email}</p>
            </div>
            <div className="text-right">
              <h2 className="text-4xl font-bold uppercase text-muted-foreground">Invoice</h2>
              <p className="text-sm mt-2">
                <span className="font-semibold">ID:</span> #{invoice.invoiceId}
              </p>
               <p className="text-sm">
                <span className="font-semibold">Issued:</span> {format(new Date(invoice.date), "PPP")}
              </p>
            </div>
          </header>

          {/* Client Info & Due Date */}
          <section className="grid grid-cols-2 gap-8 mb-8">
             <div>
                <h3 className="font-semibold uppercase text-sm text-muted-foreground mb-2">Bill To</h3>
                <p className="font-bold text-lg">{invoice.clientName}</p>
                <p className="text-muted-foreground">{invoice.projectTitle}</p>
             </div>
             <div className="text-right">
                <p className="font-semibold">Due Date: {format(new Date(invoice.dueDate), "PPP")}</p>
                <p className="font-semibold text-lg mt-2">Amount Due (UGX)</p>
                <p className="text-3xl font-bold">{amountDue.toLocaleString()}</p>
             </div>
          </section>


           {/* Items Table */}
          <section className="mt-8">
            <div className="border-t">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="text-left font-semibold text-muted-foreground">
                            <th className="p-2 pt-4">Description</th>
                            <th className="p-2 pt-4 text-center">Qty</th>
                            <th className="p-2 pt-4 text-right">Unit Price</th>
                            <th className="p-2 pt-4 text-right">Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {invoice.items.map((item) => (
                            <tr key={item.id} className="border-b">
                                <td className="p-2">{item.description}</td>
                                <td className="p-2 text-center">{item.quantity}</td>
                                <td className="p-2 text-right">{item.unitPrice.toLocaleString()}</td>
                                <td className="p-2 text-right font-medium">{item.total.toLocaleString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
          </section>

           {/* Totals */}
            <section className="flex justify-end mt-8">
                <div className="w-full max-w-xs space-y-2 text-sm">
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Subtotal:</span>
                        <span className="font-medium">{invoice.subtotal.toLocaleString()} UGX</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">VAT (18%):</span>
                        <span className="font-medium">{invoice.tax.toLocaleString()} UGX</span>
                    </div>
                    <div className="flex justify-between text-lg font-bold border-t pt-2">
                        <span>Total:</span>
                        <span>{invoice.total.toLocaleString()} UGX</span>
                    </div>
                     {invoice.amountPaid && (
                        <div className="flex justify-between text-base font-semibold">
                            <span>Amount Paid:</span>
                            <span>- {invoice.amountPaid.toLocaleString()} UGX</span>
                        </div>
                     )}
                     <div className="flex justify-between text-xl font-bold border-t-2 border-primary pt-2 text-primary">
                        <span>Amount Due:</span>
                        <span>{amountDue.toLocaleString()} UGX</span>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="text-sm text-muted-foreground pt-8 mt-8 border-t">
                {invoice.notes && (
                    <div className="mb-4">
                        <h4 className="font-semibold mb-1">Notes</h4>
                        <p>{invoice.notes}</p>
                    </div>
                )}
                <p>Thank you for your business!</p>
            </footer>
        </div>
      </main>
    </>
  );
}
