
"use client";

import * as React from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DatePicker } from "@/app/samples/components/date-picker";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Plus, Search, Trash2 } from "lucide-react";
import { Quote, QuoteItem, QUOTE_STATUSES, Test } from "@/lib/types";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { addDays } from "date-fns";

const quoteFormSchema = z.object({
  clientName: z.string().min(1, "Client name is required."),
  projectTitle: z.string().min(1, "Project title is required."),
  validUntil: z.date(),
  items: z.array(z.object({
    id: z.string(),
    description: z.string().min(1, "Description cannot be empty."),
    quantity: z.coerce.number().min(1, "Quantity must be at least 1."),
    unitPrice: z.coerce.number().min(0, "Unit price cannot be negative."),
  })).min(1, "At least one item is required."),
  status: z.enum(QUOTE_STATUSES),
  notes: z.string().optional(),
});

type QuoteFormData = z.infer<typeof quoteFormSchema>;

interface QuoteDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<Omit<Quote, 'id' | 'laboratoryId'>>) => Promise<void>;
  quote: Quote | null;
  tests: Test[];
}

export function QuoteDialog({ isOpen, onClose, onSubmit, quote, tests }: QuoteDialogProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const form = useForm<QuoteFormData>({
    resolver: zodResolver(quoteFormSchema),
  });
  
  const { fields, append, remove, update } = useFieldArray({
    control: form.control,
    name: "items",
  });

  const watchedItems = form.watch("items");
  const subtotal = React.useMemo(() => watchedItems?.reduce((acc, item) => acc + (item.quantity * item.unitPrice), 0) || 0, [watchedItems]);
  const tax = subtotal * 0.18; // Assuming 18% VAT
  const total = subtotal + tax;

  React.useEffect(() => {
    if (quote) {
      form.reset({
        ...quote,
        validUntil: new Date(quote.validUntil),
        items: quote.items.map(item => ({
            id: item.id,
            description: item.description,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
        })),
      });
    } else {
      form.reset({
        clientName: '',
        projectTitle: '',
        validUntil: addDays(new Date(), 30),
        items: [],
        status: 'Draft',
        notes: '',
      });
    }
  }, [quote, isOpen, form]);
  
  const handleAddTest = (test: Test) => {
    append({
        id: test.id!,
        description: test.materialTest,
        quantity: 1,
        unitPrice: test.amountUGX || 0,
    });
  }

  const handleAddCustomItem = () => {
    append({
        id: `custom-${Date.now()}`,
        description: '',
        quantity: 1,
        unitPrice: 0,
    });
  }

  const handleFormSubmit = async (data: QuoteFormData) => {
    setIsSubmitting(true);
    try {
      const quoteId = quote?.quoteId || `QUO-${Date.now().toString().slice(-6)}`;
      const dataToSubmit = {
        ...data,
        quoteId,
        validUntil: data.validUntil.toISOString(),
        items: data.items.map(item => ({...item, total: item.quantity * item.unitPrice })),
        subtotal,
        tax,
        total,
      }
      await onSubmit(dataToSubmit);
    } catch (error) {
      toast({ variant: "destructive", title: "Submission Failed" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>{quote ? `Edit Quote #${quote.quoteId}` : "Create New Quote"}</DialogTitle>
          <DialogDescription>
            Fill in the client and project details, then add items to the quote.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleFormSubmit)} className="flex-grow overflow-hidden flex flex-col">
                <ScrollArea className="flex-grow pr-6 -mr-6">
                    <div className="space-y-4 py-4">
                        <div className="grid grid-cols-2 gap-4">
                            <FormField control={form.control} name="clientName" render={({ field }) => (
                                <FormItem><FormLabel>Client Name *</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                            )}/>
                            <FormField control={form.control} name="projectTitle" render={({ field }) => (
                                <FormItem><FormLabel>Project Title *</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                            )}/>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <FormField control={form.control} name="validUntil" render={({ field }) => (
                                <FormItem className="flex flex-col"><FormLabel>Valid Until *</FormLabel><DatePicker value={field.value} onChange={field.onChange} /><FormMessage /></FormItem>
                            )}/>
                            <FormField control={form.control} name="status" render={({ field }) => (
                                <FormItem><FormLabel>Status *</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue/></SelectTrigger></FormControl><SelectContent>{QUOTE_STATUSES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem>
                            )}/>
                        </div>
                        
                        <div className="space-y-2 pt-4">
                            <h3 className="font-medium">Quote Items</h3>
                            <div className="border rounded-md">
                                {fields.map((field, index) => (
                                    <div key={field.id} className="grid grid-cols-[1fr,100px,120px,120px,auto] items-center gap-2 p-2 border-b last:border-b-0">
                                        <Input {...form.register(`items.${index}.description`)} placeholder="Item description" className="h-9"/>
                                        <Input {...form.register(`items.${index}.quantity`)} type="number" min={1} placeholder="Qty" className="h-9 text-center" />
                                        <Input {...form.register(`items.${index}.unitPrice`)} type="number" min={0} placeholder="Unit Price" className="h-9 text-right" />
                                        <Input value={(watchedItems[index].quantity * watchedItems[index].unitPrice).toLocaleString()} placeholder="Total" className="h-9 text-right bg-muted/50" readOnly />
                                        <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)}><Trash2 className="h-4 w-4 text-destructive"/></Button>
                                    </div>
                                ))}
                            </div>
                             {form.formState.errors.items?.root && <p className="text-sm font-medium text-destructive">{form.formState.errors.items.root.message}</p>}
                            <div className="flex gap-2 pt-2">
                                <TestSearchPopover tests={tests} onSelect={handleAddTest} />
                                <Button type="button" variant="outline" onClick={handleAddCustomItem}><Plus className="mr-2 h-4 w-4"/>Add Custom Item</Button>
                            </div>
                        </div>

                         <div className="flex justify-end pt-4">
                            <div className="w-64 space-y-1 text-sm">
                                <div className="flex justify-between"><span>Subtotal:</span><span>{subtotal.toLocaleString()} UGX</span></div>
                                <div className="flex justify-between"><span>VAT (18%):</span><span>{tax.toLocaleString()} UGX</span></div>
                                <div className="flex justify-between font-bold text-base border-t pt-1"><span>Total:</span><span>{total.toLocaleString()} UGX</span></div>
                            </div>
                        </div>

                        <FormField control={form.control} name="notes" render={({ field }) => (
                            <FormItem><FormLabel>Notes / Terms</FormLabel><FormControl><Textarea {...field} rows={3} placeholder="Add payment terms, delivery notes, etc." /></FormControl><FormMessage /></FormItem>
                        )}/>
                    </div>
                </ScrollArea>
                <DialogFooter className="pt-4 border-t">
                    <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
                        Cancel
                    </Button>
                    <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {quote ? "Save Changes" : "Create Quote"}
                    </Button>
                </DialogFooter>
            </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}


function TestSearchPopover({ tests, onSelect }: { tests: Test[], onSelect: (test: Test) => void }) {
    const [open, setOpen] = React.useState(false);
    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button variant="outline"><Search className="mr-2 h-4 w-4"/>Add Test from Catalog</Button>
            </PopoverTrigger>
            <PopoverContent className="w-[400px] p-0" align="start">
                <Command>
                    <CommandInput placeholder="Search for a test..."/>
                    <CommandList>
                        <CommandEmpty>No tests found.</CommandEmpty>
                        <CommandGroup>
                            {tests.map(test => (
                                <CommandItem
                                    key={test.id}
                                    value={`${test.materialTest} ${test.testCode} ${test.materialCategory}`}
                                    onSelect={() => {
                                        onSelect(test);
                                        setOpen(false);
                                    }}
                                >
                                    <div className="flex flex-col">
                                      <span className="font-medium">{test.materialTest}</span>
                                      <span className="text-xs text-muted-foreground">{test.materialCategory} | {test.testCode}</span>
                                    </div>
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )
}
