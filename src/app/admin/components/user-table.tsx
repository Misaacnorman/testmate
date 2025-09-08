
'use client';

import * as React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { DataTable } from './data-table';
import { getColumns } from './columns';
import type { User, Role } from '@/lib/types';
import { EditUserDialog } from './edit-user-dialog';

interface UserTableProps {
  users: User[];
  roles: Role[];
  onUserUpdate: (userId: string, data: Partial<User>) => void;
}

export function UserTable({ users, roles, onUserUpdate }: UserTableProps) {
  const [editingUser, setEditingUser] = React.useState<User | null>(null);

  const handleEdit = (user: User) => {
    setEditingUser(user);
  };

  const handleSave = (userId: string, data: Partial<User>) => {
    onUserUpdate(userId, data);
    setEditingUser(null);
  };
  
  const columns = React.useMemo(() => getColumns({ roles, onEdit: handleEdit }), [roles]);

  return (
    <Card className="h-full flex flex-col">
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
