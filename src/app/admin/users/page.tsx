
"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { collection, getDocs, doc, updateDoc, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { User, Role } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { CreateUserDialog } from './components/create-user-dialog';
import { EditUserDialog } from './components/edit-user-dialog';
import { useToast } from '@/hooks/use-toast';
import { UsersDataTable } from './components/user-data-table';
import { getColumns } from './components/user-columns';
import { useAuth } from '@/context/auth-context';
import { HasPermission } from '@/components/auth/has-permission';
import { PERMISSION_GROUPS } from '@/lib/permissions';

export default function AdminUsersPage() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);

  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { laboratoryId } = useAuth();

  const fetchData = useCallback(async () => {
    if (!laboratoryId) return;
    setLoading(true);
    
    try {
      // Fetch users and roles that belong to the same laboratory
      const [usersSnapshot, rolesSnapshot] = await Promise.all([
        getDocs(query(collection(db, "users"), where("laboratoryId", "==", laboratoryId))),
        getDocs(query(collection(db, "roles"), where("laboratoryId", "==", laboratoryId))),
      ]);

      const usersData = usersSnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          uid: doc.id,
          name: data.name,
          email: data.email,
          photoURL: data.photoURL,
          status: data.status,
          createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : new Date(data.createdAt).toISOString(),
          laboratoryId: data.laboratoryId,
          roleId: data.roleId,
          grantedPermissions: data.grantedPermissions || [],
          revokedPermissions: data.revokedPermissions || [],
        } as User;
      });

      const rolesData = rolesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Role));

      setUsers(usersData);
      setRoles(rolesData);
    } catch (error) {
      console.error("Error fetching data: ", error);
      toast({
        variant: "destructive",
        title: "Failed to fetch data",
        description: "Could not load data from Firestore.",
      });
    } finally {
      setLoading(false);
    }
  }, [toast, laboratoryId]);

  useEffect(() => {
    if(laboratoryId) {
      fetchData();
    }
  }, [fetchData, laboratoryId]);


  const handleUserCreated = () => {
    setIsCreateDialogOpen(false);
    fetchData();
  };
  
  const openEditDialog = (user: User) => {
    setEditingUser(user);
    setIsEditDialogOpen(true);
  };
  
  const handleUserUpdated = async (updatedData: { roleId: string; grantedPermissions: string[]; revokedPermissions: string[]; }) => {
    if (!editingUser) return;

    try {
        const userRef = doc(db, "users", editingUser.uid);
        await updateDoc(userRef, updatedData);
        toast({ title: "User Updated", description: "The user has been updated successfully." });
        fetchData();
        setIsEditDialogOpen(false);
        setEditingUser(null);
    } catch (error) {
        console.error("Error updating user:", error);
        toast({ variant: "destructive", title: "Update Failed", description: "Could not update the user." });
    }
  };


  const columns = getColumns({ onEdit: openEditDialog, roles });

  return (
    <div className="space-y-6">
       <div className="flex items-center justify-between">
            <div>
                <h1 className="text-2xl font-bold">User Management</h1>
                <p className="text-muted-foreground">
                  View, create, and edit users in your laboratory.
                </p>
            </div>
            <HasPermission permissionId="users:create">
                <Button onClick={() => setIsCreateDialogOpen(true)}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Create User
                </Button>
            </HasPermission>
       </div>
      
       <UsersDataTable columns={columns} data={users} loading={loading} />

      <CreateUserDialog 
        isOpen={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
        onUserCreated={handleUserCreated}
        roles={roles}
      />
      
      {editingUser && (
        <EditUserDialog
            isOpen={isEditDialogOpen}
            onClose={() => setIsEditDialogOpen(false)}
            user={editingUser}
            roles={roles}
            permissionGroups={PERMISSION_GROUPS}
            onSubmit={handleUserUpdated}
        />
      )}
    </div>
  );
}
