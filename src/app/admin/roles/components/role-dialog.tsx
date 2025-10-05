
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
import { type Role, type PermissionGroup } from "@/lib/types";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

interface RoleDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { name: string; permissions: string[] }) => Promise<void>;
  role: Role | null;
  permissionGroups: PermissionGroup[];
}

export function RoleDialog({ isOpen, onClose, onSubmit, role, permissionGroups }: RoleDialogProps) {
  const [name, setName] = React.useState("");
  const [selectedPermissions, setSelectedPermissions] = React.useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  React.useEffect(() => {
    if (isOpen) {
        if (role) {
            setName(role.name);
            setSelectedPermissions(role.permissions || []);
        } else {
            setName("");
            setSelectedPermissions([]);
        }
    }
  }, [role, isOpen]);

  const handlePermissionToggle = (permissionId: string) => {
    setSelectedPermissions(prev =>
      prev.includes(permissionId) ? prev.filter(id => id !== permissionId) : [...prev, permissionId]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await onSubmit({ name, permissions: selectedPermissions });
    setIsSubmitting(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>{role ? "Edit Role" : "Create Role"}</DialogTitle>
          <DialogDescription>
            {role ? "Update the role's name and assigned permissions." : "Create a new role and assign permissions to it."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex-grow flex flex-col overflow-hidden">
            <div className="space-y-4 py-4 flex-grow overflow-auto pr-4">
                <div className="space-y-2">
                    <Label htmlFor="role-name">Role Name</Label>
                    <Input
                    id="role-name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g., Report Viewer"
                    disabled={isSubmitting}
                    />
                </div>
                <div className="space-y-2">
                    <Label>Assign Permissions</Label>
                    <ScrollArea className="h-full rounded-md border p-2">
                         <Accordion type="multiple" className="w-full" defaultValue={permissionGroups.map(g => g.id)}>
                            {permissionGroups.map(group => (
                            <AccordionItem value={group.id} key={group.id}>
                                <AccordionTrigger className="font-semibold text-base">{group.label}</AccordionTrigger>
                                <AccordionContent className="p-2">
                                <div className="grid grid-cols-2 gap-4 pl-2">
                                    {group.permissions.map(permission => (
                                    <div key={permission.id} className="flex items-center gap-2">
                                        <Checkbox
                                        id={`perm-${permission.id}`}
                                        checked={selectedPermissions.includes(permission.id)}
                                        onCheckedChange={() => handlePermissionToggle(permission.id)}
                                        disabled={isSubmitting}
                                        />
                                        <Label htmlFor={`perm-${permission.id}`} className="font-normal text-sm">
                                        {permission.label}
                                        </Label>
                                    </div>
                                    ))}
                                </div>
                                </AccordionContent>
                            </AccordionItem>
                            ))}
                        </Accordion>
                    </ScrollArea>
                </div>
            </div>
            <DialogFooter className="pt-4 border-t">
                <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
                Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting || !name.trim()}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {role ? "Save Changes" : "Create Role"}
                </Button>
            </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
