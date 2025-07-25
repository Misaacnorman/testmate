"use client";

import { useState, useEffect } from "react";
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
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Textarea } from "@/components/ui/textarea";
import { ChevronDown } from "lucide-react";
import { Label } from "@/components/ui/label";

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
}).refine(data => {
    if (data.sameForBilling === 'no') {
        return !!data.billedClientName && !!data.billedClientAddress && !!data.billedClientContact;
    }
    return true;
}, {
    message: "Billed client details are required when billing is different.",
    path: ["billedClientName"],
});

type Step3Data = {
  [category: string]: {
    quantity: number;
    notes: string;
    selectedTests: { [testId: string]: boolean };
    testQuantities: { [testId: string]: number };
  }
}

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
  const [allTests, setAllTests] = useState<Test[]>([]);
  const [materialCategories, setMaterialCategories] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [step3Data, setStep3Data] = useState<Step3Data>({});

  useEffect(() => {
    const now = new Date();
    setCurrentDate(now.toLocaleDateString());
    setCurrentTime(now.toLocaleTimeString());
  }, []);
  
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
    },
  });
  
  useEffect(() => {
    if (open && allTests.length === 0) {
      const fetchTestsAndCategories = async () => {
        setIsLoading(true);
        try {
          const tests = await getTests();
          setAllTests(tests);
          const uniqueCategories = [...new Set(tests.map(test => test.materialCategory))];
          setMaterialCategories(uniqueCategories);
        } catch (error) {
          console.error("Failed to fetch tests and categories", error);
        } finally {
          setIsLoading(false);
        }
      };
      fetchTestsAndCategories();
    }
  }, [open, allTests.length]);
  
  const watchSameForBilling = form.watch("sameForBilling");
  const watchResultTransmittal = form.watch("resultTransmittal");

  const handleNext = async () => {
    let isValid = true;
    if (step === 1) {
        isValid = await form.trigger();
    }
    
    if (isValid) {
        if (step === 2) {
            // Initialize step 3 data for selected categories
            const newStep3Data: Step3Data = {};
            for (const category of selectedCategories) {
                newStep3Data[category] = step3Data[category] || {
                    quantity: 1,
                    notes: "",
                    selectedTests: {},
                    testQuantities: {},
                };
            }
            setStep3Data(newStep3Data);
        }
        setStep(prev => prev + 1);
    }
  }
  
  const handleBack = () => {
    setStep(prev => prev - 1);
  }

  const handleCategoryChange = (category: string) => {
    setSelectedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category) 
        : [...prev, category]
    );
  };
  
  const handleCategoryQuantityChange = (category: string, quantity: number) => {
    setStep3Data(prev => {
        const newQuantities = { ...prev[category].testQuantities };
        // Update child quantities if they are now greater than the new parent quantity
        for (const testId in newQuantities) {
            if (newQuantities[testId] > quantity) {
                newQuantities[testId] = quantity;
            }
        }
        return {
            ...prev,
            [category]: {
                ...prev[category],
                quantity,
                testQuantities: newQuantities,
            },
        };
    });
  };

  const handleTestSelectionChange = (category: string, testId: string) => {
    setStep3Data(prev => ({
        ...prev,
        [category]: {
            ...prev[category],
            selectedTests: {
                ...prev[category].selectedTests,
                [testId]: !prev[category].selectedTests[testId]
            }
        }
    }));
  };
  
  const handleTestQuantityChange = (category: string, testId: string, quantity: number) => {
    const parentQuantity = step3Data[category].quantity;
    const newQuantity = Math.min(quantity, parentQuantity); // Enforce max quantity
    setStep3Data(prev => ({
        ...prev,
        [category]: {
            ...prev[category],
            testQuantities: {
                ...prev[category].testQuantities,
                [testId]: newQuantity >= 0 ? newQuantity : 0
            }
        }
    }));
  };

  const handleNotesChange = (category: string, notes: string) => {
    setStep3Data(prev => ({
        ...prev,
        [category]: {
            ...prev[category],
            notes
        }
    }));
  };

  const onSubmit = (values: z.infer<typeof receiveSampleSchema>) => {
    // This will eventually go to step 4, for now we log
    const finalData = {
      step1: values,
      step2: selectedCategories,
      step3: step3Data,
    }
    console.log(finalData);
    // onOpenChange(false);
  };

  const resetForm = () => {
    form.reset();
    setStep(1);
    setSelectedCategories([]);
    setStep3Data({});
  }
  
  const isStep3Valid = () => {
      return selectedCategories.every(category => {
          const catData = step3Data[category];
          return catData && catData.quantity > 0;
      });
  }

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
        if (!isOpen) {
            resetForm();
        }
        onOpenChange(isOpen);
    }}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Receive New Sample - Step {step} of 4</DialogTitle>
          <DialogDescription>
            {step === 1 && "Enter the client and sample details below."}
            {step === 2 && "Select the material categories for testing."}
            {step === 3 && "Specify quantities and select tests."}
          </DialogDescription>
        </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex-grow overflow-y-auto space-y-4 p-1">
              {step === 1 && (
                <>
                  <div className="space-y-3">
                      <h3 className="text-lg font-medium">Client Details</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
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
                          <FormItem className="space-y-2">
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
                          <div className="space-y-3 p-3 border rounded-md bg-muted/50">
                              <h4 className="font-medium">Billed Client Details</h4>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
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

                  <div className="space-y-3">
                      <h3 className="text-lg font-medium">Sample Details</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <FormField control={form.control} name="projectTitle" render={({ field }) => (
                              <FormItem><FormLabel>Project Title</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                          )} />
                          <FormField control={form.control} name="sampleStatus" render={({ field }) => (
                              <FormItem><FormLabel>Status of the Sample</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                          )} />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                          <FormItem><FormLabel>Date of Receipt</FormLabel><Input disabled value={currentDate} /></FormItem>
                          <FormItem><FormLabel>Time of Receipt</FormLabel><Input disabled value={currentTime} /></FormItem>
                          <FormItem><FormLabel>Received By</FormLabel><Input disabled value="Admin" /></FormItem>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
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
                              <div className="mb-2"><FormLabel className="text-base">Mode of Results Transmittal</FormLabel></div>
                              <div className="flex flex-wrap gap-4">
                                  {transmittalOptions.map((item) => (
                                  <FormField key={item.id} control={form.control} name="resultTransmittal" render={({ field }) => (
                                      <FormItem key={item.id} className="flex flex-row items-start space-x-3 space-y-0">
                                          <FormControl>
                                              <Checkbox
                                              checked={field.value?.includes(item.id)}
                                              onCheckedChange={(checked) => checked
                                                  ? field.onChange([...(field.value || []), item.id])
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
                          <div className="space-y-3 p-3 border rounded-md bg-muted/50">
                              {watchResultTransmittal.includes('email') && <FormField control={form.control} name="transmittalEmail" render={({ field }) => (
                                  <FormItem><FormLabel>Email for Results</FormLabel><FormControl><Input type="email" placeholder="example@test.com" {...field} /></FormControl><FormMessage /></FormItem>
                              )} />}
                              {watchResultTransmittal.includes('whatsapp') && <FormField control={form.control} name="transmittalWhatsapp" render={({ field }) => (
                                  <FormItem><FormLabel>Whatsapp Number for Results</FormLabel><FormControl><Input placeholder="+256 123 456789" {...field} /></FormControl><FormMessage /></FormItem>
                              )} />}
                          </div>
                      )}
                  </div>
                </>
              )}

              {step === 2 && (
                <ScrollArea className="h-96 w-full rounded-md border p-4">
                    <div className="space-y-2">
                        <h3 className="text-lg font-medium">Material Categories</h3>
                        {isLoading ? (
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
                          {!isLoading && materialCategories.length === 0 && (
                            <p className="text-sm text-muted-foreground">No material categories found. Please add tests to the system first.</p>
                        )}
                    </div>
                </ScrollArea>
              )}
              
              {step === 3 && (
                <ScrollArea className="h-96 w-full rounded-md border p-4">
                    <Accordion type="multiple" className="w-full">
                        {selectedCategories.map((category) => {
                            const categoryTests = allTests.filter(t => t.materialCategory === category);
                            const categoryData = step3Data[category];
                            return (
                                <AccordionItem key={category} value={category} className="border-b-0 mb-2 p-2 rounded-md border">
                                    <div className="flex items-center justify-between p-2 rounded-md">
                                      <h3 className="text-lg font-medium">{category}</h3>
                                      <div className="flex items-center gap-2">
                                          <Label htmlFor={`quantity-${category}`}>Quantity</Label>
                                          <Input
                                              id={`quantity-${category}`}
                                              type="number"
                                              min={1}
                                              value={categoryData?.quantity || 1}
                                              onChange={(e) => handleCategoryQuantityChange(category, parseInt(e.target.value, 10))}
                                              className="w-24"
                                          />
                                          <AccordionTrigger />
                                      </div>
                                    </div>
                                    <AccordionContent>
                                        <div className="space-y-2 pl-4 pt-2 border-t mt-2">
                                            <h4 className="font-semibold">Available Tests</h4>
                                            {categoryTests.map((test) => (
                                                <div key={test.id} className="flex items-center gap-2">
                                                    <Checkbox
                                                        id={test.id}
                                                        checked={!!categoryData?.selectedTests[test.id]}
                                                        onCheckedChange={() => handleTestSelectionChange(category, test.id)}
                                                    />
                                                    <Label htmlFor={test.id} className="flex-grow">{test.materialTest}</Label>
                                                    <div className="flex items-center gap-2">
                                                        <Label htmlFor={`quantity-${test.id}`} className="text-xs">Qty</Label>
                                                        <Input
                                                            id={`quantity-${test.id}`}
                                                            type="number"
                                                            min={0}
                                                            max={categoryData?.quantity}
                                                            value={categoryData?.testQuantities[test.id] ?? categoryData?.quantity}
                                                            onChange={(e) => handleTestQuantityChange(category, test.id, parseInt(e.target.value, 10))}
                                                            className="w-20 h-8"
                                                            disabled={!categoryData?.selectedTests[test.id]}
                                                        />
                                                    </div>
                                                </div>
                                            ))}
                                            <Collapsible className="space-y-2 pt-2">
                                                <CollapsibleTrigger asChild>
                                                    <Button variant="ghost" size="sm" className="flex items-center gap-1 text-xs">
                                                        <ChevronDown className="w-3 h-3" />
                                                        Notes
                                                    </Button>
                                                </CollapsibleTrigger>
                                                <CollapsibleContent>
                                                    <Textarea
                                                        placeholder="Add any notes for this material category..."
                                                        value={categoryData?.notes || ""}
                                                        onChange={(e) => handleNotesChange(category, e.target.value)}
                                                        rows={2}
                                                    />
                                                </CollapsibleContent>
                                            </Collapsible>
                                        </div>
                                    </AccordionContent>
                                </AccordionItem>
                            )
                        })}
                    </Accordion>
                </ScrollArea>
              )}
                
              <DialogFooter className="pt-4">
                  {step > 1 && <Button type="button" variant="ghost" onClick={handleBack}>Back</Button>}
                  
                  {step < 3 ? (
                      <Button type="button" onClick={handleNext} className="ml-auto" disabled={step === 2 && selectedCategories.length === 0}>Next</Button>
                  ) : (
                      <Button type="button" className="ml-auto" onClick={() => console.log("To Step 4")} disabled={!isStep3Valid()}>Next</Button>
                  )}
                   <Button type="button" variant="destructive" onClick={() => onOpenChange(false)} className={step === 1 ? "ml-auto" : ""}>Cancel</Button>
              </DialogFooter>
            </form>
          </Form>
      </DialogContent>
    </Dialog>
  );
}
