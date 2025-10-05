
"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { addDays, differenceInDays, format, isValid, isAfter, startOfToday } from "date-fns";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Loader2 } from "lucide-react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { type Test } from "@/lib/types";
import { ScrollArea } from "@/components/ui/scroll-area";
import { DatePicker } from "./date-picker";
import { SelectWithOther } from "./select-with-other";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/context/auth-context";

const SPECIAL_CATEGORIES = ["Concrete", "Bricks", "Blocks", "Pavers", "Cylinder", "Water Absorption"];

const formSchema = z.object({
    clientName: z.string().min(1, "Client name is required."),
    clientContact: z.string().min(1, "Client contact is required."),
    projectTitle: z.string().min(1, "Project title is required."),
    deliveryMode: z.enum(["deliveredBy", "pickedBy"]).default("deliveredBy"),
    deliveryPerson: z.string().optional(),
    clientAddress: z.string().min(1, "Client address is required."),
    isBillingClientSame: z.enum(["yes", "no"]),
    billingClientName: z.string().optional(),
    receivedBy: z.string(),
    delivererContact: z.string().min(1, "This field is required."),
    transmittalModes: z.object({
        email: z.boolean(),
        whatsapp: z.boolean(),
        hardcopy: z.boolean(),
    }).refine(data => data.email || data.whatsapp || data.hardcopy, {
        message: "At least one transmittal mode must be selected.",
        path: ["hardcopy"], // Show error under the last checkbox
    }),
    transmittalEmail: z.string().optional(),
    transmittalWhatsapp: z.string().optional(),
}).refine(data => data.deliveryMode === 'pickedBy' || (data.deliveryMode === 'deliveredBy' && data.deliveryPerson), {
    message: "Deliverer's name is required.",
    path: ["deliveryPerson"],
}).refine(data => data.isBillingClientSame === 'yes' || (data.isBillingClientSame === 'no' && data.billingClientName), {
    message: "Billing client name is required.",
    path: ["billingClientName"],
}).refine(data => !data.transmittalModes.email || (data.transmittalModes.email && data.transmittalEmail), {
    message: "Email is required.",
    path: ["transmittalEmail"],
}).refine(data => !data.transmittalModes.whatsapp || (data.transmittalModes.whatsapp && data.transmittalWhatsapp), {
    message: "WhatsApp number is required.",
    path: ["transmittalWhatsapp"],
});

export type FormData = z.infer<typeof formSchema>;

export interface SelectedTest extends Test {
    quantity: number;
}

export interface SelectedCategory {
    categoryName: string;
    quantity: number;
    notes: string;
    details: string;
    tests: Record<string, SelectedTest>;
}

export interface Step4Set {
  id: number;
  sampleCount: number;
  castingDate?: Date;
  testingDate?: Date;
  age?: string | number;
  class?: string;
  customClass?: string;
  areaOfUse?: string;
  paverType?: string;
  customPaverType?: string;
  paversPerSquareMetre?: number;
  paverThickness?: string;
  sampleType?: string;
  customSampleType?: string;
  sampleIds: string[];
}

export interface Step4Test {
  testId: string;
  testName: string;
  totalSampleCount: number;
  sets: Step4Set[];
}

export interface Step4Category {
  categoryName: string;
  tests: Record<string, Step4Test>;
}

export type Step4Data = Record<string, Step4Category>;

interface ReceiveSampleDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onFinish: (
    formData: FormData,
    selectedCategories: Record<string, SelectedCategory>,
    step4Data: Step4Data
  ) => void;
  isSubmitting: boolean;
}

export function ReceiveSampleDialog({
  isOpen,
  onClose,
  onFinish,
  isSubmitting,
}: ReceiveSampleDialogProps) {
  const [step, setStep] = React.useState(1);
  const [allTests, setAllTests] = React.useState<Test[]>([]);
  const [materialCategories, setMaterialCategories] = React.useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = React.useState<Record<string, SelectedCategory>>({});
  const [step4Data, setStep4Data] = React.useState<Record<string, Step4Category>>({});
  const [loading, setLoading] = React.useState(false);
  const [isCloseConfirmOpen, setIsCloseConfirmOpen] = React.useState(false);
  const [hasSpecialCategories, setHasSpecialCategories] = React.useState(false);
  const { user } = useAuth();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
        clientName: "",
        clientContact: "",
        projectTitle: "",
        deliveryMode: "deliveredBy",
        deliveryPerson: "",
        clientAddress: "",
        isBillingClientSame: "yes",
        billingClientName: "",
        receivedBy: user?.name || "",
        delivererContact: "",
        transmittalModes: { email: false, whatsapp: false, hardcopy: false },
        transmittalEmail: "",
        transmittalWhatsapp: "",
    },
  });

  const { formState: { isDirty } } = form;
  const watchedFormData = form.watch();

   React.useEffect(() => {
    if (user?.name) {
      form.reset({
        ...form.getValues(),
        receivedBy: user.name,
      });
    }
  }, [user, form]);

  React.useEffect(() => {
    if (isOpen) {
      const fetchTestsAndCategories = async () => {
        setLoading(true);
        try {
          const querySnapshot = await getDocs(collection(db, "tests"));
          const tests = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Test));
          setAllTests(tests);
          const categories = new Set<string>();
          tests.forEach((test) => {
            if (test.materialCategory) {
              categories.add(test.materialCategory);
            }
          });
          setMaterialCategories(Array.from(categories));
        } catch (error) {
          console.error("Error fetching tests and categories:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchTestsAndCategories();
    }
  }, [isOpen]);
  
  const handleCategorySelectionChange = (category: string) => {
    const newSelection = { ...selectedCategories };
    if (newSelection[category]) {
      delete newSelection[category];
    } else {
      newSelection[category] = {
        categoryName: category,
        quantity: 1,
        notes: '',
        details: '',
        tests: {},
      };
    }
    setSelectedCategories(newSelection);
  };

  const handleCategoryDetailsChange = (
    categoryName: string,
    field: keyof Omit<SelectedCategory, 'categoryName' | 'tests'>,
    value: string | number
  ) => {
    const updatedCategories = { ...selectedCategories };
    if (updatedCategories[categoryName]) {
      (updatedCategories[categoryName] as any)[field] = value;
      if (field === 'quantity') {
        const newQuantity = Number(value);
        Object.keys(updatedCategories[categoryName].tests).forEach(testId => {
          updatedCategories[categoryName].tests[testId].quantity = newQuantity;
        });
      }
      setSelectedCategories(updatedCategories);
    }
  };

  const handleTestSelectionChange = (categoryName: string, test: Test) => {
    const updatedCategories = { ...selectedCategories };
    const category = updatedCategories[categoryName];
    if (category) {
      if (category.tests[test.id!]) {
        delete category.tests[test.id!];
      } else {
        category.tests[test.id!] = {
          ...test,
          quantity: category.quantity,
        };
      }
      setSelectedCategories(updatedCategories);
    }
  };
  
  const handleTestQuantityChange = (categoryName: string, testId: string, quantity: number) => {
    const updatedCategories = { ...selectedCategories };
    const category = updatedCategories[categoryName];
    if (category && category.tests[testId]) {
      const newQuantity = Math.min(quantity, category.quantity);
      category.tests[testId].quantity = newQuantity;
      setSelectedCategories(updatedCategories);
    }
  };

  const initializeStep4Data = () => {
    const data: Record<string, Step4Category> = {};
    let specialCategoryFound = false;
    const lowercasedSpecialCategories = SPECIAL_CATEGORIES.map(c => c.toLowerCase());

    Object.values(selectedCategories).forEach(cat => {
        const specialTests = Object.values(cat.tests).filter(test => 
            test.materialCategory && lowercasedSpecialCategories.includes(test.materialCategory.toLowerCase())
        );

        if (specialTests.length > 0) {
            specialCategoryFound = true;
            data[cat.categoryName] = {
                categoryName: cat.categoryName,
                tests: {}
            };
            specialTests.forEach(test => {
                const totalSampleCount = test.quantity;
                data[cat.categoryName].tests[test.id!] = {
                    testId: test.id!,
                    testName: test.materialTest!,
                    totalSampleCount,
                    sets: [{
                        id: 1,
                        sampleCount: totalSampleCount,
                        testingDate: new Date(),
                        sampleIds: Array.from({ length: totalSampleCount }, (_, i) => `${i + 1}`),
                    }]
                };
            });
        }
    });

    setStep4Data(data);
    setHasSpecialCategories(specialCategoryFound);
    return specialCategoryFound;
};

const handleNumberOfSetsChange = (categoryName: string, testId: string, numSets: number) => {
    setStep4Data(prevData => {
        const newData = { ...prevData };
        const test = newData[categoryName]?.tests[testId];
        if (!test || numSets < 1) return prevData;

        const totalSamples = test.totalSampleCount;
        const baseCount = Math.floor(totalSamples / numSets);
        const remainder = totalSamples % numSets;

        const newSets: Step4Set[] = [];
        let sampleIdCounter = 1;
        for (let i = 0; i < numSets; i++) {
            const sampleCount = baseCount + (i < remainder ? 1 : 0);
            newSets.push({
                ... (test.sets[i] || { id: i + 1, sampleIds: [] }),
                id: i + 1,
                sampleCount,
                testingDate: test.sets[i]?.testingDate || new Date(),
                sampleIds: Array.from({ length: sampleCount }, (_, j) => `${sampleIdCounter + j}`),
            });
            sampleIdCounter += sampleCount;
        }
        test.sets = newSets;
        return newData;
    });
};

const handleSetDistributionChange = (categoryName: string, testId: string, setIndex: number, newCount: number) => {
    setStep4Data(prevData => {
        const newData = { ...prevData };
        const test = newData[categoryName]?.tests[testId];
        if (!test) return prevData;

        const currentSet = test.sets[setIndex];
        if (!currentSet) return prevData;

        currentSet.sampleCount = newCount;
        
        const firstId = parseInt(currentSet.sampleIds[0]?.match(/\d+/)?.[0] || '1', 10);
        currentSet.sampleIds = Array.from({ length: newCount }, (_, i) => `${firstId + i}`);
        
        return newData;
    });
};


const handleSetDataChange = (
    categoryName: string,
    testId: string,
    setId: number,
    field: keyof Step4Set,
    value: any
) => {
    setStep4Data(prevData => {
        const newData = { ...prevData };
        const set = newData[categoryName]?.tests[testId]?.sets.find(s => s.id === setId);
        if (!set) return prevData;

        (set as any)[field] = value;
        
        const castingDate = set.castingDate ? new Date(set.castingDate) : null;
        let testingDate = set.testingDate ? new Date(set.testingDate) : null;

        if (field === 'castingDate' || field === 'testingDate') {
            if (castingDate && isValid(castingDate) && testingDate && isValid(testingDate)) {
                 if (isAfter(castingDate, testingDate)) {
                    testingDate = castingDate; // Ensure test date is not before cast date
                    set.testingDate = castingDate;
                 }
                set.age = differenceInDays(testingDate, castingDate);
            } else {
                set.age = "";
            }
        }
        
        if (field === 'age' && castingDate && isValid(castingDate)) {
            const newAge = Number(value);
            if (!isNaN(newAge) && newAge >= 0) {
                set.testingDate = addDays(castingDate, newAge);
            }
        }
        
        return newData;
    });
};

const handleSampleIdChange = (
  categoryName: string,
  testId: string,
  setId: number,
  sampleIndex: number,
  value: string
) => {
  setStep4Data(prevData => {
      const newData = { ...prevData };
      const set = newData[categoryName]?.tests[testId]?.sets.find(s => s.id === setId);
      if (set) {
          set.sampleIds[sampleIndex] = value;
      }
      return newData;
  });
};
  
  const handleNext = async () => {
    if (step === 1) {
        const isValid = await form.trigger();
        if(isValid) {
            setStep(2);
        }
    } else if (step === 2) {
        setStep(3);
    } else if (step === 3) {
        const specialCategoryFound = initializeStep4Data();
        if (specialCategoryFound) {
            setStep(4);
        } else {
            setStep(5);
        }
    } else if (step === 4) {
        setStep(5);
    }
  };

  const handleBack = () => {
    if(step === 5 && !hasSpecialCategories) {
        setStep(3);
    } else {
        setStep((prev) => prev - 1);
    }
  };

  const attemptClose = () => {
    if(isDirty || Object.keys(selectedCategories).length > 0) {
        setIsCloseConfirmOpen(true);
    } else {
        handleClose();
    }
  }

  const handleClose = () => {
    setStep(1);
    setSelectedCategories({});
    setStep4Data({});
    setHasSpecialCategories(false);
    form.reset();
    onClose();
  }

  const handleFinish = () => {
    onFinish(watchedFormData, selectedCategories, step4Data);
  }

  const totalSteps = 5;

  const getTransmittalModes = () => {
    const modes = [];
    if (watchedFormData.transmittalModes?.email) modes.push("Email");
    if (watchedFormData.transmittalModes?.whatsapp) modes.push("WhatsApp");
    if (watchedFormData.transmittalModes?.hardcopy) modes.push("Hardcopy");
    return modes.join(", ");
  }

  return (
    <>
    <Dialog open={isOpen} onOpenChange={(open) => { if(!open) attemptClose()}}>
      <DialogContent className="max-w-3xl h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Receive New Sample (Step {step} of {totalSteps})</DialogTitle>
          {step === 1 && <DialogDescription>Enter the client and sample details.</DialogDescription>}
          {step === 2 && <DialogDescription>Select the material categories for testing.</DialogDescription>}
          {step === 3 && <DialogDescription>Specify quantities and select tests for each category.</DialogDescription>}
          {step === 4 && <DialogDescription>Provide additional details for special samples.</DialogDescription>}
          {step === 5 && <DialogDescription>Review and confirm the sample details.</DialogDescription>}
        </DialogHeader>

        <ScrollArea className="flex-grow pr-6 -mr-6">
            <Form {...form}>
                <form>
                    {step === 1 && (
                        <>
                        <div className="grid grid-cols-2 gap-x-8 gap-y-4 py-4">
                            {/* Column 1 */}
                            <div className="space-y-4">
                                <FormField control={form.control} name="clientName" render={({ field }) => (
                                    <FormItem><FormLabel>Client Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                                )}/>
                                <FormField control={form.control} name="clientContact" render={({ field }) => (
                                    <FormItem><FormLabel>Client Contact</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                                )}/>
                                <FormField control={form.control} name="projectTitle" render={({ field }) => (
                                    <FormItem><FormLabel>Project Title</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                                )}/>
                                 <FormField control={form.control} name="clientAddress" render={({ field }) => (
                                    <FormItem><FormLabel>Client Address</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                                )}/>
                                
                                <FormField control={form.control} name="deliveryMode" render={({ field }) => (
                                    <FormItem className="space-y-3 pt-2">
                                        <FormControl>
                                            <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex items-center gap-4">
                                                <FormItem className="flex items-center space-x-2">
                                                    <FormControl><RadioGroupItem value="deliveredBy" /></FormControl>
                                                    <Label className="font-normal">Delivered by</Label>
                                                </FormItem>
                                                <FormItem className="flex items-center space-x-2">
                                                    <FormControl><RadioGroupItem value="pickedBy" /></FormControl>
                                                    <Label className="font-normal">Picked by</Label>
                                                </FormItem>
                                            </RadioGroup>
                                        </FormControl>
                                    </FormItem>
                                )}/>
                                {form.watch('deliveryMode') === 'deliveredBy' && (
                                     <FormField control={form.control} name="deliveryPerson" render={({ field }) => (
                                        <FormItem>
                                            <FormControl><Input {...field} /></FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}/>
                                )}
                            </div>
                    
                            {/* Column 2 */}
                            <div className="space-y-4">
                               <FormField control={form.control} name="isBillingClientSame" render={({ field }) => (
                                    <FormItem className="space-y-3">
                                        <FormLabel>Is the billing client the same?</FormLabel>
                                        <FormControl>
                                            <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex items-center gap-4">
                                                <FormItem className="flex items-center space-x-2">
                                                    <FormControl><RadioGroupItem value="yes" id="billing-yes" /></FormControl>
                                                    <Label htmlFor="billing-yes" className="font-normal">Yes</Label>
                                                </FormItem>
                                                <FormItem className="flex items-center space-x-2">
                                                    <FormControl><RadioGroupItem value="no" id="billing-no" /></FormControl>
                                                    <Label htmlFor="billing-no" className="font-normal">No</Label>
                                                </FormItem>
                                            </RadioGroup>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}/>
                                {form.watch('isBillingClientSame') === 'no' && (
                                    <FormField control={form.control} name="billingClientName" render={({ field }) => (
                                        <FormItem><FormLabel>Billing Client Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                                    )}/>
                                )}
                                
                                <FormField control={form.control} name="receivedBy" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{watchedFormData.deliveryMode === 'pickedBy' ? 'Picked by' : 'Received by'}</FormLabel>
                                        <FormControl><Input {...field} disabled /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}/>
                                
                                 <FormField control={form.control} name="delivererContact" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{watchedFormData.deliveryMode === 'pickedBy' ? "Sender's Contact" : "Deliverer's Contact"}</FormLabel>
                                        <FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                                )}/>
                                 {/* Transmittal Mode */}
                                <FormField control={form.control} name="transmittalModes" render={() => (
                                    <FormItem className="space-y-3">
                                        <FormLabel>Mode of Results Transmittal</FormLabel>
                                        <div className="flex items-center gap-6">
                                            <FormField control={form.control} name="transmittalModes.email" render={({ field }) => (
                                                <FormItem className="flex items-center space-x-2">
                                                    <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                                                    <Label htmlFor="email" className="font-normal">Email</Label>
                                                </FormItem>
                                            )}/>
                                            <FormField control={form.control} name="transmittalModes.whatsapp" render={({ field }) => (
                                                <FormItem className="flex items-center space-x-2">
                                                    <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                                                    <Label htmlFor="whatsapp" className="font-normal">Whatsapp</Label>
                                                </FormItem>
                                            )}/>
                                            <FormField control={form.control} name="transmittalModes.hardcopy" render={({ field }) => (
                                                <FormItem className="flex items-center space-x-2">
                                                    <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                                                    <Label htmlFor="hardcopy" className="font-normal">Hardcopy</Label>
                                                </FormItem>
                                            )}/>
                                        </div>
                                        <FormMessage />
                                    </FormItem>
                                )}/>
                                {form.watch('transmittalModes.email') && (
                                    <FormField control={form.control} name="transmittalEmail" render={({ field }) => (
                                        <FormItem><FormLabel>Email Address</FormLabel><FormControl><Input placeholder="Enter email" {...field} /></FormControl><FormMessage /></FormItem>
                                    )}/>
                                )}
                                {form.watch('transmittalModes.whatsapp') && (
                                    <FormField control={form.control} name="transmittalWhatsapp" render={({ field }) => (
                                        <FormItem><FormLabel>WhatsApp Number</FormLabel><FormControl><Input placeholder="Enter WhatsApp number" {...field} /></FormControl><FormMessage /></FormItem>
                                    )}/>
                                )}
                            </div>
                        </div>
                        </>
                    )}

                    {step === 2 && (
                        <div className="py-4">
                        {loading ? (
                        <div className="flex items-center justify-center h-40">
                            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                        </div>
                        ) : (
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                                {materialCategories.map((category) => (
                                <div key={category} className="flex items-center space-x-2">
                                    <Checkbox
                                    id={`category-${category}`}
                                    checked={!!selectedCategories[category]}
                                    onCheckedChange={() => handleCategorySelectionChange(category)}
                                    />
                                    <Label htmlFor={`category-${category}`} className="font-normal">
                                    {category}
                                    </Label>
                                </div>
                                ))}
                            </div>
                        )}
                    </div>
                    )}

                    {step === 3 && (
                        <Accordion type="multiple" className="w-full space-y-4 py-4" >
                            {Object.values(selectedCategories).map(({ categoryName, quantity, tests, notes, details }) => (
                                <AccordionItem value={categoryName} key={categoryName} className="border rounded-lg">
                                    <AccordionTrigger className="p-4 font-bold text-lg">
                                        <span className="flex-grow text-left">{categoryName}</span>
                                        <div className="flex items-center gap-2 mr-4">
                                            <Label>Sample Quantity:</Label>
                                            <Input
                                                type="number"
                                                min={1}
                                                className="w-20"
                                                value={quantity}
                                                onClick={(e) => e.stopPropagation()} // Prevent accordion from toggling
                                                onChange={(e) => handleCategoryDetailsChange(categoryName, 'quantity', Number(e.target.value))}
                                            />
                                        </div>
                                    </AccordionTrigger>
                                    <AccordionContent className="p-4 border-t">
                                        <div className="space-y-4">
                                            <div>
                                                <Label className="font-semibold">Select Tests:</Label>
                                                <div className="grid grid-cols-2 gap-4 mt-2">
                                                    {allTests.filter(t => t.materialCategory === categoryName).map(test => (
                                                        <div key={test.id} className="flex items-center gap-4">
                                                            <Checkbox
                                                                id={`${categoryName}-${test.id}`}
                                                                checked={!!tests[test.id!]}
                                                                onCheckedChange={() => handleTestSelectionChange(categoryName, test)}
                                                            />
                                                            <Label htmlFor={`${categoryName}-${test.id}`} className="font-normal flex-grow">{test.materialTest}</Label>
                                                            {tests[test.id!] && (
                                                                <Input
                                                                    type="number"
                                                                    min={1}
                                                                    max={quantity}
                                                                    className="w-20 h-8"
                                                                    value={tests[test.id!].quantity}
                                                                    onChange={(e) => handleTestQuantityChange(categoryName, test.id!, Number(e.target.value))}
                                                                />
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-2 gap-8">
                                                <div className="space-y-2">
                                                    <Label htmlFor={`notes-${categoryName}`}>Notes</Label>
                                                    <Textarea
                                                        id={`notes-${categoryName}`}
                                                        placeholder={`Add any specific notes for this category...`}
                                                        value={notes}
                                                        onChange={(e) => handleCategoryDetailsChange(categoryName, 'notes', e.target.value)}
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor={`details-${categoryName}`}>Details</Label>
                                                    <Textarea
                                                        id={`details-${categoryName}`}
                                                        placeholder={`Add sample-specific details...`}
                                                        value={details}
                                                        onChange={(e) => handleCategoryDetailsChange(categoryName, 'details', e.target.value)}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </AccordionContent>
                                </AccordionItem>
                            ))}
                        </Accordion>
                    )}

                    {step === 4 && hasSpecialCategories && (
                        <Accordion type="multiple" className="w-full space-y-4 py-4">
                            {Object.values(step4Data).map(category => (
                                <AccordionItem value={category.categoryName} key={category.categoryName} className="border rounded-lg">
                                    <AccordionTrigger className="p-4 font-bold text-lg">{category.categoryName}</AccordionTrigger>
                                    <AccordionContent className="p-4 border-t space-y-4">
                                        {Object.values(category.tests).map(test => {
                                           const currentSum = test.sets.reduce((acc, s) => acc + s.sampleCount, 0);
                                           const totalSamples = test.totalSampleCount;
                                           return (
                                            <Accordion type="multiple" key={test.testId} className="w-full">
                                                <AccordionItem value={test.testId}>
                                                    <AccordionTrigger className="font-semibold text-blue-600">{test.testName}</AccordionTrigger>
                                                    <AccordionContent className="pt-4 space-y-4">
                                                        <div className="grid grid-cols-2 gap-4 items-start p-4 border rounded-md">
                                                            <div className="space-y-2">
                                                                <Label>Number of Sets:</Label>
                                                                <Input type="number" min={1} defaultValue={test.sets.length} className="w-24" onChange={e => handleNumberOfSetsChange(category.categoryName, test.testId, Number(e.target.value))}/>
                                                            </div>
                                                            <div className="space-y-2">
                                                                <div className="flex justify-between items-center">
                                                                    <Label>Set Distribution</Label>
                                                                    <span className="text-xs font-medium">Sum: {currentSum} / {totalSamples}</span>
                                                                </div>
                                                                <div className="flex gap-2 flex-wrap">
                                                                    {test.sets.map((set, setIndex) => (
                                                                        <Input 
                                                                            key={set.id} 
                                                                            type="number" 
                                                                            min={0}
                                                                            value={set.sampleCount} 
                                                                            className="w-16 h-8"
                                                                            onChange={e => handleSetDistributionChange(category.categoryName, test.testId, setIndex, Number(e.target.value))}
                                                                        />
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <Accordion type="multiple" className="w-full space-y-2" defaultValue={['set-1']}>
                                                            {test.sets.map((set, setIndex) => (
                                                                <AccordionItem value={`set-${set.id}`} key={set.id} className="border rounded-md">
                                                                    <AccordionTrigger className="px-4 font-medium">
                                                                      <div className="flex justify-between w-full pr-4">
                                                                        <span>Set {set.id}</span>
                                                                        <div className="flex items-center gap-2">
                                                                          <Label>Samples:</Label>
                                                                          <Input type="number" value={set.sampleCount} min={1} className="w-20 h-8" onClick={e => e.stopPropagation()} readOnly/>
                                                                        </div>
                                                                      </div>
                                                                    </AccordionTrigger>
                                                                    <AccordionContent className="p-4 border-t space-y-4">
                                                                        <div className="grid grid-cols-3 gap-4">
                                                                          <div className="space-y-1">
                                                                            <Label>Casting Date</Label>
                                                                            <DatePicker value={set.castingDate} onChange={date => handleSetDataChange(category.categoryName, test.testId, set.id, 'castingDate', date)} />
                                                                          </div>
                                                                          <div className="space-y-1">
                                                                            <Label>Testing Date</Label>
                                                                            <DatePicker value={set.testingDate} onChange={date => handleSetDataChange(category.categoryName, test.testId, set.id, 'testingDate', date)} />
                                                                          </div>
                                                                          <div className="space-y-1">
                                                                            <Label>Age (Days)</Label>
                                                                            <Input type="number" value={set.age?.toString() ?? ''} onChange={e => handleSetDataChange(category.categoryName, test.testId, set.id, 'age', e.target.value)} />
                                                                          </div>
                                                                        </div>
                                                                         {['Concrete', 'Cylinder'].map(c => c.toLowerCase()).includes(category.categoryName.toLowerCase()) && (
                                                                            <div className="space-y-1">
                                                                              <Label>Class</Label>
                                                                              <SelectWithOther 
                                                                                options={['C10', 'C15', 'C20', 'C25', 'C30', 'C35', 'C40', 'C45', 'C50', 'C12/15', 'C25/30', 'C30/37', 'C40/45']} 
                                                                                value={set.class} 
                                                                                onValueChange={value => handleSetDataChange(category.categoryName, test.testId, set.id, 'class', value)}
                                                                                otherValue={set.customClass}
                                                                                onOtherValueChange={value => handleSetDataChange(category.categoryName, test.testId, set.id, 'customClass', value)}
                                                                                />
                                                                            </div>
                                                                          )}
                                                                          {['Concrete', 'Bricks', 'Blocks', 'Pavers', 'Cylinder'].map(c => c.toLowerCase()).includes(category.categoryName.toLowerCase()) && (
                                                                            <div className="space-y-1">
                                                                                <Label>Area of Use</Label>
                                                                                <Input value={set.areaOfUse || ''} onChange={e => handleSetDataChange(category.categoryName, test.testId, set.id, 'areaOfUse', e.target.value)} />
                                                                            </div>
                                                                          )}
                                                                          {(category.categoryName.toLowerCase() === 'blocks' || category.categoryName.toLowerCase() === 'bricks') && (
                                                                            <div className="space-y-1">
                                                                              <Label>Sample Type</Label>
                                                                              <SelectWithOther 
                                                                                options={['Brick', 'Solid', 'Hollow']}
                                                                                value={set.sampleType} 
                                                                                onValueChange={value => handleSetDataChange(category.categoryName, test.testId, set.id, 'sampleType', value)}
                                                                                otherValue={set.customSampleType}
                                                                                onOtherValueChange={value => handleSetDataChange(category.categoryName, test.testId, set.id, 'customSampleType', value)}
                                                                                />
                                                                            </div>
                                                                          )}
                                                                           {category.categoryName.toLowerCase() === 'pavers' && (
                                                                            <div className="grid grid-cols-2 gap-4">
                                                                              <div className="space-y-1">
                                                                                <Label>Paver Type</Label>
                                                                                <SelectWithOther 
                                                                                    options={['Brick/ Rectangular', 'I - Shape/ Double T/ I – Dumble', 'Cross Dumble', 'Round Dumble/ Basil', 'ZigZag/ Unipaver', 'Milano', 'Fan', 'Hexagon', 'Trihex', 'Trihex Broad', 'Trihex Groove', 'Wave', 'Mirror']}
                                                                                    value={set.paverType} 
                                                                                    onValueChange={value => handleSetDataChange(category.categoryName, test.testId, set.id, 'paverType', value)}
                                                                                    otherValue={set.customPaverType}
                                                                                    onOtherValueChange={value => handleSetDataChange(category.categoryName, test.testId, set.id, 'customPaverType', value)}
                                                                                />
                                                                              </div>
                                                                              <div className="space-y-1">
                                                                                  <Label>No/M²</Label>
                                                                                  <Input 
                                                                                      type="number"
                                                                                      value={set.paversPerSquareMetre || ''}
                                                                                      onChange={e => handleSetDataChange(category.categoryName, test.testId, set.id, 'paversPerSquareMetre', e.target.value)}
                                                                                  />
                                                                              </div>
                                                                            </div>
                                                                          )}
                                                                           {category.categoryName.toLowerCase() === 'water absorption' && (
                                                                            <div className="space-y-1">
                                                                                <Label>Sample Type</Label>
                                                                                <Input value={set.sampleType || ''} onChange={e => handleSetDataChange(category.categoryName, test.testId, set.id, 'sampleType', e.target.value)} />
                                                                            </div>
                                                                          )}

                                                                        <div className="space-y-2">
                                                                            <Label>Sample IDs</Label>
                                                                            <div className="grid grid-cols-4 gap-2">
                                                                                {set.sampleIds.map((id, sampleIdx) => (
                                                                                    <Input key={sampleIdx} value={id} onChange={e => handleSampleIdChange(category.categoryName, test.testId, set.id, sampleIdx, e.target.value)}/>
                                                                                ))}
                                                                            </div>
                                                                        </div>
                                                                    </AccordionContent>
                                                                </AccordionItem>
                                                            ))}
                                                        </Accordion>
                                                    </AccordionContent>
                                                </AccordionItem>
                                            </Accordion>
                                        )})}
                                    </AccordionContent>
                                </AccordionItem>
                            ))}
                        </Accordion>
                    )}

                    {step === 5 && (
                        <div className="space-y-6 py-4">
                            {/* Client & Project Details */}
                            <div className="space-y-2">
                                <h3 className="font-semibold text-lg">Client & Project Details</h3>
                                <div className="grid grid-cols-2 gap-1 text-sm">
                                    <p><span className="font-medium text-muted-foreground">Client:</span> {watchedFormData.clientName} ({watchedFormData.clientContact})</p>
                                    <p><span className="font-medium text-muted-foreground">Address:</span> {watchedFormData.clientAddress}</p>
                                    <p><span className="font-medium text-muted-foreground">Project:</span> {watchedFormData.projectTitle}</p>
                                    {watchedFormData.isBillingClientSame === 'no' && (
                                        <p><span className="font-medium text-muted-foreground">Billing Client:</span> {watchedFormData.billingClientName}</p>
                                    )}
                                </div>
                            </div>
                            <Separator />
                            {/* Sample Details */}
                             <div className="space-y-2">
                                <h3 className="font-semibold text-lg">Sample Details</h3>
                                <div className="grid grid-cols-2 gap-1 text-sm">
                                    <p><span className="font-medium text-muted-foreground">Received on:</span> {format(new Date(), "PPpp")}</p>
                                    <p><span className="font-medium text-muted-foreground">{watchedFormData.deliveryMode === 'pickedBy' ? 'Picked by:' : 'Received by:'}</span> {watchedFormData.receivedBy}</p>
                                    <p><span className="font-medium text-muted-foreground">{watchedFormData.deliveryMode === 'pickedBy' ? "Sender's Contact:" : "Deliverer's Contact:"}</span> {watchedFormData.delivererContact}</p>
                                    <p><span className="font-medium text-muted-foreground">Results via:</span> {getTransmittalModes()}</p>
                                </div>
                            </div>
                             <Separator />
                            {/* Tests to be Performed */}
                            <div className="space-y-3">
                                <h3 className="font-semibold text-lg">Tests to be Performed</h3>
                                {Object.values(selectedCategories).map(cat => (
                                <div key={cat.categoryName}>
                                    <h4 className="font-semibold uppercase">{cat.categoryName} (Total Samples: {cat.quantity})</h4>
                                    <ul className="list-disc pl-5 text-sm space-y-1 mt-1">
                                        {Object.values(cat.tests).map(test => (
                                            <li key={test.id}>
                                                {test.materialTest} (Qty: {test.quantity}, Method: {test.testMethod || 'N/A'})
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                ))}
                            </div>

                            {/* Special Sample Details */}
                            {hasSpecialCategories && (
                                <>
                                 <Separator />
                                <div className="space-y-3">
                                    <h3 className="font-semibold text-lg">Special Sample Details</h3>
                                    {Object.values(step4Data).map(cat => (
                                        <div key={cat.categoryName}>
                                            <h4 className="font-semibold uppercase">{cat.categoryName}</h4>
                                            {Object.values(cat.tests).map(test => (
                                                <div key={test.testId} className="pl-4 mt-2">
                                                    <p className="font-medium text-blue-600">{test.testName}</p>
                                                    {test.sets.map(set => (
                                                        <div key={set.id} className="pl-4 mt-1 pb-2 text-sm">
                                                            <p className="font-semibold">Set {set.id} ({set.sampleCount} samples)</p>
                                                            <div className="grid grid-cols-2 gap-x-4">
                                                                {set.castingDate && <p><span className="text-muted-foreground">Casting:</span> {format(set.castingDate, 'PP')}</p>}
                                                                {set.testingDate && <p><span className="text-muted-foreground">Testing:</span> {format(set.testingDate, 'PP')}</p>}
                                                                {set.age != null && <p><span className="text-muted-foreground">Age:</span> {set.age}</p>}
                                                                {set.class && <p><span className="text-muted-foreground">Class:</span> {set.class === 'Other' ? set.customClass : set.class}</p>}
                                                                {set.sampleType && <p><span className="text-muted-foreground">Sample Type:</span> {set.sampleType === 'Other' ? set.customSampleType : set.sampleType}</p>}
                                                                {set.paverType && <p><span className="font-medium text-muted-foreground">Paver Type:</span> {set.paverType === 'Other' ? set.customPaverType : set.paverType}</p>}
                                                                {set.areaOfUse && <p><span className="text-muted-foreground">Area of Use:</span> {set.areaOfUse}</p>}
                                                                {set.sampleType && !['blocks', 'bricks'].includes(cat.categoryName.toLowerCase()) && <p><span className="text-muted-foreground">Sample Type:</span> {set.sampleType}</p>}
                                                                <p className="col-span-2"><span className="text-muted-foreground">Sample IDs:</span> {set.sampleIds.join(', ')}</p>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            ))}
                                        </div>
                                    ))}
                                </div>
                                </>
                            )}
                        </div>
                    )}
                </form>
            </Form>
        </ScrollArea>
        <DialogFooter className="mt-4 pt-4 border-t">
            {step === 1 && (
                <>
                <Button type="button" variant="outline" onClick={attemptClose}>
                    Cancel
                </Button>
                <Button type="button" onClick={handleNext}>Next</Button>
                </>
            )}
            {step > 1 && step < totalSteps && (
                <>
                 <Button type="button" variant="outline" onClick={handleBack}>
                    Back
                 </Button>
                <Button type="button" variant="outline" onClick={attemptClose}>
                    Cancel
                </Button>
                 <Button type="button" onClick={handleNext}>Next</Button>
                </>
            )}
            {step === totalSteps && (
                 <>
                 <Button type="button" variant="outline" onClick={handleBack} disabled={isSubmitting}>
                    Back
                 </Button>
                <Button type="button" variant="outline" onClick={attemptClose} disabled={isSubmitting}>
                    Cancel
                 </Button>
                 <Button type="button" onClick={handleFinish} disabled={isSubmitting}>
                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {isSubmitting ? "Submitting..." : "Finish & Generate Receipt"}
                 </Button>
                </>
            )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
     <AlertDialog open={isCloseConfirmOpen} onOpenChange={setIsCloseConfirmOpen}>
        <AlertDialogContent>
            <AlertDialogHeader>
            <AlertDialogTitle>Discard Changes?</AlertDialogTitle>
            <AlertDialogDescription>
                You have unsaved changes. Are you sure you want to discard them and close the dialog?
            </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
            <AlertDialogCancel>No, Continue Editing</AlertDialogCancel>
            <AlertDialogAction onClick={handleClose}>Yes, Discard</AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
    </AlertDialog>
    </>
  );
}


    