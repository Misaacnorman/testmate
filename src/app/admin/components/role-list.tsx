
'use client';

import * as React from 'react';
import { Users, Shield, PlusCircle, MoreVertical, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { Role } from '@/lib/types';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { EditRoleDialog } from './edit-role-dialog';

interface RoleListProps {
  roles: Role[];
  selectedRole: string;
  onSelectRole: (roleId: string) => void;
  onSave: (role: Partial<Role> & { id?: string }) => void;
  onDelete: (roleId: string) => void;
}

export function RoleList({ roles, selectedRole, onSelectRole, onSave, onDelete }: RoleListProps) {
  const [isEditDialogOpen, setEditDialogOpen] = React.useState(false);
  const [editingRole, setEditingRole] = React.useState<Role | null>(null);

  const handleEdit = (role: Role) => {
    setEditingRole(role);
    setEditDialogOpen(true);
  };
  
  const handleCreate = () => {
    setEditingRole(null);
    setEditDialogOpen(true);
  }

  const handleKeyDown = (event: React.KeyboardEvent, roleId: string) => {
    if (event.key === 'Enter' || event.key === ' ') {
      onSelectRole(roleId);
    }
  };


  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg">Roles</CardTitle>
        <Button size="sm" variant="ghost" onClick={handleCreate}>
          <PlusCircle className="mr-2 h-4 w-4" />
          New
        </Button>
      </CardHeader>
      <CardContent className="p-2">
        <nav className="flex flex-col gap-1">
          <div
            role="button"
            tabIndex={0}
            onClick={() => onSelectRole('all')}
            onKeyDown={(e) => handleKeyDown(e, 'all')}
            className={cn(
              'flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary cursor-pointer focus:outline-none focus:ring-2 focus:ring-ring',
              selectedRole === 'all' && 'bg-accent text-primary font-semibold'
            )}
          >
            <Users className="h-5 w-5" />
            <span>All Users</span>
          </div>
          {roles.map((role) => (
            <div
              key={role.id}
              onClick={() => onSelectRole(role.id)}
              onKeyDown={(e) => handleKeyDown(e, role.id)}
              role="button"
              tabIndex={0}
              className={cn(
                'group flex items-center justify-between gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary cursor-pointer focus:outline-none focus:ring-2 focus:ring-ring',
                selectedRole === role.id && 'bg-accent text-primary font-semibold'
              )}
            >
              <div className="flex items-center gap-3">
                <Shield className="h-5 w-5" />
                <span>{role.name}</span>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                   <Button variant="ghost" size="icon" className="h-6 w-6 opacity-0 group-hover:opacity-100" onClick={(e) => e.stopPropagation()}>
                        <MoreVertical className="h-4 w-4" />
                   </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent onClick={(e) => e.stopPropagation()}>
                    <DropdownMenuItem onClick={() => handleEdit(role)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                    </DropdownMenuItem>
                     <DropdownMenuItem onClick={() => onDelete(role.id)} className="text-destructive">
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                    </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ))}
        </nav>
      </CardContent>
      <EditRoleDialog 
        open={isEditDialogOpen}
        onOpenChange={setEditDialogOpen}
        role={editingRole}
        onSave={onSave}
      />
    </Card>
  );
}
