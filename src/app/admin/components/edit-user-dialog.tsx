
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
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import type { User, Role } from '@/lib/types';
import { PERMISSIONS, PERMISSION_ROLES } from '@/lib/permissions';
import { ScrollArea } from '@/components/ui/scroll-area';

const userSchema = z.object({
  role: z.string().min(1, 'Role is required'),
  overrides: z.object({
    add: z.array(z.string()),
    remove: z.array(z.string()),
  }),
});

type FormValues = z.infer<typeof userSchema>;

interface EditUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: User;
  roles: Role[];
  onSave: (userId: string, data: Partial<User>) => void;
}

export function EditUserDialog({ open, onOpenChange, user, roles, onSave }: EditUserDialogProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      role: user.role || '',
      overrides: {
        add: user.overrides?.add || [],
        remove: user.overrides?.remove || [],
      },
    },
  });

  React.useEffect(() => {
    form.reset({
      role: user.role || '',
      overrides: {
        add: user.overrides?.add || [],
        remove: user.overrides?.remove || [],
      },
    });
  }, [user, form]);
  
  const selectedRoleId = form.watch('role');
  const selectedRole = React.useMemo(() => roles.find(g => g.id === selectedRoleId), [roles, selectedRoleId]);
  const rolePermissions = React.useMemo(() => selectedRole?.permissions || [], [selectedRole]);


  const handleSubmit = (data: FormValues) => {
    onSave(user.id, data);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Manage User: {user.displayName}</DialogTitle>
          <DialogDescription>{user.email}</DialogDescription>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(handleSubmit)}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
            <div className="space-y-4">
              <Label>User Role</Label>
              <Controller
                control={form.control}
                name="role"
                render={({ field }) => (
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                    <SelectContent>
                      {roles.map((role) => (
                        <SelectItem key={role.id} value={role.id}>
                          {role.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
            
            <div className="space-y-2">
                <Label>Permission Overrides</Label>
                <p className="text-xs text-muted-foreground">Add or remove specific permissions for this user only.</p>
            </div>

            <div className="md:col-span-2 space-y-2">
                 <ScrollArea className="h-72 w-full rounded-md border p-4">
               <Accordion type="multiple" className="w-full">
                {PERMISSION_ROLES.map((pRole) => (
                    <AccordionItem key={pRole} value={pRole}>
                        <AccordionTrigger className="font-semibold">{pRole}</AccordionTrigger>
                        <AccordionContent>
                           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                             {PERMISSIONS.filter(p => p.role === pRole).map((permission) => {
                                const isInRole = rolePermissions.includes(permission.id);
                                const isAdded = form.watch('overrides.add').includes(permission.id);
                                const isRemoved = form.watch('overrides.remove').includes(permission.id);
                                
                                const isChecked = (isInRole && !isRemoved) || isAdded;

                                return (
                                <div key={permission.id} className="flex items-center space-x-3">
                                    <Checkbox 
                                        id={permission.id}
                                        checked={isChecked}
                                        onCheckedChange={(checked) => {
                                            const currentAdd = form.getValues('overrides.add');
                                            const currentRemove = form.getValues('overrides.remove');
                                            
                                            if (checked) {
                                                if (isInRole) {
                                                    form.setValue('overrides.remove', currentRemove.filter(p => p !== permission.id));
                                                } else {
                                                    form.setValue('overrides.add', [...currentAdd, permission.id]);
                                                }
                                            } else {
                                                if (isInRole) {
                                                    form.setValue('overrides.remove', [...currentRemove, permission.id]);
                                                } else {
                                                    form.setValue('overrides.add', currentAdd.filter(p => p !== permission.id));
                                                }
                                            }
                                        }}
                                    />
                                    <Label htmlFor={permission.id} className="text-sm font-normal flex flex-col">
                                       <span>{permission.description}</span>
                                       <span className="text-xs text-muted-foreground">({permission.id})</span>
                                    </Label>
                                </div>
                                )
                            })}
                           </div>
                        </AccordionContent>
                    </AccordionItem>
                ))}
               </Accordion>
            </ScrollArea>
            </div>

          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Save Changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
