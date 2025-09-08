
'use client';

import * as React from 'react';
import { useToast } from '@/hooks/use-toast';
import type { User, Group } from '@/lib/types';
import { getUsers, getGroups, updateUser, createGroup, updateGroup, deleteGroup } from '../data';
import { GroupList } from './group-list';
import { UserTable } from './user-table';
import { Skeleton } from '@/components/ui/skeleton';

export function UserManagement() {
  const [users, setUsers] = React.useState<User[]>([]);
  const [groups, setGroups] = React.useState<Group[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [selectedGroup, setSelectedGroup] = React.useState<string>('all');
  const { toast } = useToast();

  const loadData = React.useCallback(async () => {
    setLoading(true);
    try {
      const [userData, groupData] = await Promise.all([getUsers(), getGroups()]);
      setUsers(userData);
      setGroups(groupData);
    } catch (error) {
      console.error('Failed to load admin data:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to load users and groups.',
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  React.useEffect(() => {
    loadData();
  }, [loadData]);

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

  const handleGroupSave = async (groupData: Partial<Group> & { id?: string }) => {
    try {
      if (groupData.id) {
        await updateGroup(groupData.id, groupData);
        toast({ title: 'Success', description: 'Group updated successfully.' });
      } else {
        await createGroup(groupData as Omit<Group, 'id'>);
        toast({ title: 'Success', description: 'Group created successfully.' });
      }
      loadData();
    } catch (error) {
      console.error('Failed to save group:', error);
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to save group.' });
    }
  };

  const handleGroupDelete = async (groupId: string) => {
    // Optional: Check if any users are in this group before deleting
    try {
      await deleteGroup(groupId);
      toast({ title: 'Success', description: 'Group deleted successfully.' });
      setSelectedGroup('all');
      loadData();
    } catch (error) {
      console.error('Failed to delete group:', error);
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to delete group.' });
    }
  };

  const filteredUsers = React.useMemo(() => {
    if (selectedGroup === 'all') {
      return users;
    }
    return users.filter((user) => user.group === selectedGroup);
  }, [users, selectedGroup]);

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
      <GroupList
        groups={groups}
        selectedGroup={selectedGroup}
        onSelectGroup={setSelectedGroup}
        onSave={handleGroupSave}
        onDelete={handleGroupDelete}
      />
      <UserTable
        users={filteredUsers}
        groups={groups}
        onUserUpdate={handleUserUpdate}
      />
    </div>
  );
}
