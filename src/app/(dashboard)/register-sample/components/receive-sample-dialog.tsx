"use client";

import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { getTests } from "@/services/tests";
import { Test } from "@/types/test";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";

const receiveSampleSchema = z.object({
  clientName: z.string().min(1, "Client name is required."),
  clientAddress: z.string().min(1, "Client address is required."),
  clientContact: z.string().min(1, "Client contact is required."),
  sameForBilling: z.enum(["yes", "no"]),
  billedClientName: z.string().optional(),
  billedClientAddress: z.string().optional(),
  billedClientContact: z.string().optional(),
  projectTitle: z.string().min(1, "Project title is required."),
  sampleStatus: z.string().min(1, "Sample status is required."),
  deliveredBy: z.string().min(1, "Delivered by is required."),
  deliveryContact: z.string().min(1, "Contact of delivery person is required."),
  resultTransmittal: z.array(z.string()).refine((value) => value.some((item) => item), {
    message: "You have to select at least one item.",
  }),
  transmittalEmail: z.string().optional(),
  transmittalWhatsapp: z.string().optional(),
  selectedCategories: z.array(z.string()).optional(),
}).refine(data => {
    if (data.sameForBilling === 'no') {
        return data.billedClientName && data.billedClientAddress && data.billedClientContact;
    }
    return true;
}, {
    message: "Billed client details are required when billing is different.",
    path: ["billedClientName"],
});


type ReceiveSampleDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const transmittalOptions = [
    { id: "email", label: "Email" },
    { id: "whatsapp", label: "Whatsapp" },
    { id: "hardcopy", label: "Hardcopy Pickup" },
]

export function ReceiveSampleDialog({ open, onOpenChange }: ReceiveSampleDialogProps) {
  const [step, setStep] = useState(1);
  const [currentDate, setCurrentDate] = useState("");
  const [currentTime, setCurrentTime] = useState("");
  const [materialCategories, setMaterialCategories] = useState<string[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  useEffect(() => {
    const now = new Date();
    setCurrentDate(now.toLocaleDateString());
    setCurrentTime(now.toLocaleTimeString());
  }, []);

  useEffect(() => {
    if (step === 2 && materialCategories.length === 0) {
      const fetchCategories = async () => {
        setIsLoadingCategories(true);
        try {
          const tests = await getTests();
          const uniqueCategories = [...new Set(tests.map(test => test.materialCategory))];
          setMaterialCategories(uniqueCategories);
        } catch (error) {
          console.error("Failed to fetch material categories", error);
        } finally {
          setIsLoadingCategories(false);
        }
      };
      fetchCategories();
    }
  }, [step, materialCategories.length]);


  const form = useForm<z.infer<typeof receiveSampleSchema>>({
    resolver: zodResolver(receiveSampleSchema),
    defaultValues: {
      clientName: "",
      clientAddress: "",
      clientContact: "",
      sameForBilling: "yes",
      projectTitle: "",
      sampleStatus: "",
      deliveredBy: "",
      deliveryContact: "",
      resultTransmittal: [],
      transmittalEmail: "",
      transmittalWhatsapp: "",
      selectedCategories: [],
    },
  });

  const watchSameForBilling = form.watch("sameForBilling");
  const watchResultTransmittal = form.watch("resultTransmittal");

  const handleNext = () => {
    setStep(2);
  }
  
  const handleBack = () => {
    setStep(1);
  }

  const handleCategoryChange = (category: string) => {
    setSelectedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category) 
        : [...prev, category]
    );
  };

  const onSubmit = (values: z.infer<typeof receiveSampleSchema>) => {
    const finalValues = { ...values, selectedCategories };
    console.log(finalValues);
    // onOpenChange(false);
    // form.reset();
    // setStep(1);
    // setSelectedCategories([]);
    // This will be the final submission logic for step 3
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
        if (!isOpen) {
            form.reset();
            setStep(1);
            setSelectedCategories([]);
        }
        onOpenChange(isOpen);
    }}>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Receive New Sample - Step {step} of 3</DialogTitle>
          <DialogDescription>
            {step === 1 && "Enter the client and sample details below."}
            {step === 2 && "Select the material categories for testing."}
          </DialogDescription>
        </DialogHeader>

        {step === 1 && (
            <Form {...form}>
                <form onSubmit={form.handleSubmit(handleNext)} className="flex-grow overflow-y-auto space-y-6 p-1">
                    <div className="space-y-4">
                        <h3 className="text-lg font-medium">Client Details</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField control={form.control} name="clientName" render={({ field }) => (
                                <FormItem><FormLabel>Client Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                            <FormField control={form.control} name="clientContact" render={({ field }) => (
                                <FormItem><FormLabel>Client Contact</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                        </div>
                        <FormField control={form.control} name="clientAddress" render={({ field }) => (
                            <FormItem><FormLabel>Client Address</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                    
                        <Separator />

                        <FormField control={form.control} name="sameForBilling" render={({ field }) => (
                            <FormItem className="space-y-3">
                            <FormLabel>Is the client name same for Billing?</FormLabel>
                            <FormControl>
                                <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex items-center space-x-4">
                                <FormItem className="flex items-center space-x-2 space-y-0"><FormControl><RadioGroupItem value="yes" /></FormControl><FormLabel className="font-normal">Yes</FormLabel></FormItem>
                                <FormItem className="flex items-center space-x-2 space-y-0"><FormControl><RadioGroupItem value="no" /></FormControl><FormLabel className="font-normal">No</FormLabel></FormItem>
                                </RadioGroup>
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )} />

                        {watchSameForBilling === 'no' && (
                            <div className="space-y-4 p-4 border rounded-md bg-muted/50">
                                <h4 className="font-medium">Billed Client Details</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <FormField control={form.control} name="billedClientName" render={({ field }) => (
                                        <FormItem><FormLabel>Billed Client Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                                    )} />
                                    <FormField control={form.control} name="billedClientContact" render={({ field }) => (
                                        <FormItem><FormLabel>Billed Client Contact</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                                    )} />
                                </div>
                                <FormField control={form.control} name="billedClientAddress" render={({ field }) => (
                                    <FormItem><FormLabel>Billed Client Address</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                                )} />
                            </div>
                        )}
                    </div>
                    
                    <Separator />

                    <div className="space-y-4">
                        <h3 className="text-lg font-medium">Sample Details</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField control={form.control} name="projectTitle" render={({ field }) => (
                                <FormItem><FormLabel>Project Title</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                            <FormField control={form.control} name="sampleStatus" render={({ field }) => (
                                <FormItem><FormLabel>Status of the Sample</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <FormItem><FormLabel>Date of Receipt</FormLabel><Input disabled value={currentDate} /></FormItem>
                            <FormItem><FormLabel>Time of Receipt</FormLabel><Input disabled value={currentTime} /></FormItem>
                            <FormItem><FormLabel>Received By</FormLabel><Input disabled value="Admin" /></FormItem>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField control={form.control} name="deliveredBy" render={({ field }) => (
                                <FormItem><FormLabel>Delivered by</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                            <FormField control={form.control} name="deliveryContact" render={({ field }) => (
                                <FormItem><FormLabel>Contact of Delivery Person</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                        </div>
                        <Separator />
                        <FormField control={form.control} name="resultTransmittal" render={() => (
                            <FormItem>
                                <div className="mb-4"><FormLabel className="text-base">Mode of Results Transmittal</FormLabel></div>
                                <div className="flex flex-wrap gap-4">
                                    {transmittalOptions.map((item) => (
                                    <FormField key={item.id} control={form.control} name="resultTransmittal" render={({ field }) => (
                                        <FormItem key={item.id} className="flex flex-row items-start space-x-3 space-y-0">
                                            <FormControl>
                                                <Checkbox
                                                checked={field.value?.includes(item.id)}
                                                onCheckedChange={(checked) => checked
                                                    ? field.onChange([...field.value, item.id])
                                                    : field.onChange(field.value?.filter((value) => value !== item.id))
                                                }
                                                />
                                            </FormControl>
                                            <FormLabel className="font-normal">{item.label}</FormLabel>
                                        </FormItem>
                                    )} />
                                    ))}
                                </div>
                                <FormMessage />
                            </FormItem>
                        )} />
                        {(watchResultTransmittal.includes('email') || watchResultTransmittal.includes('whatsapp')) && (
                            <div className="space-y-4 p-4 border rounded-md bg-muted/50">
                                {watchResultTransmittal.includes('email') && <FormField control={form.control} name="transmittalEmail" render={({ field }) => (
                                    <FormItem><FormLabel>Email for Results</FormLabel><FormControl><Input type="email" placeholder="example@test.com" {...field} /></FormControl><FormMessage /></FormItem>
                                )} />}
                                {watchResultTransmittal.includes('whatsapp') && <FormField control={form.control} name="transmittalWhatsapp" render={({ field }) => (
                                    <FormItem><FormLabel>Whatsapp Number for Results</FormLabel><FormControl><Input placeholder="+256 123 456789" {...field} /></FormControl><FormMessage /></FormItem>
                                )} />}
                            </div>
                        )}
                    </div>
                    
                    <DialogFooter className="pt-4">
                        <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
                        <Button type="submit" className="ml-auto">Next</Button>
                    </DialogFooter>
                </form>
            </Form>
        )}

        {step === 2 && (
            <div className="flex-grow overflow-y-auto space-y-6 p-1">
                <ScrollArea className="h-72 w-full rounded-md border p-4">
                    <div className="space-y-4">
                        <h3 className="text-lg font-medium">Material Categories</h3>
                        {isLoadingCategories ? (
                            <div className="space-y-2">
                                <Skeleton className="h-6 w-1/2" />
                                <Skeleton className="h-6 w-2/3" />
                                <Skeleton className="h-6 w-1/2" />
                            </div>
                        ) : (
                            materialCategories.map((category) => (
                                <div key={category} className="flex items-center space-x-2">
                                    <Checkbox
                                        id={category}
                                        checked={selectedCategories.includes(category)}
                                        onCheckedChange={() => handleCategoryChange(category)}
                                    />
                                    <label htmlFor={category} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                        {category}
                                    </label>
                                </div>
                            ))
                        )}
                         {!isLoadingCategories && materialCategories.length === 0 && (
                            <p className="text-sm text-muted-foreground">No material categories found. Please add tests to the system first.</p>
                        )}
                    </div>
                </ScrollArea>
                 <DialogFooter className="pt-4">
                    <Button type="button" variant="ghost" onClick={handleBack}>Back</Button>
                    <Button type="button" className="ml-auto" onClick={() => console.log('Next step logic here')}>Next</Button>
                </DialogFooter>
            </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

    