
"use client";

import * as React from "react";
import { collection, getDocs, doc, addDoc, updateDoc, writeBatch, deleteDoc, query, where, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Loader2, MoreHorizontal, PlusCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { type Role, type Permission } from "@/lib/types";
import { PERMISSION_GROUPS } from "@/lib/permissions";
import { RoleDialog } from "./components/role-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/context/auth-context";
import { HasPermission } from "@/components/auth/has-permission";

const allPermissions: Permission[] = PERMISSION_GROUPS.flatMap(g => g.permissions);


export default function AdminRolesPage() {
  const [roles, setRoles] = React.useState<Role[]>([]);
  const [loading, setLoading] = React.useState(true);
  const { toast } = useToast();
  const { user: adminUser, laboratoryId } = useAuth();

  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [editingRole, setEditingRole] = React.useState<Role | null>(null);
  const [deletingRole, setDeletingRole] = React.useState<Role | null>(null);

  const fetchData = React.useCallback(async () => {
    if (!laboratoryId) return;
    setLoading(true);
    try {
      const rolesSnapshot = await getDocs(query(collection(db, "roles"), where("laboratoryId", "==", laboratoryId)));
      const rolesData = rolesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Role));
      setRoles(rolesData);
    } catch (error) {
      console.error("Error fetching data: ", error);
      toast({
        variant: "destructive",
        title: "Failed to fetch data",
        description: "Could not load roles from Firestore.",
      });
    } finally {
      setLoading(false);
    }
  }, [toast, laboratoryId]);

  React.useEffect(() => {
    if (laboratoryId) {
      fetchData();
    }
  }, [fetchData, laboratoryId]);

  const openCreateDialog = () => {
    setEditingRole(null);
    setIsDialogOpen(true);
  };

  const openEditDialog = (role: Role) => {
    setEditingRole(role);
    setIsDialogOpen(true);
  };
  
  const openDeleteDialog = (role: Role) => {
    setDeletingRole(role);
  };

  const handleDialogClose = () => {
    setEditingRole(null);
    setIsDialogOpen(false);
  };

  const handleFormSubmit = async (roleData: { name: string; permissions: string[] }) => {
    if (!laboratoryId) return;
    try {
      if (editingRole) {
        // Update existing role
        const roleRef = doc(db, "roles", editingRole.id);
        await updateDoc(roleRef, roleData);
        toast({ title: "Role Updated", description: `The role "${roleData.name}" has been updated.` });
      } else {
        // Create new role
        await addDoc(collection(db, "roles"), { ...roleData, laboratoryId, memberIds: [] });
        toast({ title: "Role Created", description: `The role "${roleData.name}" has been created.` });
      }
      fetchData();
      handleDialogClose();
    } catch (error) {
      console.error("Error saving role:", error);
      toast({
        variant: "destructive",
        title: "Save Failed",
        description: "Could not save the role.",
      });
    }
  };

  const handleDeleteRole = async () => {
    if (!deletingRole || !laboratoryId) return;
    try {
        const batch = writeBatch(db);
        
        // Remove role from users in the same lab
        const usersSnapshot = await getDocs(query(collection(db, "users"), where("laboratoryId", "==", laboratoryId)));
        usersSnapshot.forEach(userDoc => {
            if(userDoc.data().roleId === deletingRole.id) {
                batch.update(userDoc.ref, { roleId: '' });
            }
        });

        // Delete role
        const roleRef = doc(db, "roles", deletingRole.id);
        batch.delete(roleRef);

        await batch.commit();

      toast({ title: "Role Deleted", description: `The role "${deletingRole.name}" has been deleted.` });
      fetchData();
    } catch (error) {
      console.error("Error deleting role:", error);
      toast({
        variant: "destructive",
        title: "Deletion Failed",
        description: "Could not delete the role.",
      });
    } finally {
        setDeletingRole(null);
    }
  }

  const getPermissionLabel = (permissionId: string) => {
    return allPermissions.find(p => p.id === permissionId)?.label || permissionId;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Roles Management</h1>
          <p className="text-muted-foreground">Create and manage user roles for your laboratory.</p>
        </div>
        <HasPermission permissionId="roles:create">
            <Button onClick={openCreateDialog}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Create Role
            </Button>
        </HasPermission>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Existing Roles</CardTitle>
          <CardDescription>A list of all user roles in your laboratory.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Role Name</TableHead>
                  <TableHead>Permissions</TableHead>
                  <TableHead>Members</TableHead>
                  <TableHead><span className="sr-only">Actions</span></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={4} className="h-24 text-center">
                      <Loader2 className="mx-auto h-6 w-6 animate-spin" />
                    </TableCell>
                  </TableRow>
                ) : roles.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="h-24 text-center">
                      No roles found. Start by creating a new role.
                    </TableCell>
                  </TableRow>
                ) : (
                  roles.map((role) => (
                    <TableRow key={role.id}>
                      <TableCell className="font-medium">{role.name}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {(role.permissions || []).slice(0, 5).map(permissionId => (
                            <Badge key={permissionId} variant="secondary">{getPermissionLabel(permissionId)}</Badge>
                          ))}
                           {(role.permissions || []).length > 5 && (
                             <Badge variant="outline">+{ (role.permissions || []).length - 5} more</Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{(role.memberIds || []).length}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">Open menu</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <HasPermission permissionId="roles:update">
                                <DropdownMenuItem onClick={() => openEditDialog(role)}>Edit Role</DropdownMenuItem>
                            </HasPermission>
                            <HasPermission permissionId="roles:delete">
                                <DropdownMenuItem className="text-destructive" onClick={() => openDeleteDialog(role)}>Delete Role</DropdownMenuItem>
                            </HasPermission>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      
      <RoleDialog
        isOpen={isDialogOpen}
        onClose={handleDialogClose}
        onSubmit={handleFormSubmit}
        role={editingRole}
        permissionGroups={PERMISSION_GROUPS}
      />
      
       <AlertDialog open={!!deletingRole} onOpenChange={(open) => !open && setDeletingRole(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action will permanently delete the role "{deletingRole?.name}". This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteRole}>
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
