"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { testSchema, Test } from "@/lib/types";
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
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";

interface CreateTestDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<Test, "id">) => Promise<void>;
}

type TestFormData = Omit<Test, "id">;

export function CreateTestDialog({
  isOpen,
  onClose,
  onSubmit,
}: CreateTestDialogProps) {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const form = useForm<TestFormData>({
    resolver: zodResolver(testSchema.omit({ id: true })),
    defaultValues: {
      materialCategory: "",
      testCode: "",
      materialTest: "",
      testMethod: "",
      accreditationStatus: false,
      unit: "",
      amountUGX: 0,
      amountUSD: 0,
      leadTimeDays: 0,
    },
  });

  const handleFormSubmit = async (data: TestFormData) => {
    setIsSubmitting(true);
    await onSubmit(data);
    setIsSubmitting(false);
    form.reset();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
        if (!open) {
            form.reset();
            onClose();
        }
    }}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Test</DialogTitle>
          <DialogDescription>
            Fill in the details for the new test.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <FormField
                control={form.control}
                name="materialCategory"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Material Category</FormLabel>
                    <FormControl>
                        <Input placeholder="e.g., Soil" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <FormField
                control={form.control}
                name="testCode"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Test Code</FormLabel>
                    <FormControl>
                        <Input placeholder="e.g., SO-01" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
            </div>
            <FormField
              control={form.control}
              name="materialTest"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Material Test</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Atterberg Limits" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="testMethod"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Test Method(s)</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., BS 1377-2" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <div className="grid grid-cols-2 gap-4">
                <FormField
                control={form.control}
                name="unit"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Unit</FormLabel>
                    <FormControl>
                        <Input placeholder="e.g., No." {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <FormField
                control={form.control}
                name="leadTimeDays"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Lead Time (Days)</FormLabel>
                    <FormControl>
                        <Input type="number" {...field} onChange={e => field.onChange(Number(e.target.value))}/>
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
            </div>
            <div className="grid grid-cols-2 gap-4">
                <FormField
                control={form.control}
                name="amountUGX"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Amount (UGX)</FormLabel>
                    <FormControl>
                        <Input type="number" {...field} onChange={e => field.onChange(Number(e.target.value))}/>
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <FormField
                control={form.control}
                name="amountUSD"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Amount (USD)</FormLabel>
                    <FormControl>
                        <Input type="number" {...field} onChange={e => field.onChange(Number(e.target.value))}/>
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
            </div>
             <FormField
              control={form.control}
              name="accreditationStatus"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>
                      Accredited
                    </FormLabel>
                  </div>
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Create Test
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
