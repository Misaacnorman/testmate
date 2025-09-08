
'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { DataTable } from './data-table';
import { getColumns } from './columns';
import type { User, Role } from '@/lib/types';
import { EditUserDialog } from './edit-user-dialog';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';

interface UserTableProps {
  users: User[];
  roles: Role[];
  onUserUpdate: (userId: string, data: Partial<User>) => void;
  onAddUser: () => void;
  onSuspend: (user: User) => void;
  onUnsuspend: (user: User) => void;
  selectedRole: string;
}

export function UserTable({ users, roles, onUserUpdate, onAddUser, onSuspend, onUnsuspend, selectedRole }: UserTableProps) {
  const [editingUser, setEditingUser] = React.useState<User | null>(null);

  const handleEdit = (user: User) => {
    setEditingUser(user);
  };

  const handleSave = (userId: string, data: Partial<User>) => {
    onUserUpdate(userId, data);
    setEditingUser(null);
  };
  
  const columns = React.useMemo(() => getColumns({ roles, onEdit: handleEdit, onSuspend, onUnsuspend }), [roles, onSuspend, onUnsuspend]);

  return (
    <Card className="h-full flex flex-col">
       <CardHeader className="flex flex-row items-center justify-between">
          <div/>
          {selectedRole !== 'all' && (
            <Button size="sm" onClick={onAddUser}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add User to Role
            </Button>
          )}
      </CardHeader>
      <CardContent className="flex-grow p-0">
        <DataTable columns={columns} data={users} />
      </CardContent>
      {editingUser && (
        <EditUserDialog
            open={!!editingUser}
            onOpenChange={() => setEditingUser(null)}
            user={editingUser}
            roles={roles}
            onSave={handleSave}
        />
      )}
    </Card>
  );
}
