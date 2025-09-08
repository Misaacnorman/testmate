
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
import type { Role } from '@/lib/types';
import { PERMISSIONS, PERMISSION_ROLES } from '@/lib/permissions';

const roleSchema = z.object({
  name: z.string().min(1, 'Role name is required'),
  permissions: z.array(z.string()),
});

type FormValues = z.infer<typeof roleSchema>;

interface EditRoleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  role: Role | null;
  onSave: (data: Partial<Role> & { id?: string }) => void;
}

export function EditRoleDialog({ open, onOpenChange, role, onSave }: EditRoleDialogProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(roleSchema),
    defaultValues: {
      name: '',
      permissions: [],
    },
  });

  React.useEffect(() => {
    if (role) {
      form.reset({
        name: role.name,
        permissions: role.permissions || [],
      });
    } else {
      form.reset({
        name: '',
        permissions: [],
      });
    }
  }, [role, form]);

  const handleSubmit = (data: FormValues) => {
    onSave({ ...data, id: role?.id });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{role ? `Edit Role: ${role.name}` : 'Create New Role'}</DialogTitle>
          <DialogDescription>
            Manage the permissions associated with this role.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Role Name</Label>
              <Input {...form.register('name')} />
              {form.formState.errors.name && (
                <p className="text-destructive text-xs">{form.formState.errors.name.message}</p>
              )}
            </div>

            <Label>Permissions</Label>
            <ScrollArea className="h-72 w-full rounded-md border p-4">
               <Accordion type="multiple" className="w-full">
                {PERMISSION_ROLES.map((pRole) => (
                    <AccordionItem key={pRole} value={pRole}>
                        <AccordionTrigger className="font-semibold">{pRole}</AccordionTrigger>
                        <AccordionContent>
                           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                             {PERMISSIONS.filter(p => p.role === pRole).map((permission) => (
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
