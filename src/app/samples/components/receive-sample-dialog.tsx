
'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { format, addDays, differenceInDays, isValid } from 'date-fns';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
  DialogClose,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Textarea } from '@/components/ui/textarea';
import { getTests } from '@/services/tests';
import { processAndSaveReceipt } from '@/services/receipts';
import type { Test } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { Calendar } from '@/components/ui/calendar';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';

// Step 1 Schema
const step1Schema = z
  .object({
    clientName: z.string().min(1, 'Client name is required'),
    clientAddress: z.string().min(1, 'Client address is required'),
    clientContact: z.string().min(1, 'Client contact is required'),
    isSameBillingClient: z.enum(['yes', 'no']),
    billingName: z.string().optional(),
    billingAddress: z.string().optional(),
    billingContact: z.string().optional(),
    projectTitle: z.string().min(1, 'Project title is required'),
    sampleStatus: z.string().min(1, 'Sample status is required'),
    receivedBy: z.string().min(1, "Receiver's name is required"),
    deliveredBy: z.string().min(1, 'Delivered by is required'),
    deliveredByContact: z.string().min(1, 'Deliverer contact is required'),
    transmittalModes: z.array(z.string()).min(1, 'Select at least one mode'),
    email: z.string().optional(),
    whatsapp: z.string().optional(),
  })
  .refine(
    (data) =>
      data.isSameBillingClient === 'yes' ||
      (data.billingName && data.billingAddress && data.billingContact),
    {
      message: 'Billing details are required',
      path: ['billingName'],
    }
  )
  .refine(
    (data) =>
      !data.transmittalModes.includes('Email') ||
      (data.email && z.string().email().safeParse(data.email).success),
    {
      message: 'A valid email is required',
      path: ['email'],
    }
  )
  .refine(
    (data) => !data.transmittalModes.includes('Whatsapp') || data.whatsapp,
    {
      message: 'Whatsapp number is required',
      path: ['whatsapp'],
    }
  );

type Step1Data = z.infer<typeof step1Schema>;

type SelectedCategory = {
  quantity: number;
  notes?: string;
  tests: Record<
    string,
    { quantity: number; testMethods: string; materialTest: string }
  >;
};

// Main Dialog Component
export function ReceiveSampleDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [currentStep, setCurrentStep] = useState(1);
  const [allTests, setAllTests] = useState<Test[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const router = useRouter();
  const { user } = useAuth();

  const [step1Data, setStep1Data] = useState<Step1Data | null>(null);
  const [selectedCategories, setSelectedCategories] = useState<
    Record<string, SelectedCategory>
  >({});
  const [step4Data, setStep4Data] = useState<Record<string, any>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const receiptDate = useMemo(() => new Date(), []);

  const form1 = useForm<Step1Data>({
    resolver: zodResolver(step1Schema),
    defaultValues: {
      isSameBillingClient: 'yes',
      transmittalModes: [],
      receivedBy: user?.displayName || user?.email || '',
    },
  });

  useEffect(() => {
    if (user) {
      form1.setValue('receivedBy', user.displayName || user.email || '');
    }
  }, [user, form1]);

  const specialCategories = useMemo(
    () => ['Concrete Cubes', 'Bricks', 'Blocks', 'Pavers', 'Cylinder'],
    []
  );

  const resetAllState = useCallback(() => {
    setCurrentStep(1);
    form1.reset({
      isSameBillingClient: 'yes',
      transmittalModes: [],
      receivedBy: user?.displayName || user?.email || '',
    });
    setStep1Data(null);
    setSelectedCategories({});
    setStep4Data({});
    setIsSubmitting(false);
  }, [form1, user]);

  useEffect(() => {
    if (open) {
      const fetchInitialData = async () => {
        setIsLoading(true);
        try {
          const tests = await getTests();
          setAllTests(tests);
        } catch (error) {
          toast({
            variant: 'destructive',
            title: 'Error',
            description: 'Could not fetch tests from the database.',
          });
        } finally {
          setIsLoading(false);
        }
      };
      fetchInitialData();
    } else {
      // Only reset state when dialog is fully closed
      setTimeout(() => {
        if (!open) resetAllState();
      }, 200);
    }
  }, [open, toast, resetAllState]);

  const uniqueMaterialCategories = useMemo(() => {
    const categories = allTests
      .filter((test) => typeof test.material === 'string') // Add this line to filter out tests without a material
      .map((test) => test.material.toLowerCase().trim());
    return [...new Set(categories)].map(cat => allTests.find(t => t.material && t.material.toLowerCase().trim() === cat)!.material);
  }, [allTests]);

  const handleNext = async () => {
    if (currentStep === 1) {
      const isValid = await form1.trigger();
      if (isValid) {
        setStep1Data(form1.getValues());
        setCurrentStep(2);
      }
    } else if (currentStep === 2) {
      if (Object.keys(selectedCategories).length === 0) {
        toast({
          variant: 'destructive',
          title: 'Validation Error',
          description: 'Please select at least one material category.',
        });
        return;
      }
      setCurrentStep(3);
    } else if (currentStep === 3) {
      const allQuantitiesSet = Object.entries(selectedCategories).every(
        ([_, data]) => {
          if (Object.keys(data.tests).length === 0) return true; // Allow categories with no tests selected yet
          return Object.values(data.tests).every((test) => test.quantity > 0);
        }
      );

      if (!allQuantitiesSet) {
        toast({
          variant: 'destructive',
          title: 'Validation Error',
          description: 'Please set a quantity for each selected test.',
        });
        return;
      }

      const anySpecialSelected = Object.keys(selectedCategories).some(
        (selectedCat) =>
          specialCategories.some(
            (specialCat) =>
              specialCat.toLowerCase().trim() === selectedCat.toLowerCase().trim()
          ) && Object.keys(selectedCategories[selectedCat].tests).length > 0
      );

      if (anySpecialSelected) {
        setCurrentStep(4);
      } else {
        setCurrentStep(5);
      }
    } else if (currentStep === 4) {
      setCurrentStep(5);
    }
  };

  const handleBack = () => {
    if (currentStep === 5) {
      const anySpecialSelected = Object.keys(selectedCategories).some(
        (selectedCat) =>
          specialCategories.some(
            (specialCat) =>
              specialCat.toLowerCase().trim() === selectedCat.toLowerCase().trim()
          ) && Object.keys(selectedCategories[selectedCat].tests).length > 0
      );
      if (anySpecialSelected) {
        setCurrentStep(4);
      } else {
        setCurrentStep(3);
      }
    } else if (currentStep === 4) {
      setCurrentStep(3);
    } else if (currentStep === 3) {
      setCurrentStep(2);
    } else if (currentStep === 2) {
      setCurrentStep(1);
    }
  };

  const handleCategoryToggle = (category: string) => {
    setSelectedCategories((prev) => {
      const newCategories = { ...prev };
      if (newCategories[category]) {
        delete newCategories[category];
      } else {
        newCategories[category] = { quantity: 1, tests: {} };
      }
      return newCategories;
    });
  };

  const handleTestToggle = (category: string, test: Test) => {
    setSelectedCategories((prev) => {
      const newCategories = JSON.parse(JSON.stringify(prev));
      let categoryData = newCategories[category];

      if (!categoryData) {
        newCategories[category] = { quantity: 1, tests: {} };
        categoryData = newCategories[category];
      }

      if (categoryData.tests[test.id]) {
        delete categoryData.tests[test.id];
      } else {
        categoryData.tests[test.id] = {
          quantity: categoryData.quantity,
          testMethods: test.method,
          materialTest: test.name,
        };
      }
      return newCategories;
    });
  };

  const handleCategoryQuantityChange = (
    category: string,
    quantityStr: string
  ) => {
    const quantity = parseInt(quantityStr, 10);
    const newQuantity = isNaN(quantity) || quantity < 1 ? 1 : quantity;

    setSelectedCategories((prev) => {
      const newCategories = JSON.parse(JSON.stringify(prev));
      const catData = newCategories[category];
      if (catData) {
        catData.quantity = newQuantity;
        Object.keys(catData.tests).forEach((testId) => {
          catData.tests[testId].quantity = newQuantity;
        });
      }
      return newCategories;
    });
  };

  const handleTestQuantityChange = (
    category: string,
    testId: string,
    quantity: number
  ) => {
    setSelectedCategories((prev) => {
      const newCategories = JSON.parse(JSON.stringify(prev));
      const catData = newCategories[category];
      if (catData && catData.tests[testId]) {
        const parentQuantity = catData.quantity;
        const newQuantity = Math.max(0, Math.min(quantity, parentQuantity));
        catData.tests[testId].quantity = newQuantity;
      }
      return newCategories;
    });
  };

  const handleCategoryNotesChange = (category: string, notes: string) => {
    setSelectedCategories((prev) => ({
      ...prev,
      [category]: { ...prev[category], notes },
    }));
  };

  const handleStep4Change = useCallback(
    (category: string, testId: string, field: string, value: any) => {
      setStep4Data((prev) => {
        const newStep4Data = { ...prev };
        if (!newStep4Data[category]) newStep4Data[category] = {};
        if (!newStep4Data[category][testId])
          newStep4Data[category][testId] = {};
        newStep4Data[category][testId] = {
          ...newStep4Data[category][testId],
          [field]: value,
        };
        return newStep4Data;
      });
    },
    []
  );

  const handleSetDataChange = useCallback(
    (
      category: string,
      testId: string,
      setIndex: number,
      field: string,
      value: any
    ) => {
      setStep4Data((prev) => {
        const newStep4Data = JSON.parse(JSON.stringify(prev));
        if (!newStep4Data[category] || !newStep4Data[category][testId])
          return prev;

        const testData = newStep4Data[category][testId];
        const newSets = [...(testData.sets || [])];
        if (!newSets[setIndex]) newSets[setIndex] = {};

        newSets[setIndex] = { ...newSets[setIndex], [field]: value };

        const castingDate = newSets[setIndex].castingDate
          ? new Date(newSets[setIndex].castingDate)
          : null;
        const testingDate = newSets[setIndex].testingDate
          ? new Date(newSets[setIndex].testingDate)
          : null;
        const ageStr = String(value);
        const age =
          field === 'age' && ageStr
            ? parseInt(ageStr, 10)
            : newSets[setIndex].age
            ? parseInt(String(newSets[setIndex].age), 10)
            : null;

        if (
          field === 'castingDate' &&
          testingDate &&
          isValid(testingDate) &&
          isValid(castingDate)
        ) {
          newSets[setIndex].age = differenceInDays(testingDate, castingDate);
        } else if (
          field === 'testingDate' &&
          castingDate &&
          isValid(castingDate) &&
          isValid(testingDate)
        ) {
          newSets[setIndex].age = differenceInDays(testingDate, castingDate);
        } else if (
          field === 'age' &&
          castingDate &&
          isValid(castingDate) &&
          age !== null &&
          !isNaN(age)
        ) {
          newSets[setIndex].testingDate = addDays(castingDate, age);
        } else if (
          field === 'castingDate' &&
          age !== null &&
          !isNaN(age) &&
          isValid(castingDate)
        ) {
          newSets[setIndex].testingDate = addDays(castingDate, age);
        } else if (
          field === 'testingDate' &&
          age !== null &&
          !isNaN(age) &&
          isValid(testingDate)
        ) {
          newSets[setIndex].castingDate = addDays(testingDate, -age);
        } else if (field === 'age' && !ageStr) {
          newSets[setIndex].age = '';
        }

        return {
          ...newStep4Data,
          [category]: {
            ...newStep4Data[category],
            [testId]: { ...testData, sets: newSets },
          },
        };
      });
    },
    []
  );

  const handleSampleIdChange = (
    category: string,
    testId: string,
    setIndex: number,
    sampleIndex: number,
    value: string
  ) => {
    setStep4Data((prev) => {
      const newStep4Data = { ...prev };
      const testData = newStep4Data[category][testId];
      const newSets = [...testData.sets];
      if (!newSets[setIndex].serials) newSets[setIndex].serials = [];
      newSets[setIndex].serials[sampleIndex] = value;

      return {
        ...prev,
        [category]: {
          ...prev[category],
          [testId]: { ...testData, sets: newSets },
        },
      };
    });
  };

  const initializeStep4Data = useCallback(() => {
    const initialData: Record<string, any> = {};
    Object.entries(selectedCategories).forEach(([category, catData]) => {
      if (
        specialCategories.some(
          (sc) => sc.toLowerCase().trim() === category.toLowerCase().trim()
        )
      ) {
        initialData[category] = {};
        Object.entries(catData.tests).forEach(([testId, testData]) => {
          if (testData.quantity > 0) {
            initialData[category][testId] = {
              materialTest: testData.materialTest,
              quantity: testData.quantity,
              numberOfSets: 1,
              setDistribution: [testData.quantity],
              sets: Array.from({ length: 1 }, () => ({
                serials: Array.from(
                  { length: testData.quantity },
                  (_, i) => `${i + 1}`
                ),
                testingDate: new Date(),
              })),
            };
          }
        });
      }
    });
    setStep4Data(initialData);
  }, [selectedCategories, specialCategories]);

  useEffect(() => {
    if (currentStep === 4) {
      initializeStep4Data();
    }
  }, [currentStep, initializeStep4Data]);

  const handleSetDistribution = (
    category: string,
    testId: string,
    numSets: number
  ) => {
    const totalQuantity = selectedCategories[category].tests[testId].quantity;
    if (totalQuantity === 0 || numSets <= 0 || isNaN(numSets)) return;

    if (isNaN(numSets) || numSets < 1) {
      numSets = 1;
    }

    const base = Math.floor(totalQuantity / numSets);
    const remainder = totalQuantity % numSets;
    const distribution = Array(numSets).fill(base);
    for (let i = 0; i < remainder; i++) {
      distribution[i]++;
    }

    let sampleCounter = 1;
    const setsPayload = {
      numberOfSets: numSets,
      setDistribution: distribution,
      sets: Array.from({ length: numSets }, (_, i) => {
        const setQuantity = distribution[i];
        const serials = Array.from(
          { length: setQuantity },
          () => `${sampleCounter++}`
        );
        return {
          serials,
          testingDate: new Date(),
        };
      }),
    };

    setStep4Data((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [testId]: {
          ...prev[category][testId],
          ...setsPayload,
        },
      },
    }));
  };

  const handleConfirmAndGenerate = async () => {
    if (!step1Data || isSubmitting) return;

    setIsSubmitting(true);

    const receiptData = {
      receiptDate,
      formData: step1Data,
      categories: selectedCategories,
      specialData: step4Data,
    };

    try {
      const newReceipt = await processAndSaveReceipt(receiptData);
      toast({
        title: 'Receipt Saved',
        description: `Receipt with ID ${newReceipt.id} has been saved and registers have been updated.`,
      });
      onOpenChange(false);
      router.push(`/logs/${newReceipt.id}`);
    } catch (error) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Could not save the receipt and update registers.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderSetFields = (
    category: string,
    testId: string,
    setsData: any
  ) => {
    if (!setsData?.sets) return null;
    return setsData.sets.map((set: any, i: number) => (
      <AccordionItem key={i} value={`set-${i}`}>
        <AccordionTrigger>
          <h4 className="font-semibold text-md">Set {i + 1}</h4>
        </AccordionTrigger>
        <AccordionContent className="space-y-3 border p-3 rounded-lg">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Casting Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={'outline'}
                    className={cn(
                      'w-full justify-start text-left font-normal',
                      !set.castingDate && 'text-muted-foreground'
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {set.castingDate ? (
                      format(new Date(set.castingDate), 'PPP')
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={set.castingDate}
                    onSelect={(date) =>
                      handleSetDataChange(category, testId, i, 'castingDate', date)
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="space-y-2">
              <Label>Testing Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={'outline'}
                    className={cn(
                      'w-full justify-start text-left font-normal',
                      !set.testingDate && 'text-muted-foreground'
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {set.testingDate ? (
                      format(new Date(set.testingDate), 'PPP')
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={
                      set.testingDate ? new Date(set.testingDate) : undefined
                    }
                    onSelect={(date) =>
                      handleSetDataChange(category, testId, i, 'testingDate', date)
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="space-y-2">
              <Label>Age (Days)</Label>
              <Input
                type="number"
                value={set.age || ''}
                onChange={(e) =>
                  handleSetDataChange(category, testId, i, 'age', e.target.value)
                }
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Area of Use</Label>
              <Input
                value={set.areaOfUse || ''}
                onChange={(e) =>
                  handleSetDataChange(
                    category,
                    testId,
                    i,
                    'areaOfUse',
                    e.target.value
                  )
                }
              />
            </div>
            {category.toLowerCase() === 'concrete cubes' && (
              <div className="space-y-2">
                <Label>Class</Label>
                <Input
                  value={set.class || ''}
                  onChange={(e) =>
                    handleSetDataChange(
                      category,
                      testId,
                      i,
                      'class',
                      e.target.value
                    )
                  }
                />
              </div>
            )}
          </div>
          <div className="space-y-2">
            <Label>Sample IDs</Label>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
              {set.serials &&
                Array.isArray(set.serials) &&
                set.serials.map((serial: string, sIndex: number) => (
                  <Input
                    key={sIndex}
                    value={serial}
                    onChange={(e) =>
                      handleSampleIdChange(
                        category,
                        testId,
                        i,
                        sIndex,
                        e.target.value
                      )
                    }
                  />
                ))}
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>
    ));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-4xl max-h-[95vh] flex flex-col"
        onInteractOutside={(e) => {
          if (currentStep > 1) {
            e.preventDefault();
          }
        }}
      >
        <DialogHeader>
          <DialogTitle>Receive New Sample (Step {currentStep} of 5)</DialogTitle>
          <DialogDescription>
            {currentStep === 1 && 'Enter the client and sample details.'}
            {currentStep === 2 && 'Select the material categories for testing.'}
            {currentStep === 3 &&
              'Specify quantities and select tests for each category.'}
            {currentStep === 4 &&
              'Provide additional details for special samples.'}
            {currentStep === 5 && 'Review all the details before confirming.'}
          </DialogDescription>
        </DialogHeader>

        <div className="flex-grow overflow-y-auto pr-6 -mr-6">
          {currentStep === 1 && (
            <form>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="clientName">Client Name</Label>
                    <Input id="clientName" {...form1.register('clientName')} />
                    {form1.formState.errors.clientName && (
                      <p className="text-sm text-destructive">
                        {form1.formState.errors.clientName.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="clientAddress">Client Address</Label>
                    <Input
                      id="clientAddress"
                      {...form1.register('clientAddress')}
                    />
                    {form1.formState.errors.clientAddress && (
                      <p className="text-sm text-destructive">
                        {form1.formState.errors.clientAddress.message}
                      </p>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="clientContact">Client Contact</Label>
                    <Input
                      id="clientContact"
                      {...form1.register('clientContact')}
                    />
                    {form1.formState.errors.clientContact && (
                      <p className="text-sm text-destructive">
                        {form1.formState.errors.clientContact.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label>Is the billing client the same?</Label>
                    <Controller
                      control={form1.control}
                      name="isSameBillingClient"
                      render={({ field }) => (
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex gap-4"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="yes" id="yes" />
                            <Label htmlFor="yes">Yes</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="no" id="no" />
                            <Label htmlFor="no">No</Label>
                          </div>
                        </RadioGroup>
                      )}
                    />
                  </div>
                </div>

                {form1.watch('isSameBillingClient') === 'no' && (
                  <div className="border p-4 rounded-md space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="billingName">Billing Client Name</Label>
                        <Input
                          id="billingName"
                          {...form1.register('billingName')}
                        />
                        {form1.formState.errors.billingName && (
                          <p className="text-sm text-destructive">
                            {form1.formState.errors.billingName.message}
                          </p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="billingAddress">
                          Billing Client Address
                        </Label>
                        <Input
                          id="billingAddress"
                          {...form1.register('billingAddress')}
                        />
                        {form1.formState.errors.billingAddress && (
                          <p className="text-sm text-destructive">
                            {form1.formState.errors.billingAddress.message}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="billingContact">
                        Billing Client Contact
                      </Label>
                      <Input
                        id="billingContact"
                        {...form1.register('billingContact')}
                      />
                      {form1.formState.errors.billingContact && (
                        <p className="text-sm text-destructive">
                          {form1.formState.errors.billingContact.message}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                <Separator />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="projectTitle">Project Title</Label>
                    <Input
                      id="projectTitle"
                      {...form1.register('projectTitle')}
                    />
                    {form1.formState.errors.projectTitle && (
                      <p className="text-sm text-destructive">
                        {form1.formState.errors.projectTitle.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label>Date &amp; Time of Receipt</Label>
                    <Input
                      value={format(receiptDate, 'yyyy-MM-dd HH:mm')}
                      readOnly
                      className="bg-muted/50"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="sampleStatus">
                      Sample Status on Arrival
                    </Label>
                    <Input
                      id="sampleStatus"
                      {...form1.register('sampleStatus')}
                    />
                    {form1.formState.errors.sampleStatus && (
                      <p className="text-sm text-destructive">
                        {form1.formState.errors.sampleStatus.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="receivedBy">Received By</Label>
                    <Input
                      id="receivedBy"
                      {...form1.register('receivedBy')}
                      readOnly
                      className="bg-muted/50"
                    />
                    {form1.formState.errors.receivedBy && (
                      <p className="text-sm text-destructive">
                        {form1.formState.errors.receivedBy.message}
                      </p>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="deliveredBy">Delivered By</Label>
                    <Input
                      id="deliveredBy"
                      {...form1.register('deliveredBy')}
                    />
                    {form1.formState.errors.deliveredBy && (
                      <p className="text-sm text-destructive">
                        {form1.formState.errors.deliveredBy.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="deliveredByContact">
                      Deliverer's Contact
                    </Label>
                    <Input
                      id="deliveredByContact"
                      {...form1.register('deliveredByContact')}
                    />
                    {form1.formState.errors.deliveredByContact && (
                      <p className="text-sm text-destructive">
                        {form1.formState.errors.deliveredByContact.message}
                      </p>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Mode of Results Transmittal</Label>
                    <Controller
                      control={form1.control}
                      name="transmittalModes"
                      render={({ field }) => (
                        <div className="flex gap-4">
                          {['Email', 'Whatsapp', 'Hardcopy'].map((mode) => (
                            <div key={mode} className="flex items-center space-x-2">
                              <Checkbox
                                id={mode}
                                checked={field.value?.includes(mode)}
                                onCheckedChange={(checked) => {
                                  return checked
                                    ? field.onChange([
                                        ...(field.value || []),
                                        mode,
                                      ])
                                    : field.onChange(
                                        field.value?.filter(
                                          (value) => value !== mode
                                        )
                                      );
                                }}
                              />
                              <Label htmlFor={mode}>{mode}</Label>
                            </div>
                          ))}
                        </div>
                      )}
                    />
                    {form1.formState.errors.transmittalModes && (
                      <p className="text-sm text-destructive">
                        {form1.formState.errors.transmittalModes.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {form1.watch('transmittalModes')?.includes('Email') && (
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        {...form1.register('email')}
                        placeholder="example@domain.com"
                      />
                      {form1.formState.errors.email && (
                        <p className="text-sm text-destructive">
                          {form1.formState.errors.email.message}
                        </p>
                      )}
                    </div>
                  )}
                  {form1.watch('transmittalModes')?.includes('Whatsapp') && (
                    <div className="space-y-2">
                      <Label htmlFor="whatsapp">Whatsapp Number</Label>
                      <Input
                        id="whatsapp"
                        {...form1.register('whatsapp')}
                        placeholder="+256..."
                      />
                      {form1.formState.errors.whatsapp && (
                        <p className="text-sm text-destructive">
                          {form1.formState.errors.whatsapp.message}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </form>
          )}

          {currentStep === 2 && (
            <div>
              {isLoading ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {Array.from({ length: 12 }).map((_, i) => (
                    <Skeleton key={i} className="h-10 w-full" />
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {uniqueMaterialCategories.map((category, index) => (
                    <div key={`${category}-${index}`} className="flex items-center space-x-2">
                      <Checkbox
                        id={category}
                        checked={!!selectedCategories[category]}
                        onCheckedChange={() => handleCategoryToggle(category)}
                      />
                      <Label htmlFor={category} className="flex-1">
                        {category}
                      </Label>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {currentStep === 3 && (
            <Accordion type="multiple" className="w-full space-y-2">
              {Object.keys(selectedCategories).map((category) => (
                <AccordionItem key={category} value={category}>
                  <AccordionTrigger>
                    <div className="flex w-full items-center justify-between">
                      <span className="font-bold text-lg flex-1 text-left">
                        {category}
                      </span>
                      <div className="flex items-center gap-2 pr-2">
                        <Label>Sample Quantity:</Label>
                        <Input
                          type="number"
                          className="w-24"
                          value={selectedCategories[category]?.quantity}
                          onClick={(e) => e.stopPropagation()}
                          onChange={(e) =>
                            handleCategoryQuantityChange(category, e.target.value)
                          }
                          min={1}
                        />
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="p-4 border border-t-0 rounded-b-md">
                    <div className="space-y-4">
                      <h4 className="font-semibold">Select Tests:</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                        {allTests
                          .filter(
                            (t) =>
                              t.material && t.material.toLowerCase().trim() ===
                              category.toLowerCase().trim()
                          )
                          .map((test) => (
                            <div
                              key={test.id}
                              className="flex items-center justify-between"
                            >
                              <div className="flex items-center space-x-3">
                                <Checkbox
                                  id={`${category}-${test.id}`}
                                  checked={
                                    !!selectedCategories[category]?.tests[test.id]
                                  }
                                  onCheckedChange={() =>
                                    handleTestToggle(category, test)
                                  }
                                />
                                <Label htmlFor={`${category}-${test.id}`}>
                                  {test.name}
                                </Label>
                              </div>
                              {selectedCategories[category]?.tests[test.id] && (
                                <Input
                                  type="number"
                                  className="w-24"
                                  value={
                                    selectedCategories[category]?.tests[test.id]
                                      .quantity
                                  }
                                  onChange={(e) =>
                                    handleTestQuantityChange(
                                      category,
                                      test.id,
                                      parseInt(e.target.value, 10)
                                    )
                                  }
                                  max={selectedCategories[category]?.quantity}
                                  min={0}
                                />
                              )}
                            </div>
                          ))}
                      </div>
                      <div>
                        <Label>Notes</Label>
                        <Textarea
                          value={selectedCategories[category].notes || ''}
                          onChange={(e) =>
                            handleCategoryNotesChange(category, e.target.value)
                          }
                          placeholder="Add any specific notes for this category..."
                        />
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          )}

          {currentStep === 4 && (
            <Accordion type="multiple" className="w-full space-y-2">
              {Object.entries(step4Data).map(([category, tests]) => (
                <AccordionItem key={category} value={category}>
                  <AccordionTrigger>
                    <span className="font-bold text-lg flex-1 text-left">
                      {category}
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="p-4 space-y-6">
                    {Object.entries(tests as Record<string, any>).map(
                      ([testId, testDetails]) => (
                        <div
                          key={testId}
                          className="space-y-4 border-2 border-dashed p-4 rounded-lg"
                        >
                          <h3 className="font-bold text-lg text-primary text-center">
                            {testDetails.materialTest}
                          </h3>
                          <div className="space-y-3">
                            <div className="flex items-center gap-4">
                              <Label>Number of Sets</Label>
                              <Input
                                type="number"
                                className="w-24"
                                min={1}
                                value={testDetails.numberOfSets || 1}
                                onChange={(e) => {
                                  const numSets =
                                    parseInt(e.target.value, 10) || 1;
                                  handleSetDistribution(
                                    category,
                                    testId,
                                    numSets
                                  );
                                }}
                              />
                            </div>
                            {testDetails.numberOfSets > 1 && (
                              <div className="space-y-2 border p-2 rounded-md">
                                <div className="flex justify-between">
                                  <Label>Set Distribution</Label>
                                  <span
                                    className={cn(
                                      'text-sm font-bold',
                                      testDetails.setDistribution.reduce(
                                        (a: number, b: number) => a + b,
                                        0
                                      ) !== testDetails.quantity
                                        ? 'text-destructive'
                                        : 'text-primary'
                                    )}
                                  >
                                    Sum:{' '}
                                    {testDetails.setDistribution.reduce(
                                      (a: number, b: number) => a + b,
                                      0
                                    )}{' '}
                                    / {testDetails.quantity}
                                  </span>
                                </div>
                                <div className="flex gap-2 flex-wrap">
                                  {testDetails.setDistribution.map(
                                    (dist: number, i: number) => (
                                      <Input
                                        key={i}
                                        type="number"
                                        className="w-20"
                                        value={dist}
                                        onChange={(e) => {
                                          const newDist = [
                                            ...testDetails.setDistribution,
                                          ];
                                          newDist[i] = parseInt(
                                            e.target.value,
                                            10
                                          );
                                          handleStep4Change(
                                            category,
                                            testId,
                                            'setDistribution',
                                            newDist
                                          );
                                        }}
                                      />
                                    )
                                  )}
                                </div>
                              </div>
                            )}
                            <Separator />
                            <Accordion
                              type="multiple"
                              className="w-full"
                              defaultValue={['set-0']}
                            >
                              {renderSetFields(category, testId, testDetails)}
                            </Accordion>
                          </div>
                        </div>
                      )
                    )}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          )}

          {currentStep === 5 && step1Data && (
            <ScrollArea className="h-full">
              <div className="space-y-6 pr-4">
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold">
                    Client &amp; Project Details
                  </h3>
                  <div className="text-sm space-y-1">
                    <p>
                      <strong>Client:</strong> {step1Data.clientName} (
                      {step1Data.clientContact})
                    </p>
                    <p>
                      <strong>Address:</strong> {step1Data.clientAddress}
                    </p>
                    <p>
                      <strong>Project:</strong> {step1Data.projectTitle}
                    </p>
                    {step1Data.isSameBillingClient === 'no' && (
                      <div className="pt-2">
                        <p>
                          <strong>Billing Client:</strong> {step1Data.billingName}{' '}
                          ({step1Data.billingContact})
                        </p>
                        <p>
                          <strong>Billing Address:</strong>{' '}
                          {step1Data.billingAddress}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
                <Separator />
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold">Sample Details</h3>
                  <div className="text-sm space-y-1">
                    <p>
                      <strong>Received on:</strong> {format(receiptDate, 'PPP p')}
                    </p>
                    <p>
                      <strong>Received by:</strong> {step1Data.receivedBy}
                    </p>
                    <p>
                      <strong>Delivered by:</strong> {step1Data.deliveredBy} (
                      {step1Data.deliveredByContact})
                    </p>
                    <p>
                      <strong>Status on Arrival:</strong> {step1Data.sampleStatus}
                    </p>
                    <p>
                      <strong>Results via:</strong>{' '}
                      {step1Data.transmittalModes.join(', ')}
                    </p>
                  </div>
                </div>
                <Separator />
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">
                    Tests to be Performed
                  </h3>
                  {Object.entries(selectedCategories).map(([category, data]) => (
                    <div key={category} className="space-y-2">
                      <h4 className="font-medium">
                        {category} (Total Samples: {data.quantity})
                      </h4>
                      <ul className="list-disc list-inside text-sm pl-4">
                        {Object.entries(data.tests).map(
                          ([testId, testData]) => (
                            <li key={testId}>
                              {testData.materialTest} (Qty: {testData.quantity},
                              Method: {testData.testMethods})
                            </li>
                          )
                        )}
                      </ul>
                      {data.notes && (
                        <p className="text-sm text-muted-foreground pt-1">
                          <strong>Notes:</strong> {data.notes}
                        </p>
                      )}
                    </div>
                  ))}
                </div>

                {Object.keys(step4Data).length > 0 && (
                  <div className="space-y-4">
                    <Separator />
                    <h3 className="text-lg font-semibold">
                      Special Sample Details
                    </h3>
                    {Object.entries(step4Data).map(([category, tests]) => (
                      <div key={category} className="space-y-2">
                        <h4 className="font-medium">{category}</h4>
                        {Object.entries(tests as Record<string, any>).map(
                          ([testId, testDetails]) => (
                            <div
                              key={testId}
                              className="mt-2 p-2 border rounded-md"
                            >
                              <h5 className="font-medium text-primary">
                                {testDetails.materialTest} (Qty:{' '}
                                {testDetails.quantity})
                              </h5>
                              {testDetails.sets.map((set: any, i: number) => (
                                <div
                                  key={i}
                                  className="text-sm pl-4 border-l-2 ml-2 space-y-1 mt-2"
                                >
                                  <p>
                                    <strong>Set {i + 1}</strong> (Qty:{' '}
                                    {testDetails.setDistribution[i]})
                                  </p>
                                  <p>
                                    Casting:{' '}
                                    {set.castingDate
                                      ? format(new Date(set.castingDate), 'PPP')
                                      : 'N/A'}
                                    , Testing:{' '}
                                    {set.testingDate
                                      ? format(new Date(set.testingDate), 'PPP')
                                      : 'N/A'}
                                    , Age: {set.age || 'N/A'} days
                                  </p>
                                  <p>Area of Use: {set.areaOfUse || 'N/A'}</p>
                                  {set.class && <p>Class: {set.class}</p>}
                                  <p>
                                    IDs:{' '}
                                    {Array.isArray(set.serials)
                                      ? set.serials.join(', ')
                                      : ''}
                                  </p>
                                </div>
                              ))}
                            </div>
                          )
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </ScrollArea>
          )}
        </div>

        <DialogFooter className="pt-4">
          {currentStep > 1 && (
            <Button variant="ghost" onClick={handleBack} className="mr-auto">
              Back
            </Button>
          )}
          {currentStep < 5 && <Button onClick={handleNext}>Next</Button>}
          {currentStep === 5 && (
            <Button onClick={handleConfirmAndGenerate} disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Confirm & Generate Receipt'}
            </Button>
          )}
          <DialogClose asChild>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

    

    
