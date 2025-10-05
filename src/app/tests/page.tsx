
"use client";

import * as React from "react";
import {
  collection,
  getDocs,
  doc,
  writeBatch,
  deleteDoc,
  addDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { Test } from "@/lib/types";
import { TestDataTable } from "./components/test-data-table";
import { getColumns } from "./components/columns";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { CreateTestDialog } from "./components/create-test-dialog";
import { EditTestDialog } from "./components/edit-test-dialog";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
  } from "@/components/ui/alert-dialog";
import { HasPermission } from "@/components/auth/has-permission";

export default function TestsPage() {
  const [tests, setTests] = React.useState<Test[]>([]);
  const [loading, setLoading] = React.useState(true);
  const { toast } = useToast();

  const [isCreateDialogOpen, setIsCreateDialogOpen] = React.useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false);
  const [editingTest, setEditingTest] = React.useState<Test | null>(null);

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);
  const [deletingTest, setDeletingTest] = React.useState<Test | null>(null);
  const [deletingIds, setDeletingIds] = React.useState<string[]>([]);


  const fetchTests = async () => {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, "tests"));
      const testsData = querySnapshot.docs.map(
        (doc) => ({ id: doc.id, ...doc.data() } as Test)
      );
      setTests(testsData);
    } catch (error) {
      console.error("Error fetching tests:", error);
      toast({
        variant: "destructive",
        title: "Failed to fetch tests",
        description: "Could not load tests from the database. Check console for details.",
      });
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchTests();
  }, [toast]);

  const handleCreateTest = async (newTestData: Omit<Test, 'id'>) => {
    try {
      await addDoc(collection(db, "tests"), newTestData);
      toast({
        title: "Test Created",
        description: "The new test has been added successfully.",
      });
      fetchTests(); // Refresh data
      setIsCreateDialogOpen(false);
    } catch (error) {
      console.error("Error creating test:", error);
      toast({
        variant: "destructive",
        title: "Creation Failed",
        description: "Could not create the new test. Check console for details.",
      });
    }
  };

  const handleEditTest = async (updatedTest: Test) => {
    if (!updatedTest.id) return;
    try {
      const { id, ...testData } = updatedTest;
      await updateDoc(doc(db, "tests", id), testData);
      toast({
        title: "Test Updated",
        description: "The test has been updated successfully.",
      });
      fetchTests(); // Refresh data
      setIsEditDialogOpen(false);
      setEditingTest(null);
    } catch (error) {
      console.error("Error updating test:", error);
      toast({
        variant: "destructive",
        title: "Update Failed",
        description: "Could not update the test. Check console for details.",
      });
    }
  };
  
  const openEditDialog = (test: Test) => {
    setEditingTest(test);
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (test: Test) => {
    setDeletingTest(test);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteTest = async () => {
    if (!deletingTest || !deletingTest.id) return;
    try {
      await deleteDoc(doc(db, "tests", deletingTest.id));
      toast({
        title: "Test Deleted",
        description: "The test has been successfully deleted.",
      });
      fetchTests();
    } catch (error) {
      console.error("Error deleting test:", error);
      toast({
        variant: "destructive",
        title: "Deletion Failed",
        description: "Could not delete the test. Check console for details.",
      });
    } finally {
        setIsDeleteDialogOpen(false);
        setDeletingTest(null);
    }
  };

  const openBulkDeleteDialog = (ids: string[]) => {
    setDeletingIds(ids);
    setIsDeleteDialogOpen(true);
  };

  const handleBulkDelete = async () => {
    try {
      const batch = writeBatch(db);
      deletingIds.forEach(id => {
        batch.delete(doc(db, "tests", id));
      });
      await batch.commit();

      toast({
        title: "Tests Deleted",
        description: `${deletingIds.length} tests have been deleted.`,
      });
      fetchTests();
    } catch (error) {
        console.error("Error deleting tests:", error);
        toast({
            variant: "destructive",
            title: "Bulk Deletion Failed",
            description: "Could not delete the selected tests. Check console for details.",
        });
    } finally {
        setIsDeleteDialogOpen(false);
        setDeletingIds([]);
    }
  };


  const columns = getColumns(openEditDialog, openDeleteDialog);


  return (
    <>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Test Catalog</h1>
            <p className="text-muted-foreground">
              Manage your laboratory's test offerings.
            </p>
          </div>
          <HasPermission permissionId="tests:create">
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Create Test
            </Button>
          </HasPermission>
        </div>
        <TestDataTable
          columns={columns}
          data={tests}
          loading={loading}
          onRefresh={fetchTests}
          onDeleteSelected={openBulkDeleteDialog}
        />
      </div>

      <CreateTestDialog
        isOpen={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
        onSubmit={handleCreateTest}
      />
      {editingTest && (
        <EditTestDialog
          isOpen={isEditDialogOpen}
          onClose={() => {
            setIsEditDialogOpen(false);
            setEditingTest(null);
          }}
          onSubmit={handleEditTest}
          test={editingTest}
        />
      )}
       <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              {deletingTest ? `This action will permanently delete the test "${deletingTest.materialTest}".` : `This action will permanently delete ${deletingIds.length} selected tests.`}
               This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={deletingTest ? handleDeleteTest : handleBulkDelete}>
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
