"use client";

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { TestDataTable } from "@/app/tests/components/test-data-table";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { TestActions } from "@/app/tests/components/test-actions";
import { Test } from "@/types/test";
import { getTests, addTest, deleteTest, updateTest, deleteAllTests } from "@/services/tests";
import { useToast } from '@/hooks/use-toast';
import { EditTestDialog } from '@/app/tests/components/edit-test-dialog';
import * as XLSX from 'xlsx';

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
  
  const handleSearch = (searchTerm: string) => {
    const lowercasedSearch = searchTerm.toLowerCase();
    const filtered = data.filter(item => 
        Object.values(item).some(val => 
            String(val).toLowerCase().includes(lowercasedSearch)
        )
    );
    setFilteredData(filtered);
  };

  const handleFilter = useCallback((filters: { accreditation: string[], materialCategory: string[] }) => {
    let newFilteredData = [...data];

    if (filters.accreditation.length > 0) {
      newFilteredData = newFilteredData.filter(item => filters.accreditation.includes(item.accreditation));
    }
    if (filters.materialCategory.length > 0) {
      newFilteredData = newFilteredData.filter(item => filters.materialCategory.includes(item.materialCategory));
    }

    setFilteredData(newFilteredData);
  }, [data]);

  const uniqueAccreditations = useMemo(() => {
    const accreditations = data.map(test => test.accreditation).filter(Boolean);
    return [...new Set(accreditations)];
  }, [data]);

  const uniqueMaterialCategories = useMemo(() => {
    const categories = data.map(test => test.materialCategory).filter(Boolean);
    return [...new Set(categories)];
  }, [data]);

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
  
  const handleImport = async (tests: Omit<Test, 'id'>[]) => {
    try {
      const importPromises = tests.map(test => addTest(test));
      await Promise.all(importPromises);
      toast({
        title: "Import Successful",
        description: `${tests.length} tests have been imported successfully.`,
      });
      fetchTests();
    } catch (error) {
       console.error("Failed to import tests:", error);
      toast({
        variant: "destructive",
        title: "Error Importing Tests",
        description: "Could not import the tests. Please check the console for more details.",
      });
    }
  };

  const handleExport = () => {
    if (data.length === 0) {
      toast({
        variant: "destructive",
        title: "Export Failed",
        description: "There is no data to export.",
      });
      return;
    }
    const worksheet = XLSX.utils.json_to_sheet(data.map(({id, ...rest}) => {
      const newObj: {[key: string]: any} = {};
      newObj['MATERIAL CATEGORY'] = rest.materialCategory;
      newObj['TEST CODE'] = rest.testCode;
      newObj['MATERIAL TEST'] = rest.materialTest;
      newObj['TEST METHOD(S)'] = rest.testMethods;
      newObj['ACCREDITATION'] = rest.accreditation;
      newObj['UNIT'] = rest.unit;
      newObj['AMOUNT (UGX)'] = rest.amountUGX;
      newObj['AMOUNT (USD)'] = rest.amountUSD;
      newObj['LEAD TIME (DAYS)'] = rest.leadTimeDays;
      return newObj;
    }));
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Tests");
    XLSX.writeFile(workbook, "Test_Data.xlsx");
     toast({
        title: "Export Successful",
        description: `Exported ${data.length} test records.`,
      });
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

  const handleDeleteAll = async () => {
    try {
      await deleteAllTests();
      toast({
        title: "All Tests Deleted",
        description: "All tests have been successfully deleted.",
      });
      fetchTests();
    } catch (error) {
      console.error("Failed to delete all tests:", error);
      toast({
        variant: "destructive",
        title: "Error Deleting All Tests",
        description: "Could not delete all tests.",
      });
    }
  }
  
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
          <CardHeader>
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
               <div className='flex-grow'>
                  <CardTitle>All Tests</CardTitle>
                  <CardDescription>A comprehensive list of all tests conducted in the laboratory.</CardDescription>
              </div>
              <TestActions 
                onSearch={handleSearch}
                onExport={handleExport}
                onImport={handleImport}
                onTestCreated={handleTestCreated}
                onDeleteAll={handleDeleteAll}
                onFilter={handleFilter}
                accreditations={uniqueAccreditations}
                materialCategories={uniqueMaterialCategories}
              />
            </div>
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
