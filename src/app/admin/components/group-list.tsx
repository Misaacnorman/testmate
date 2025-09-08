
'use client';

import * as React from 'react';
import { Users, Shield, PlusCircle, MoreVertical, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { Group } from '@/lib/types';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { EditGroupDialog } from './edit-group-dialog';

interface GroupListProps {
  groups: Group[];
  selectedGroup: string;
  onSelectGroup: (groupId: string) => void;
  onSave: (group: Partial<Group> & { id?: string }) => void;
  onDelete: (groupId: string) => void;
}

export function GroupList({ groups, selectedGroup, onSelectGroup, onSave, onDelete }: GroupListProps) {
  const [isEditDialogOpen, setEditDialogOpen] = React.useState(false);
  const [editingGroup, setEditingGroup] = React.useState<Group | null>(null);

  const handleEdit = (group: Group) => {
    setEditingGroup(group);
    setEditDialogOpen(true);
  };
  
  const handleCreate = () => {
    setEditingGroup(null);
    setEditDialogOpen(true);
  }

  const handleKeyDown = (event: React.KeyboardEvent, groupId: string) => {
    if (event.key === 'Enter' || event.key === ' ') {
      onSelectGroup(groupId);
    }
  };


  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg">Groups</CardTitle>
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
            onClick={() => onSelectGroup('all')}
            onKeyDown={(e) => handleKeyDown(e, 'all')}
            className={cn(
              'flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary cursor-pointer focus:outline-none focus:ring-2 focus:ring-ring',
              selectedGroup === 'all' && 'bg-accent text-primary font-semibold'
            )}
          >
            <Users className="h-5 w-5" />
            <span>All Users</span>
          </div>
          {groups.map((group) => (
            <div
              key={group.id}
              onClick={() => onSelectGroup(group.id)}
              onKeyDown={(e) => handleKeyDown(e, group.id)}
              role="button"
              tabIndex={0}
              className={cn(
                'group flex items-center justify-between gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary cursor-pointer focus:outline-none focus:ring-2 focus:ring-ring',
                selectedGroup === group.id && 'bg-accent text-primary font-semibold'
              )}
            >
              <div className="flex items-center gap-3">
                <Shield className="h-5 w-5" />
                <span>{group.name}</span>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                   <Button variant="ghost" size="icon" className="h-6 w-6 opacity-0 group-hover:opacity-100" onClick={(e) => e.stopPropagation()}>
                        <MoreVertical className="h-4 w-4" />
                   </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent onClick={(e) => e.stopPropagation()}>
                    <DropdownMenuItem onClick={() => handleEdit(group)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                    </DropdownMenuItem>
                     <DropdownMenuItem onClick={() => onDelete(group.id)} className="text-destructive">
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                    </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ))}
        </nav>
      </CardContent>
      <EditGroupDialog 
        open={isEditDialogOpen}
        onOpenChange={setEditDialogOpen}
        group={editingGroup}
        onSave={onSave}
      />
    </Card>
  );
}
