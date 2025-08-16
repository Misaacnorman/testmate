
'use client';

import * as React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import type { Test } from '@/lib/types';
import { ScrollArea } from '@/components/ui/scroll-area';

const testSchema = z.object({
  id: z.string().min(1, 'Test Code is required.').refine(s => !s.includes('/'), {
    message: "Test Code cannot contain forward slashes ('/')."
  }),
  name: z.string().min(1, 'Test Name is required.'),
  material: z.string().min(1, 'Material Category is required.'),
  method: z.string().min(1, 'Method is required.'),
  turnAroundTime: z.string().min(1, 'Lead Time is required.'),
  price: z.preprocess(
    (a) => parseFloat(z.string().parse(a)),
    z.number().positive('Price must be a positive number.')
  ),
  isAccredited: z.boolean(),
  unit: z.string().min(1, 'Unit is required.'),
  priceUGX: z.preprocess(
    (a) => parseFloat(z.string().parse(a)),
    z.number().positive('Price (UGX) must be a positive number.')
  ),
});

type TestFormValues = z.infer<typeof testSchema>;

interface CreateTestDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: Test) => void;
  processing: boolean;
}

export function CreateTestDialog({
  open,
  onOpenChange,
  onSubmit,
  processing,
}: CreateTestDialogProps) {
  const form = useForm<TestFormValues>({
    resolver: zodResolver(testSchema),
    defaultValues: {
      id: '',
      name: '',
      material: '',
      method: '',
      turnAroundTime: '',
      price: 0,
      isAccredited: false,
      unit: '',
      priceUGX: 0,
    },
  });

  const handleSubmit = (data: TestFormValues) => {
    onSubmit(data);
  };

  React.useEffect(() => {
    if (!open) {
      form.reset();
    }
  }, [open, form]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>Create New Test</DialogTitle>
          <DialogDescription>
            Fill in the details to add a new test to the catalog.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)}>
            <ScrollArea className="h-[60vh] p-1">
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-6">
                  <FormField
                    control={form.control}
                    name="id"
                    render={({ field }) => (
                      <FormItem className="flex-grow">
                        <FormLabel>Test Code</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., BLHE-101" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Material Test</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g., Complete Blood Count"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="material"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Material Category</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Blood" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="method"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Test Method(s)</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g., Automated Hematology"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="space-y-6">
                  <FormField
                    control={form.control}
                    name="unit"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Unit</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., mg/dL" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="turnAroundTime"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Lead Time (Days)</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., 2" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="priceUGX"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Amount (UGX)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="e.g., 185000"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Amount (USD)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="e.g., 50.00"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="isAccredited"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm mt-8">
                        <div className="space-y-0.5">
                          <FormLabel>Accredited Test</FormLabel>
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
                </div>
              </div>
            </ScrollArea>
            <DialogFooter className="pt-6 px-6 pb-6 border-t">
              <Button type="submit" disabled={processing}>
                {processing && (
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
