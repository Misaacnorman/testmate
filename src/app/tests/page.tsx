"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { TestDataTable } from "./components/test-data-table";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { TestActions } from "./components/test-actions";
import { Test } from "@/types/test";
import { getTests, addTest, deleteTest, updateTest } from "@/services/tests";
import { useToast } from '@/hooks/use-toast';
import { EditTestDialog } from './components/edit-test-dialog';

export default function TestsPage() {
  const [data, setData] = useState<Test[]>([]);
  const [filteredData, setFilteredData] = useState<Test[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const [editingTest, setEditingTest] = useState<Test | null>(null);

  const fetchTests = useCallback(async () => {
    setIsLoading(true);
    try {
      const tests = await getTests();
      setData(tests);
      setFilteredData(tests);
    } catch (error) {
      console.error("Failed to fetch tests:", error);
      toast({
        variant: "destructive",
        title: "Error fetching tests",
        description: "Could not retrieve tests from the database.",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchTests();
  }, [fetchTests]);

  const handleTestCreated = async (test: Omit<Test, 'id'>) => {
    try {
      const newTest = await addTest(test);
      toast({
        title: "Test Created",
        description: `Test "${newTest.materialTest}" has been successfully created.`,
      });
      fetchTests();
    } catch (error) {
      console.error("Failed to create test:", error);
      toast({
        variant: "destructive",
        title: "Error creating test",
        description: "Could not save the new test.",
      });
    }
  };

  const handleTestUpdated = async (test: Test) => {
    try {
      await updateTest(test);
      toast({
        title: "Test Updated",
        description: `Test "${test.materialTest}" has been successfully updated.`,
      });
      setEditingTest(null);
      fetchTests();
    } catch (error) {
      console.error("Failed to update test:", error);
      toast({
        variant: "destructive",
        title: "Error updating test",
        description: "Could not save the updated test.",
      });
    }
  };

  const handleTestDeleted = async (testId: string) => {
    try {
      await deleteTest(testId);
      toast({
        title: "Test Deleted",
        description: "The test has been successfully deleted.",
      });
      fetchTests(); // Refetch data to update the table
    } catch (error) {
      console.error("Failed to delete test:", error);
      toast({
        variant: "destructive",
        title: "Error deleting test",
        description: "Could not delete the test.",
      });
    }
  };

  const handleDataUpdate = (newData: Test[]) => {
      setData(newData);
      setFilteredData(newData);
      // Here you might want to batch write the new data to Firestore
      // For simplicity, we'll just update the local state.
      // A full implementation would involve a more complex sync logic.
      toast({
        title: "Data Updated",
        description: `${newData.length - data.length} new records added locally.`,
      });
  };
  
  return (
    <>
      <div className="flex-1 space-y-4 p-4 sm:p-6 md:p-8">
        <div className="flex items-center justify-between space-y-2">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Test Management</h2>
            <p className="text-muted-foreground">
              View, search, and manage all laboratory tests.
            </p>
          </div>
        </div>
        <Card>
          <CardHeader className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <CardTitle>All Tests</CardTitle>
              <CardDescription>A comprehensive list of all tests conducted in the laboratory.</CardDescription>
            </div>
            <TestActions 
              allData={data} 
              onFilter={setFilteredData} 
              onDataUpdate={handleDataUpdate}
              onTestCreated={handleTestCreated}
            />
          </CardHeader>
          <CardContent>
            <TestDataTable data={filteredData} isLoading={isLoading} onEditTest={setEditingTest} onDeleteTest={handleTestDeleted} />
          </CardContent>
        </Card>
      </div>
      {editingTest && (
        <EditTestDialog
          test={editingTest}
          onTestUpdated={handleTestUpdated}
          onOpenChange={(open) => !open && setEditingTest(null)}
        />
      )}
    </>
  );
}
