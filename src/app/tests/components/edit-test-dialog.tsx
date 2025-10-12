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
import { Switch } from "@/components/ui/switch";
import { Loader2 } from "lucide-react";

interface EditTestDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Test) => Promise<void>;
  test: Test;
}

export function EditTestDialog({
  isOpen,
  onClose,
  onSubmit,
  test,
}: EditTestDialogProps) {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const form = useForm<Test>({
    resolver: zodResolver(testSchema),
    defaultValues: test,
  });

  React.useEffect(() => {
    form.reset(test);
  }, [test, form]);

  const handleFormSubmit = async (data: Test) => {
    setIsSubmitting(true);
    await onSubmit({ ...data, id: test.id });
    setIsSubmitting(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Test</DialogTitle>
          <DialogDescription>
            Update the details for the test.
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
                        <Input placeholder="e.g., Soil" {...field} value={field.value ?? ""} />
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
                        <Input placeholder="e.g., SO-01" {...field} value={field.value ?? ""} />
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
                    <Input placeholder="e.g., Atterberg Limits" {...field} value={field.value ?? ""} />
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
                    <Input placeholder="e.g., BS 1377-2" {...field} value={field.value ?? ""} />
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
                        <Input placeholder="e.g., No." {...field} value={field.value ?? ""} />
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
                        <Input type="number" {...field} value={field.value ?? 0} onChange={e => field.onChange(Number(e.target.value))}/>
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
                        <Input type="number" {...field} value={field.value ?? 0} onChange={e => field.onChange(Number(e.target.value))}/>
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
                        <Input type="number" {...field} value={field.value ?? 0} onChange={e => field.onChange(Number(e.target.value))}/>
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
                <FormItem className="flex flex-row items-center justify-between space-x-3 space-y-0 rounded-md border p-4">
                  <div className="space-y-1 leading-none">
                    <FormLabel>
                      Accreditation Status
                    </FormLabel>
                    <p className="text-sm text-muted-foreground">
                      {field.value ? "Accredited" : "Not Accredited"}
                    </p>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
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
                Save Changes
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
