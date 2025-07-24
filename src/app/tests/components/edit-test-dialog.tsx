"use client";

import { useEffect, useState } from "react";
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
import { Wand2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { suggestTestCode } from "@/ai/flows/suggest-test-code";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { Test } from "@/types/test";

const testSchema = z.object({
  materialCategory: z.string().min(1, "Material category is required."),
  testMethods: z.string().min(1, "Test method is required."),
  testCode: z.string().min(1, "Test code is required."),
  materialTest: z.string().min(1, "Material test is required."),
  accreditation: z.string().min(1, "Accreditation status is required."),
  unit: z.string().min(1, "Unit is required."),
  amountUGX: z.coerce.number().min(0, "Amount must be positive."),
  amountUSD: z.coerce.number().min(0, "Amount must be positive."),
  leadTimeDays: z.coerce.number().int().min(0, "Lead time must be positive."),
});

type EditTestDialogProps = {
    test: Test;
    onTestUpdated: (test: Test) => void;
    onOpenChange: (open: boolean) => void;
}

export function EditTestDialog({ test, onTestUpdated, onOpenChange }: EditTestDialogProps) {
  const [isSuggesting, setIsSuggesting] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof testSchema>>({
    resolver: zodResolver(testSchema),
    defaultValues: {
        materialCategory: test.materialCategory,
        testMethods: test.testMethods,
        testCode: test.testCode,
        materialTest: test.materialTest,
        accreditation: test.accreditation,
        unit: test.unit,
        amountUGX: test.amountUGX,
        amountUSD: test.amountUSD,
        leadTimeDays: test.leadTimeDays,
    },
  });

  useEffect(() => {
    form.reset(test);
  }, [test, form]);


  const handleSuggestCode = async () => {
    const materialCategory = form.getValues("materialCategory");
    const testMethod = form.getValues("testMethods");

    if (!materialCategory || !testMethod) {
      toast({
        variant: "destructive",
        title: "Missing Information",
        description: "Please fill in Material Category and Test Method first.",
      });
      return;
    }

    setIsSuggesting(true);
    try {
      const result = await suggestTestCode({ materialCategory, testMethod });
      form.setValue("testCode", result.suggestedTestCode);
      toast({
        title: "Suggestion successful",
        description: `Suggested code: ${result.suggestedTestCode}`,
      });
    } catch (error) {
      console.error("AI suggestion failed", error);
      toast({
        variant: "destructive",
        title: "Suggestion Failed",
        description: "Could not suggest a test code. Please try again.",
      });
    } finally {
      setIsSuggesting(false);
    }
  };

  const onSubmit = (values: z.infer<typeof testSchema>) => {
    const updatedTest: Test = {
        id: test.id,
        ...values
    };
    onTestUpdated(updatedTest);
  };

  return (
    <Dialog open={true} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Test</DialogTitle>
          <DialogDescription>
            Update the details for this test. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 py-4">
                <FormField control={form.control} name="materialCategory" render={({ field }) => (
                    <FormItem><FormLabel>Material Category</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="testMethods" render={({ field }) => (
                    <FormItem><FormLabel>Test Method(s)</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="testCode" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Test Code</FormLabel>
                        <div className="flex items-center gap-2">
                        <FormControl><Input {...field} /></FormControl>
                        <Button type="button" variant="outline" size="icon" onClick={handleSuggestCode} disabled={isSuggesting} aria-label="Suggest Test Code">
                            <Wand2 className={cn("h-4 w-4", isSuggesting && "animate-spin")} />
                        </Button>
                        </div>
                        <FormMessage />
                    </FormItem>
                )} />
                <FormField control={form.control} name="materialTest" render={({ field }) => (
                    <FormItem><FormLabel>Material Test</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="accreditation" render={({ field }) => (
                    <FormItem><FormLabel>Accreditation</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <div className="grid grid-cols-2 gap-4">
                    <FormField control={form.control} name="unit" render={({ field }) => (
                        <FormItem><FormLabel>Unit</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="leadTimeDays" render={({ field }) => (
                        <FormItem><FormLabel>Lead Time (Days)</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <FormField control={form.control} name="amountUGX" render={({ field }) => (
                        <FormItem><FormLabel>Amount (UGX)</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="amountUSD" render={({ field }) => (
                        <FormItem><FormLabel>Amount (USD)</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                </div>
                <DialogFooter>
                    <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
                    <Button type="submit">Save Changes</Button>
                </DialogFooter>
            </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
