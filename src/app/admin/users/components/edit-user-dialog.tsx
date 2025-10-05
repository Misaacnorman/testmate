
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
import { Label } from "@/components/ui/label";
import { Loader2, ShieldAlert, ShieldCheck, ShieldQuestion } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { type User, type Role, type PermissionGroup } from "@/lib/types";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

type PermissionState = 'granted' | 'revoked' | 'default';

interface EditUserDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { roleId: string; grantedPermissions: string[]; revokedPermissions: string[]; }) => Promise<void>;
  user: User;
  roles: Role[];
  permissionGroups: PermissionGroup[];
}

export function EditUserDialog({ isOpen, onClose, onSubmit, user, roles, permissionGroups }: EditUserDialogProps) {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [roleId, setRoleId] = React.useState(user.roleId || "none");
  const [granted, setGranted] = React.useState<string[]>(user.grantedPermissions || []);
  const [revoked, setRevoked] = React.useState<string[]>(user.revokedPermissions || []);

  const rolePermissions = React.useMemo(() => {
    const role = roles.find(r => r.id === roleId);
    return new Set(role?.permissions || []);
  }, [roleId, roles]);

  React.useEffect(() => {
    if (user) {
      setRoleId(user.roleId || "none");
      setGranted(user.grantedPermissions || []);
      setRevoked(user.revokedPermissions || []);
    }
  }, [user, isOpen]);

  const getPermissionState = (permissionId: string): PermissionState => {
    if (granted.includes(permissionId)) return 'granted';
    if (revoked.includes(permissionId)) return 'revoked';
    return 'default';
  }

  const handlePermissionToggle = (permissionId: string) => {
    const currentState = getPermissionState(permissionId);
    const hasRolePerm = rolePermissions.has(permissionId);

    if (currentState === 'default' && hasRolePerm) { // Revoke role permission
        setRevoked([...revoked, permissionId]);
        setGranted(granted.filter(p => p !== permissionId));
    } else if (currentState === 'default' && !hasRolePerm) { // Grant new permission
        setGranted([...granted, permissionId]);
        setRevoked(revoked.filter(p => p !== permissionId));
    } else if (currentState === 'revoked') { // Back to default (role has it)
        setRevoked(revoked.filter(p => p !== permissionId));
    } else if (currentState === 'granted') { // Back to default (role doesn't have it)
        setGranted(granted.filter(p => p !== permissionId));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const finalRoleId = roleId === 'none' ? '' : roleId;
    await onSubmit({ roleId: finalRoleId, grantedPermissions: granted, revokedPermissions: revoked });
    setIsSubmitting(false);
  };
  
  const permissionStatusIcons: Record<PermissionState, React.ReactNode> = {
    granted: <ShieldCheck className="h-4 w-4 text-green-500" title="Granted" />,
    revoked: <ShieldAlert className="h-4 w-4 text-red-500" title="Revoked" />,
    default: <ShieldQuestion className="h-4 w-4 text-muted-foreground" title="Inherited from Role" />,
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Edit User: {user.name}</DialogTitle>
          <DialogDescription>
            Change the user's role and set individual permission overrides.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex-grow flex flex-col overflow-hidden">
          <div className="space-y-4 py-4 flex-grow overflow-auto pr-6 -mr-6">
            <div className="space-y-2">
              <Label>Assign to Role</Label>
              <Select onValueChange={setRoleId} value={roleId}>
                <SelectTrigger>
                  <SelectValue placeholder="No role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No Role</SelectItem>
                  {roles.map(role => (
                    <SelectItem key={role.id} value={role.id}>{role.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Individual Permission Overrides</Label>
              <div className="text-xs text-muted-foreground flex gap-4">
                  <span><ShieldQuestion className="inline h-3 w-3 mr-1"/>Inherited</span>
                  <span><ShieldCheck className="inline h-3 w-3 mr-1 text-green-500"/>Granted</span>
                  <span><ShieldAlert className="inline h-3 w-3 mr-1 text-red-500"/>Revoked</span>
              </div>
              <ScrollArea className="h-[45vh] rounded-md border">
                  <Accordion type="multiple" className="w-full" defaultValue={permissionGroups.map(g => g.id)}>
                      {permissionGroups.map(group => (
                      <AccordionItem value={group.id} key={group.id}>
                          <AccordionTrigger className="font-semibold text-base px-4">{group.label}</AccordionTrigger>
                          <AccordionContent className="p-2">
                          <div className="grid grid-cols-2 gap-x-4 gap-y-2 pl-4">
                              {group.permissions.map(permission => {
                                  const state = getPermissionState(permission.id);
                                  const hasRolePerm = rolePermissions.has(permission.id);
                                  const isChecked = (state === 'default' && hasRolePerm) || state === 'granted';

                                  return (
                                     <div key={permission.id} className="flex items-center gap-2">
                                          <Checkbox
                                            id={`perm-${permission.id}`}
                                            checked={isChecked}
                                            onCheckedChange={() => handlePermissionToggle(permission.id)}
                                            disabled={isSubmitting}
                                            aria-label={permission.label}
                                          />
                                          {permissionStatusIcons[state]}
                                          <Label htmlFor={`perm-${permission.id}`} className="font-normal text-sm cursor-pointer">
                                              {permission.label}
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
          <DialogFooter className="pt-4 border-t">
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
