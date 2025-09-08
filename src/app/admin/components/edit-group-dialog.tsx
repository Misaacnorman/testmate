
'use client';

import * as React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Checkbox } from '@/components/ui/checkbox';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import type { Group } from '@/lib/types';
import { PERMISSIONS, PERMISSION_GROUPS } from '@/lib/permissions';

const groupSchema = z.object({
  name: z.string().min(1, 'Group name is required'),
  permissions: z.array(z.string()),
});

type FormValues = z.infer<typeof groupSchema>;

interface EditGroupDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  group: Group | null;
  onSave: (data: Partial<Group> & { id?: string }) => void;
}

export function EditGroupDialog({ open, onOpenChange, group, onSave }: EditGroupDialogProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(groupSchema),
    defaultValues: {
      name: '',
      permissions: [],
    },
  });

  React.useEffect(() => {
    if (group) {
      form.reset({
        name: group.name,
        permissions: group.permissions || [],
      });
    } else {
      form.reset({
        name: '',
        permissions: [],
      });
    }
  }, [group, form]);

  const handleSubmit = (data: FormValues) => {
    onSave({ ...data, id: group?.id });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{group ? `Edit Group: ${group.name}` : 'Create New Group'}</DialogTitle>
          <DialogDescription>
            Manage the permissions associated with this group.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Group Name</Label>
              <Input {...form.register('name')} />
              {form.formState.errors.name && (
                <p className="text-destructive text-xs">{form.formState.errors.name.message}</p>
              )}
            </div>

            <Label>Permissions</Label>
            <ScrollArea className="h-72 w-full rounded-md border p-4">
               <Accordion type="multiple" className="w-full">
                {PERMISSION_GROUPS.map((pGroup) => (
                    <AccordionItem key={pGroup} value={pGroup}>
                        <AccordionTrigger className="font-semibold">{pGroup}</AccordionTrigger>
                        <AccordionContent>
                           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                             {PERMISSIONS.filter(p => p.group === pGroup).map((permission) => (
                                <FormField
                                    key={permission.id}
                                    control={form.control}
                                    name="permissions"
                                    render={({ field }) => (
                                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                        <FormControl>
                                        <Checkbox
                                            checked={field.value?.includes(permission.id)}
                                            onCheckedChange={(checked) => {
                                            return checked
                                                ? field.onChange([...field.value, permission.id])
                                                : field.onChange(
                                                    field.value?.filter(
                                                    (value) => value !== permission.id
                                                    )
                                                )
                                            }}
                                        />
                                        </FormControl>
                                        <div className="space-y-1 leading-none">
                                            <FormLabel className="text-sm font-normal">
                                                {permission.description}
                                            </FormLabel>
                                            <p className="text-xs text-muted-foreground">({permission.id})</p>
                                        </div>
                                    </FormItem>
                                    )}
                                />
                             ))}
                           </div>
                        </AccordionContent>
                    </AccordionItem>
                ))}
               </Accordion>
            </ScrollArea>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Save Changes</Button>
          </DialogFooter>
        </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
