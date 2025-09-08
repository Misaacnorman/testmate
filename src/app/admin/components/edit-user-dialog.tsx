
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
import type { User, Group } from '@/lib/types';
import { PERMISSIONS, PERMISSION_GROUPS } from '@/lib/permissions';
import { ScrollArea } from '@/components/ui/scroll-area';

const userSchema = z.object({
  group: z.string().min(1, 'Group is required'),
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
  groups: Group[];
  onSave: (userId: string, data: Partial<User>) => void;
}

export function EditUserDialog({ open, onOpenChange, user, groups, onSave }: EditUserDialogProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      group: user.group || '',
      overrides: {
        add: user.overrides?.add || [],
        remove: user.overrides?.remove || [],
      },
    },
  });

  React.useEffect(() => {
    form.reset({
      group: user.group || '',
      overrides: {
        add: user.overrides?.add || [],
        remove: user.overrides?.remove || [],
      },
    });
  }, [user, form]);
  
  const selectedGroupId = form.watch('group');
  const selectedGroup = React.useMemo(() => groups.find(g => g.id === selectedGroupId), [groups, selectedGroupId]);
  const groupPermissions = React.useMemo(() => selectedGroup?.permissions || [], [selectedGroup]);


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
              <Label>User Group</Label>
              <Controller
                control={form.control}
                name="group"
                render={({ field }) => (
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a group" />
                    </SelectTrigger>
                    <SelectContent>
                      {groups.map((group) => (
                        <SelectItem key={group.id} value={group.id}>
                          {group.name}
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
                {PERMISSION_GROUPS.map((pGroup) => (
                    <AccordionItem key={pGroup} value={pGroup}>
                        <AccordionTrigger className="font-semibold">{pGroup}</AccordionTrigger>
                        <AccordionContent>
                           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                             {PERMISSIONS.filter(p => p.group === pGroup).map((permission) => {
                                const isInGroup = groupPermissions.includes(permission.id);
                                const isAdded = form.watch('overrides.add').includes(permission.id);
                                const isRemoved = form.watch('overrides.remove').includes(permission.id);
                                
                                const isChecked = (isInGroup && !isRemoved) || isAdded;

                                return (
                                <div key={permission.id} className="flex items-center space-x-3">
                                    <Checkbox 
                                        id={permission.id}
                                        checked={isChecked}
                                        onCheckedChange={(checked) => {
                                            const currentAdd = form.getValues('overrides.add');
                                            const currentRemove = form.getValues('overrides.remove');
                                            
                                            if (checked) {
                                                if (isInGroup) {
                                                    form.setValue('overrides.remove', currentRemove.filter(p => p !== permission.id));
                                                } else {
                                                    form.setValue('overrides.add', [...currentAdd, permission.id]);
                                                }
                                            } else {
                                                if (isInGroup) {
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
