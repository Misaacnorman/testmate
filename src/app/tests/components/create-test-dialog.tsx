
'use client';

import * as React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Loader2, Wand2 } from 'lucide-react';
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

// Mock AI function
const suggestTestCode = async (material: string, method: string): Promise<string> => {
    return new Promise(resolve => {
        setTimeout(() => {
            const materialCode = material.substring(0, 2).toUpperCase();
            const methodCode = method.substring(0, 2).toUpperCase();
            const randomNum = Math.floor(100 + Math.random() * 900);
            resolve(`${materialCode}${methodCode}-${randomNum}`);
        }, 500);
    });
};


const testSchema = z.object({
  id: z.string().min(1, 'Test Code is required.'),
  name: z.string().min(1, 'Test Name is required.'),
  material: z.string().min(1, 'Material is required.'),
  method: z.string().min(1, 'Method is required.'),
  turnAroundTime: z.string().min(1, 'Turnaround Time is required.'),
  price: z.preprocess(
    (a) => parseFloat(z.string().parse(a)),
    z.number().positive('Price must be a positive number.')
  ),
  isAccredited: z.boolean(),
});

type TestFormValues = z.infer<typeof testSchema>;

interface CreateTestDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: Omit<Test, 'id'>) => void;
  processing: boolean;
}

export function CreateTestDialog({ open, onOpenChange, onSubmit, processing }: CreateTestDialogProps) {
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
    },
  });

  const [suggesting, setSuggesting] = React.useState(false);

  const handleSuggestCode = async () => {
    setSuggesting(true);
    const material = form.getValues('material');
    const method = form.getValues('method');
    if (material && method) {
      const code = await suggestTestCode(material, method);
      form.setValue('id', code);
    }
    setSuggesting(false);
  };
  
  const handleSubmit = (data: TestFormValues) => {
    const { id, ...rest } = data; // id is handled by parent, so we omit it
    onSubmit({ ...rest, id: data.id });
  };
  

  React.useEffect(() => {
    if (!open) {
      form.reset();
    }
  }, [open, form]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Test</DialogTitle>
          <DialogDescription>
            Fill in the details to add a new test to the catalog.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <div className="flex items-end gap-2">
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
                <Button type="button" variant="outline" size="icon" onClick={handleSuggestCode} disabled={suggesting}>
                  {suggesting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Wand2 className="h-4 w-4" />}
                  <span className="sr-only">Suggest Code</span>
                </Button>
            </div>
            
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Test Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Complete Blood Count" {...field} />
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
                  <FormLabel>Material</FormLabel>
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
                  <FormLabel>Method</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Automated Hematology" {...field} />
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
                  <FormLabel>Turnaround Time</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., 24 hours" {...field} />
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
                  <FormLabel>Price</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="e.g., 50.00" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="isAccredited"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
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
            <DialogFooter>
              <Button type="submit" disabled={processing}>
                {processing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Create Test
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
