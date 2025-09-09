
'use client';

import * as React from 'react';
import { useToast } from '@/hooks/use-toast';
import type { User, Role } from '@/lib/types';
import { getUsers, getRoles, updateUser, createRole, updateRole, deleteRole, updateUserStatus, createUser } from '../data';
import { RoleList } from './role-list';
import { UserTable } from './user-table';
import { Skeleton } from '@/components/ui/skeleton';
import { AddUserDialog } from './add-user-dialog';

export function UserManagement() {
  const [users, setUsers] = React.useState<User[]>([]);
  const [roles, setRoles] = React.useState<Role[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [selectedRole, setSelectedRole] = React.useState<string>('all');
  const [isAddUserDialogOpen, setAddUserDialogOpen] = React.useState(false);
  const { toast } = useToast();

  const loadData = React.useCallback(async () => {
    setLoading(true);
    try {
      const [userData, roleData] = await Promise.all([getUsers(), getRoles()]);
      setUsers(userData);
      setRoles(roleData);
    } catch (error) {
      console.error('Failed to load admin data:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to load users and roles.',
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  React.useEffect(() => {
    loadData();
  }, [loadData]);
  
  const handleAddUser = async (userData: Omit<User, 'id' | 'createdAt'>) => {
    try {
      await createUser(userData);
      toast({ title: 'Success', description: 'User created successfully. They will need to set their password via email.' });
      setAddUserDialogOpen(false);
      loadData();
    } catch (error) {
      console.error('Failed to create user:', error);
      toast({ variant: 'destructive', title: 'Error', description: (error as Error).message || 'Failed to create user.' });
    }
  };

  const handleUserUpdate = async (userId: string, data: Partial<User>) => {
    try {
      await updateUser(userId, data);
      toast({ title: 'Success', description: 'User updated successfully.' });
      loadData();
    } catch (error) {
      console.error('Failed to update user:', error);
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to update user.' });
    }
  };

  const handleRoleSave = async (roleData: Partial<Role> & { id?: string }) => {
    try {
      if (roleData.id) {
        await updateRole(roleData.id, roleData);
        toast({ title: 'Success', description: 'Role updated successfully.' });
      } else {
        await createRole(roleData as Omit<Role, 'id'>);
        toast({ title: 'Success', description: 'Role created successfully.' });
      }
      loadData();
    } catch (error) {
      console.error('Failed to save role:', error);
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to save role.' });
    }
  };

  const handleRoleDelete = async (roleId: string) => {
    // Optional: Check if any users are in this role before deleting
    try {
      await deleteRole(roleId);
      toast({ title: 'Success', description: 'Role deleted successfully.' });
      setSelectedRole('all');
      loadData();
    } catch (error) {
      console.error('Failed to delete role:', error);
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to delete role.' });
    }
  };

  const handleSuspend = async (user: User) => {
    try {
      await updateUserStatus(user.id, true);
      toast({ title: 'Success', description: `User ${user.displayName} has been suspended.` });
      loadData();
    } catch (error) {
      console.error('Failed to suspend user:', error);
      toast({ variant: 'destructive', title: 'Error', description: (error as Error).message || 'Failed to suspend user.' });
    }
  };
  
  const handleUnsuspend = async (user: User) => {
    try {
      await updateUserStatus(user.id, false);
      toast({ title: 'Success', description: `User ${user.displayName} has been re-enabled.` });
      loadData();
    } catch (error) {
      console.error('Failed to re-enable user:', error);
      toast({ variant: 'destructive', title: 'Error', description: (error as Error).message || 'Failed to re-enable user.' });
    }
  };

  const filteredUsers = React.useMemo(() => {
    if (selectedRole === 'all') {
      return users;
    }
    return users.filter((user) => user.role === selectedRole);
  }, [users, selectedRole]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-4 h-full">
        <Skeleton className="h-full w-full" />
        <Skeleton className="h-full w-full" />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-4 h-full">
      <RoleList
        roles={roles}
        selectedRole={selectedRole}
        onSelectRole={setSelectedRole}
        onSave={handleRoleSave}
        onDelete={handleRoleDelete}
      />
      <UserTable
        users={filteredUsers}
        roles={roles}
        onUserUpdate={handleUserUpdate}
        onAddUser={() => setAddUserDialogOpen(true)}
        onSuspend={handleSuspend}
        onUnsuspend={handleUnsuspend}
        selectedRole={selectedRole}
      />
      <AddUserDialog
        open={isAddUserDialogOpen}
        onOpenChange={setAddUserDialogOpen}
        roles={roles}
        onSubmit={handleAddUser}
        defaultRoleId={selectedRole !== 'all' ? selectedRole : undefined}
      />
    </div>
  );
}
