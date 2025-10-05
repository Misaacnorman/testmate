

"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { DatePicker } from "@/app/samples/components/date-picker";
import { collection, addDoc, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useToast } from "@/hooks/use-toast";
import { type Project, type Test, type ProjectLabTest } from "@/lib/types";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/context/auth-context";

interface AddProjectDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  allTests: Test[];
}

export function AddProjectDialog({ isOpen, onClose, onSuccess }: AddProjectDialogProps) {
    const { laboratoryId } = useAuth();
    const [step, setStep] = React.useState(1);
    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const { toast } = useToast();
    
    // Step 1
    const [date, setDate] = React.useState<Date | undefined>(new Date());
    const [projectIdBig, setProjectIdBig] = React.useState('');
    const [projectIdSmall, setProjectIdSmall] = React.useState('');
    const [client, setClient] = React.useState('');
    const [project, setProject] = React.useState('');
    
    // Step 2
    const [fieldTestDetails, setFieldTestDetails] = React.useState('');
    const [fieldStartDate, setFieldStartDate] = React.useState<Date | undefined>();
    const [fieldEndDate, setFieldEndDate] = React.useState<Date | undefined>();
    const [fieldRemarks, setFieldRemarks] = React.useState('');
    
    // Step 3
    const [allTests, setAllTests] = React.useState<Test[]>([]);
    const [materialCategories, setMaterialCategories] = React.useState<string[]>([]);
    const [selectedLabTests, setSelectedLabTests] = React.useState<ProjectLabTest[]>([]);

    React.useEffect(() => {
        const fetchTests = async () => {
            if(step === 3 && allTests.length === 0) {
                const querySnapshot = await getDocs(collection(db, "tests"));
                const tests = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Test));
                setAllTests(tests);
                const categories = Array.from(new Set(tests.map(t => t.materialCategory)));
                setMaterialCategories(categories);
            }
        }
        fetchTests();
    }, [step, allTests.length]);

    const handleTestSelection = (test: Test, checked: boolean) => {
        if(checked) {
            setSelectedLabTests(prev => [...prev, {
                testId: test.id!,
                materialCategory: test.materialCategory,
                categoryQuantity: 1, // Defaulting to 1, as it's not captured in this simplified flow
                materialTest: test.materialTest,
                quantity: 1,
                technician: ''
            }]);
        } else {
            setSelectedLabTests(prev => prev.filter(t => t.testId !== test.id));
        }
    };
    
    const handleTestQuantityChange = (testId: string, quantity: number) => {
        setSelectedLabTests(prev => prev.map(t => t.testId === testId ? {...t, quantity: quantity} : t));
    }


    const handleNext = () => setStep(prev => prev + 1);
    const handleBack = () => setStep(prev => prev - 1);
    
    const resetState = () => {
        setStep(1);
        setDate(new Date());
        setProjectIdBig('');
        setProjectIdSmall('');
        setClient('');
        setProject('');
        setFieldTestDetails('');
        setFieldStartDate(undefined);
        setFieldEndDate(undefined);
        setFieldRemarks('');
        setSelectedLabTests([]);
    }

    const handleSubmit = async () => {
        setIsSubmitting(true);
        if (!laboratoryId) {
            toast({ variant: "destructive", title: "Creation Failed", description: "Laboratory ID not found."});
            setIsSubmitting(false);
            return;
        }

        const newProject: Omit<Project, 'id'> = {
            date: date!.toISOString(),
            projectIdBig,
            projectIdSmall,
            client,
            project,
            laboratoryId,
            fieldTestDetails,
            fieldStartDate: fieldStartDate?.toISOString(),
            fieldEndDate: fieldEndDate?.toISOString(),
            fieldRemarks,
            labTests: selectedLabTests,
            tasks: selectedLabTests,
            sampleReceipt: `PROJ-${Date.now().toString().slice(-6)}`,
            engineer: '',
            fieldTechnician: '',
            labStartDate: '',
            agreedDelivery: '',
            agreedSignature: '',
            actualDelivery: '',
            actualSignature: '',
            labRemarks: '',
            ackAfterDelivery: '',
            reportIssuedBy: '',
            reportPickedBy: '',
            contact: '',
            dateTime: '',
        };

        try {
            await addDoc(collection(db, "projects"), newProject);
            toast({ title: "Project Created", description: "The new project has been successfully added."});
            onSuccess();
            onClose();
            resetState();
        } catch(e) {
            console.error(e);
            toast({ variant: "destructive", title: "Creation Failed", description: "Could not create the project."});
        } finally {
            setIsSubmitting(false);
        }
    };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Add New Project (Step {step} of 3)</DialogTitle>
          <DialogDescription>
            {step === 1 && "Enter the main project identification details."}
            {step === 2 && "Provide details for any required field work."}
            {step === 3 && "Select the laboratory tests for this project."}
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="flex-grow pr-6 -mr-6">
          <div className="space-y-4 py-4">
            {step === 1 && (
                 <div className="space-y-4">
                    <div className="space-y-2">
                        <Label>Date</Label>
                        <DatePicker value={date} onChange={setDate} />
                    </div>
                     <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Project ID (Big Projects)</Label>
                            <Input value={projectIdBig} onChange={e => setProjectIdBig(e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label>Project ID (Small Projects)</Label>
                            <Input value={projectIdSmall} onChange={e => setProjectIdSmall(e.target.value)} />
                        </div>
                    </div>
                     <div className="space-y-2">
                        <Label>Client</Label>
                        <Input value={client} onChange={e => setClient(e.target.value)} />
                    </div>
                     <div className="space-y-2">
                        <Label>Project</Label>
                        <Input value={project} onChange={e => setProject(e.target.value)} />
                    </div>
                 </div>
            )}
            {step === 2 && (
                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label>Field Tests</Label>
                        <Textarea value={fieldTestDetails} onChange={e => setFieldTestDetails(e.target.value)} placeholder="Describe field tests in detail..."/>
                    </div>
                     <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Start Date</Label>
                            <DatePicker value={fieldStartDate} onChange={setFieldStartDate} />
                        </div>
                        <div className="space-y-2">
                            <Label>End Date</Label>
                            <DatePicker value={fieldEndDate} onChange={setFieldEndDate} />
                        </div>
                    </div>
                     <div className="space-y-2">
                        <Label>Remarks</Label>
                        <Textarea value={fieldRemarks} onChange={e => setFieldRemarks(e.target.value)} placeholder="Add field work remarks..."/>
                    </div>
                </div>
            )}
             {step === 3 && (
                 <Accordion type="multiple" className="w-full space-y-4 py-4" >
                    {materialCategories.map(category => (
                        <AccordionItem value={category} key={category}>
                             <AccordionTrigger className="p-4 font-bold text-lg">{category}</AccordionTrigger>
                             <AccordionContent className="p-4 border-t">
                                <div className="grid grid-cols-2 gap-4">
                                    {allTests.filter(t => t.materialCategory === category).map(test => (
                                        <div key={test.id} className="flex items-center gap-4">
                                            <Checkbox 
                                                id={`test-${test.id}`}
                                                checked={selectedLabTests.some(t => t.testId === test.id)}
                                                onCheckedChange={checked => handleTestSelection(test, !!checked)}
                                            />
                                            <Label htmlFor={`test-${test.id}`} className="font-normal flex-grow">{test.materialTest}</Label>
                                            {selectedLabTests.some(t => t.testId === test.id) && (
                                                <Input 
                                                    type="number" 
                                                    min={1} 
                                                    className="w-20 h-8" 
                                                    value={selectedLabTests.find(t => t.testId === test.id)?.quantity || 1}
                                                    onChange={e => handleTestQuantityChange(test.id!, Number(e.target.value))}
                                                />
                                            )}
                                        </div>
                                    ))}
                                </div>
                             </AccordionContent>
                        </AccordionItem>
                    ))}
                 </Accordion>
             )}
          </div>
        </ScrollArea>

        <DialogFooter className="mt-4 pt-4 border-t">
          {step > 1 && <Button variant="outline" onClick={handleBack} disabled={isSubmitting}>Back</Button>}
          {step < 3 ? (
            <Button onClick={handleNext} disabled={isSubmitting}>Next</Button>
          ) : (
            <Button onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create Project
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
