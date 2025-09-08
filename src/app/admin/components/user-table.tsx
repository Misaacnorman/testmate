
'use client';

import * as React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { DataTable } from './data-table';
import { getColumns } from './columns';
import type { User, Group } from '@/lib/types';
import { EditUserDialog } from './edit-user-dialog';

interface UserTableProps {
  users: User[];
  groups: Group[];
  onUserUpdate: (userId: string, data: Partial<User>) => void;
}

export function UserTable({ users, groups, onUserUpdate }: UserTableProps) {
  const [editingUser, setEditingUser] = React.useState<User | null>(null);

  const handleEdit = (user: User) => {
    setEditingUser(user);
  };

  const handleSave = (userId: string, data: Partial<User>) => {
    onUserUpdate(userId, data);
    setEditingUser(null);
  };
  
  const columns = React.useMemo(() => getColumns({ groups, onEdit: handleEdit }), [groups]);

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
            groups={groups}
            onSave={handleSave}
        />
      )}
    </Card>
  );
}
