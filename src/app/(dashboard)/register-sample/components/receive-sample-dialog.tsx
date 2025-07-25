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
import { ChevronDown, Calendar as CalendarIcon, AlertCircle } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format, differenceInDays, addDays } from "date-fns";
import { FormData, Step3Data, Step4Data } from "@/types/form";

const specialCategories = ["Concrete Cubes", "Bricks", "Blocks", "Pavers", "Cylinder"];

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


type ReceiveSampleDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onFormSubmit: (data: FormData) => void;
};

const transmittalOptions = [
    { id: "email", label: "Email" },
    { id: "whatsapp", label: "Whatsapp" },
    { id: "hardcopy", label: "Hardcopy Pickup" },
]

export function ReceiveSampleDialog({ open, onOpenChange, onFormSubmit }: ReceiveSampleDialogProps) {
  const [step, setStep] = useState(1);
  const [currentDate, setCurrentDate] = useState("");
  const [currentTime, setCurrentTime] = useState("");
  const [allTests, setAllTests] = useState<Test[]>([]);
  const [materialCategories, setMaterialCategories] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [step3Data, setStep3Data] = useState<Step3Data>({});
  const [step4Data, setStep4Data] = useState<Step4Data>({});

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
    if (step === 1) {
      const isValid = await form.trigger();
      if (isValid) {
        setStep(2);
      }
      return;
    }

    if (step === 2) {
      const newStep3Data: Step3Data = {};
      selectedCategories.forEach(category => {
        newStep3Data[category] = step3Data[category] || {
          quantity: 1,
          notes: "",
          selectedTests: {},
          testQuantities: {},
        };
      });
      setStep3Data(newStep3Data);
      setStep(3);
      return;
    }

    if (step === 3) {
      const hasSpecial = selectedCategories.some(cat => specialCategories.includes(cat));
      if (hasSpecial) {
        const newStep4Data: Step4Data = { ...step4Data };
        selectedCategories.forEach(category => {
          if (specialCategories.includes(category) && !newStep4Data[category]) {
            const totalQuantity = step3Data[category]?.quantity || 1;
            newStep4Data[category] = {
              numberOfSets: 1,
              setDistribution: [totalQuantity],
              sets: Array.from({ length: 1 }).map(() => ({
                serials: Array.from({ length: totalQuantity }, (_, j) => String(j + 1)).join(', '),
                castingDate: new Date(),
                testingDate: new Date(),
                age: 0,
                areaOfUse: "",
                class: ""
              }))
            };
          }
        });
        setStep4Data(newStep4Data);
        setStep(4);
      } else {
        setStep(5); // This should be review step for non-special
      }
      return;
    }

    if (step === 4) {
      setStep(5);
      return;
    }
  };
  
  const handleBack = () => {
    const hasSpecial = selectedCategories.some(cat => specialCategories.includes(cat));
    if (step === 5 && !hasSpecial) {
      setStep(3);
    } else {
      setStep(prev => prev - 1);
    }
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category) 
        : [...prev, category]
    );
  };
  
  const handleCategoryQuantityChange = (category: string, quantity: number) => {
    setStep3Data(prev => {
        const newQuantities = { ...prev[category]?.testQuantities };
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
    setStep3Data(prev => {
        const isSelected = !prev[category].selectedTests[testId];
        const newTestQuantities = { ...prev[category].testQuantities };
        if(isSelected){
            newTestQuantities[testId] = prev[category].quantity;
        }

        return {
            ...prev,
            [category]: {
                ...prev[category],
                selectedTests: {
                    ...prev[category].selectedTests,
                    [testId]: isSelected
                },
                testQuantities: newTestQuantities,
            }
        }
    });
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
  
  // Step 4 handlers
  const handleNumberOfSetsChange = (category: string, numSets: number) => {
    const totalQuantity = step3Data[category].quantity;
    numSets = Math.max(1, numSets); // Ensure at least 1 set
    const base = Math.floor(totalQuantity / numSets);
    const remainder = totalQuantity % numSets;
    const newDistribution = Array.from({ length: numSets }, (_, i) => base + (i < remainder ? 1 : 0));
    
    setStep4Data(prev => ({
        ...prev,
        [category]: {
            ...prev[category],
            numberOfSets: numSets,
            setDistribution: newDistribution,
            sets: Array.from({ length: numSets }).map((_, i) => ({
                ...(prev[category]?.sets[i] || {}),
                serials: Array.from({ length: newDistribution[i] }, (_, j) => String(j + 1)).join(', '),
                castingDate: prev[category]?.sets[i]?.castingDate || new Date(),
                testingDate: prev[category]?.sets[i]?.testingDate || new Date(),
                age: differenceInDays(prev[category]?.sets[i]?.testingDate || new Date(), prev[category]?.sets[i]?.castingDate || new Date()),
                areaOfUse: prev[category]?.sets[i]?.areaOfUse || "",
                class: prev[category]?.sets[i]?.class || ""
            }))
        }
    }));
  };

  const handleSetDistributionChange = (category: string, setIndex: number, value: number) => {
     setStep4Data(prev => {
        const newDistribution = [...prev[category].setDistribution];
        newDistribution[setIndex] = value;
        const newSets = [...prev[category].sets];
        newSets[setIndex] = {
            ...newSets[setIndex],
            serials: Array.from({ length: value }, (_, j) => String(j + 1)).join(', '),
        };
        return {
            ...prev,
            [category]: {
                ...prev[category],
                setDistribution: newDistribution,
                sets: newSets,
            }
        };
    });
  }

  const handleSetDetailChange = (category: string, setIndex: number, field: string, value: any) => {
      setStep4Data(prev => {
        const newSets = [...prev[category].sets];
        const currentSet = { ...newSets[setIndex] };
        (currentSet as any)[field] = value;

        if (field === 'castingDate' || field === 'testingDate') {
            if(currentSet.castingDate && currentSet.testingDate) {
               currentSet.age = differenceInDays(currentSet.testingDate, currentSet.castingDate);
            }
        }
        if (field === 'age') {
            if(currentSet.castingDate && value >= 0) {
               currentSet.testingDate = addDays(currentSet.castingDate, value);
            }
        }
        
        newSets[setIndex] = currentSet;

        return { ...prev, [category]: { ...prev[category], sets: newSets } };
    });
  }


  const onSubmit = () => {
    const formData: z.infer<typeof receiveSampleSchema> = form.getValues();
    const finalData: FormData = {
      step1: {
        ...formData,
        receiptDate: currentDate,
        receiptTime: currentTime,
      },
      step2: selectedCategories,
      step3: step3Data,
      step4: step4Data,
      allTests: allTests,
    }
    onFormSubmit(finalData);
  };

  const resetForm = () => {
    form.reset();
    setStep(1);
    setSelectedCategories([]);
    setStep3Data({});
    setStep4Data({});
  }
  
  const isStep3Valid = () => {
      return selectedCategories.every(category => {
          const catData = step3Data[category];
          if(!catData) return false;
          if(catData.quantity <= 0) return false;
          
          const selectedTestsForCat = Object.keys(catData.selectedTests).filter(key => catData.selectedTests[key]);
          if(selectedTestsForCat.length === 0) return false;

          return selectedTestsForCat.every(testId => (catData.testQuantities[testId] ?? 0) > 0);
      });
  }
  
  const isStep4Valid = () => {
      return selectedCategories.filter(cat => specialCategories.includes(cat)).every(category => {
          const catData = step4Data[category];
          if (!catData) return false;
          const totalInDistribution = catData.setDistribution.reduce((a, b) => a + b, 0);
          return totalInDistribution === step3Data[category].quantity;
      });
  }

  const hasSpecialCategories = selectedCategories.some(cat => specialCategories.includes(cat));
  const numSteps = hasSpecialCategories ? 5 : 4;
  const reviewStepNumber = hasSpecialCategories ? 5 : 4;

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
        if (!isOpen) {
            resetForm();
        }
        onOpenChange(isOpen);
    }}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Receive New Sample - Step {step} of {numSteps}</DialogTitle>
          <DialogDescription>
            {step === 1 && "Enter the client and sample details below."}
            {step === 2 && "Select the material categories for testing."}
            {step === 3 && "Specify quantities and select tests."}
            {step === 4 && "Provide additional details for special samples."}
            {step === reviewStepNumber && "Review and confirm the sample registration details."}
          </DialogDescription>
        </DialogHeader>
          
            <div className="flex-grow overflow-y-auto space-y-4 p-1">
              {step === 1 && (
                <Form {...form}>
                <form className="flex-grow overflow-y-auto space-y-4 p-1">
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
                </form>
                </Form>
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
                                                            value={categoryData?.testQuantities[test.id] ?? 0}
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

              {step === 4 && hasSpecialCategories && (
                <ScrollArea className="h-96 w-full rounded-md border p-4">
                  <Accordion type="multiple" className="w-full">
                    {selectedCategories.filter(cat => specialCategories.includes(cat)).map(category => {
                      const catData = step4Data[category];
                      const totalQuantity = step3Data[category].quantity;
                      const distributionSum = catData?.setDistribution.reduce((a, b) => a + b, 0);
                      const isDistributionInvalid = distributionSum !== totalQuantity;
                      return (
                        <AccordionItem key={category} value={category} className="border-b-0 mb-2 p-2 rounded-md border">
                           <AccordionTrigger className="p-2">
                            <h3 className="text-lg font-medium">{category}</h3>
                          </AccordionTrigger>
                          <AccordionContent>
                            <div className="space-y-4 pt-2 pl-4 border-t">
                              <div className="flex items-center gap-4">
                                <Label htmlFor={`numSets-${category}`}>Number of Sets</Label>
                                <Input
                                  id={`numSets-${category}`}
                                  type="number"
                                  min={1}
                                  value={catData?.numberOfSets || 1}
                                  onChange={(e) => handleNumberOfSetsChange(category, parseInt(e.target.value, 10))}
                                  className="w-24"
                                />
                              </div>
                              <div>
                                <Label>Set Distribution</Label>
                                <div className="flex items-center gap-2 mt-1">
                                  {catData?.setDistribution.map((dist, i) => (
                                      <Input key={i} type="number" value={dist} onChange={(e) => handleSetDistributionChange(category, i, parseInt(e.target.value))} className="w-20" />
                                  ))}
                                  {isDistributionInvalid && <span className="text-destructive text-xs flex items-center gap-1"><AlertCircle className="w-4 h-4" /> Mismatch</span>}
                                </div>
                                 <p className="text-xs text-muted-foreground mt-1">Total must be {totalQuantity}</p>
                              </div>
                              <Separator />
                              {catData?.sets.map((set, setIndex) => (
                                <div key={setIndex} className="p-2 border rounded-md space-y-3">
                                   <div className="flex justify-between items-center">
                                     <h4 className="font-semibold">Set {setIndex + 1}</h4>
                                     {step3Data[category].selectedTests['Water Absorption'] && <span className="text-xs font-bold text-blue-600">(For Water Absorption)</span>}
                                   </div>
                                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                       <FormItem>
                                            <Label>Casting Date</Label>
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                <Button variant={"outline"} className={cn("w-full justify-start text-left font-normal", !set.castingDate && "text-muted-foreground")}>
                                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                                    {set.castingDate ? format(set.castingDate, "PPP") : <span>Pick a date</span>}
                                                </Button>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-auto p-0">
                                                    <Calendar mode="single" selected={set.castingDate} onSelect={(date) => handleSetDetailChange(category, setIndex, 'castingDate', date)} initialFocus />
                                                </PopoverContent>
                                            </Popover>
                                        </FormItem>
                                         <FormItem>
                                            <Label>Testing Date</Label>
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                <Button variant={"outline"} className={cn("w-full justify-start text-left font-normal", !set.testingDate && "text-muted-foreground")}>
                                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                                    {set.testingDate ? format(set.testingDate, "PPP") : <span>Pick a date</span>}
                                                </Button>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-auto p-0">
                                                    <Calendar mode="single" selected={set.testingDate} onSelect={(date) => handleSetDetailChange(category, setIndex, 'testingDate', date)} initialFocus />
                                                </PopoverContent>
                                            </Popover>
                                        </FormItem>
                                   </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <FormItem>
                                            <Label>Age (days)</Label>
                                            <Input type="number" value={set.age} onChange={(e) => handleSetDetailChange(category, setIndex, 'age', parseInt(e.target.value))} />
                                        </FormItem>
                                        <FormItem>
                                            <Label>Area of Use</Label>
                                            <Input value={set.areaOfUse} onChange={(e) => handleSetDetailChange(category, setIndex, 'areaOfUse', e.target.value)} />
                                        </FormItem>
                                    </div>
                                    {category === 'Concrete Cubes' && (
                                         <FormItem>
                                            <Label>Class</Label>
                                            <Input value={set.class} onChange={(e) => handleSetDetailChange(category, setIndex, 'class', e.target.value)} />
                                        </FormItem>
                                    )}
                                    <FormItem>
                                        <Label>Sample IDs</Label>
                                        <Textarea value={set.serials} onChange={(e) => handleSetDetailChange(category, setIndex, 'serials', e.target.value)} rows={2} />
                                    </FormItem>
                                </div>
                              ))}
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      )
                    })}
                  </Accordion>
                </ScrollArea>
              )}
                
              {step === reviewStepNumber && (
                 <ScrollArea className="h-96 w-full rounded-md border p-4">
                    <div className="space-y-6">
                        <div>
                            <h3 className="text-lg font-bold mb-2">Client and Sample Details</h3>
                             <div className="text-sm space-y-1">
                                <p><strong>Client Name:</strong> {form.getValues('clientName')}</p>
                                <p><strong>Project Title:</strong> {form.getValues('projectTitle')}</p>
                                <p><strong>Date of Receipt:</strong> {currentDate} at {currentTime}</p>
                                <p><strong>Delivered By:</strong> {form.getValues('deliveredBy')} ({form.getValues('deliveryContact')})</p>
                             </div>
                        </div>
                        <Separator />
                         <div>
                            <h3 className="text-lg font-bold mb-2">Selected Tests & Quantities</h3>
                            {selectedCategories.map(category => (
                                <div key={category} className="mb-4">
                                    <h4 className="font-semibold">{category} (Total: {step3Data[category].quantity})</h4>
                                    <ul className="list-disc pl-5 text-sm">
                                        {Object.keys(step3Data[category].selectedTests).filter(t => step3Data[category].selectedTests[t]).map(testId => {
                                            const test = allTests.find(t => t.id === testId);
                                            return <li key={testId}>{test?.materialTest} (Qty: {step3Data[category].testQuantities[testId]}) - <span className="text-muted-foreground">{test?.testMethods}</span></li>
                                        })}
                                    </ul>
                                    {step3Data[category].notes && <p className="text-xs italic mt-1">Notes: {step3Data[category].notes}</p>}
                                </div>
                            ))}
                        </div>
                        {hasSpecialCategories && <Separator />}
                        {hasSpecialCategories && (
                             <div>
                                <h3 className="text-lg font-bold mb-2">Special Sample Details</h3>
                                {selectedCategories.filter(cat => specialCategories.includes(cat)).map(category => (
                                    <div key={category} className="mb-4">
                                        <h4 className="font-semibold">{category}</h4>
                                        {step4Data[category]?.sets.map((set, setIndex) => (
                                            <div key={setIndex} className="text-sm space-y-1 pl-4 mt-2">
                                                <p><strong>Set {setIndex + 1}:</strong> {step4Data[category].setDistribution[setIndex]} samples</p>
                                                <p>Casting: {format(set.castingDate, "PPP")}, Testing: {format(set.testingDate, "PPP")}, Age: {set.age} days</p>
                                            </div>
                                        ))}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </ScrollArea>
              )}


              </div>
              <DialogFooter className="pt-4">
                  {step > 1 && <Button type="button" variant="ghost" onClick={handleBack}>Back</Button>}
                  
                  {step < reviewStepNumber && (
                      <Button 
                        type="button" 
                        onClick={handleNext} 
                        className="ml-auto" 
                        disabled={
                            (step === 2 && selectedCategories.length === 0) ||
                            (step === 3 && !isStep3Valid()) ||
                            (step === 4 && !isStep4Valid())
                        }
                      >
                        Next
                      </Button>
                  )}
                  
                  {step === reviewStepNumber && (
                       <Button type="button" onClick={onSubmit} className="ml-auto">
                        Confirm & Generate Receipt
                      </Button>
                  )}
                  
                   <Button type="button" variant="destructive" onClick={() => onOpenChange(false)} className={step === 1 ? "ml-auto" : ""}>Cancel</Button>
              </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
